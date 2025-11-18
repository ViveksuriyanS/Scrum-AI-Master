import { GoogleGenAI, FunctionDeclaration, Type, Part } from "@google/genai";
import { TeamMember, Task, CodeReviewSuggestion, MeetingSummary } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a GoogleGenAI.Part object with base64-encoded data.
 * @param file The file to convert.
 * @returns A promise that resolves to a Part object for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:audio/wav;base64,"),
        // which we need to remove before sending to the API.
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to read file as a base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const createTaskFunctionDeclaration: FunctionDeclaration = {
  name: 'createTask',
  description: 'Creates a new task and assigns it to a team member.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The title of the task.',
      },
      assigneeName: {
        type: Type.STRING,
        description: 'The name of the person to whom the task is assigned.',
      },
      points: {
        type: Type.NUMBER,
        description: 'The story points or weightage of the task.',
      },
    },
    required: ['title', 'assigneeName', 'points'],
  },
};

const rescheduleMeetingFunctionDeclaration: FunctionDeclaration = {
  name: 'rescheduleMeeting',
  description: 'Reschedules the daily stand-up meeting to a new time.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      time: {
        type: Type.STRING,
        description: 'The new time for the meeting (e.g., "10:00 AM").',
      },
    },
    required: ['time'],
  },
};


export const generateSummary = async (updates: string) => {
  try {
    const prompt = `You are an expert Scrum Master. Based on the following daily standup updates, generate a concise summary. The summary should be well-structured. Use markdown for formatting. Identify key achievements, work in progress, and any blockers.
    
    Today's Updates:
    ${updates}
    
    Generate the summary now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Sorry, I couldn't generate a summary at this time.";
  }
};


export const processAiPrompt = async (prompt: string, teamMembers: TeamMember[], tasks: Task[]) => {
  try {
    const validAssignees = teamMembers.map(m => m.name).join(', ');
    const systemInstruction = `You are a helpful Scrum AI assistant. Your capabilities include:
1.  Creating new tasks.
2.  Rescheduling the daily meeting.
3.  Answering questions about existing tasks, such as their status or any blockers.

You have been provided with the following context about the current sprint:
- A list of all tasks on the board.
- A list of all team members and their most recent daily updates.

**How to answer questions about tasks:**
If a user asks about a task's details or blockers (e.g., "what are the blockers for T-2?"), follow these steps:
1.  Find the task in the task list.
2.  Identify the assignee of that task.
3.  Look up that assignee in the team member list.
4.  Read their \`dailyUpdate\` to find the answer. Information about blockers is usually found here.
5.  Formulate a clear, concise answer based on what you find. For example: "**Bob:** Blocked by API gateway configuration..."

**Available Team Members for Task Assignment**: ${validAssignees}.

Here is the context data in JSON format:
Team Members: ${JSON.stringify(teamMembers.map(m => ({ id: m.id, name: m.name, dailyUpdate: m.dailyUpdate })))}
Tasks: ${JSON.stringify(tasks)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [createTaskFunctionDeclaration, rescheduleMeetingFunctionDeclaration] }],
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      return { type: 'functionCall' as const, data: response.functionCalls[0] };
    } else {
      return { type: 'text' as const, data: response.text };
    }
  } catch (error) {
    console.error("Error processing AI prompt:", error);
    return { type: 'text' as const, data: "Sorry, I encountered an error. Please try again." };
  }
};

export const suggestReviewer = async (task: Task, teamMembers: TeamMember[]): Promise<CodeReviewSuggestion> => {
  try {
    const assignee = teamMembers.find(m => m.id === task.assigneeId);
    if (!assignee) throw new Error("Assignee not found");

    const potentialReviewers = teamMembers
      .filter(m => m.id !== assignee.id && (m.role.includes('Dev') || m.role.includes('Engineer')))
      .map(m => ({ name: m.name, role: m.role }));
    
    if (potentialReviewers.length === 0) {
      return { reviewerName: 'Anyone', reason: 'No other developers are available on the team.' };
    }

    const prompt = `
      A team member, ${assignee.name} (${assignee.role}), has just finished the task "${task.title}" and it needs a code review.
      Based on the list of available team members, please suggest the most suitable person to review the code.
      Prioritize peers with similar roles (e.g., another developer).
      
      Available reviewers:
      ${JSON.stringify(potentialReviewers)}
      
      Return your suggestion as a JSON object with the reviewer's name and a brief, one-sentence reason for your choice.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reviewerName: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ['reviewerName', 'reason']
        },
      },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as CodeReviewSuggestion;
  } catch (error) {
    console.error("Error suggesting reviewer:", error);
    // Fallback in case of API error
    const fallbackReviewer = teamMembers.find(m => m.id !== task.assigneeId);
    return {
      reviewerName: fallbackReviewer ? fallbackReviewer.name : "Team",
      reason: "An error occurred, please select a reviewer manually."
    };
  }
};

export const summarizeMeetingMedia = async (file: File, teamMembers: TeamMember[]): Promise<MeetingSummary> => {
  // Step 1: Convert the file to a base64 Part object for inline data.
  // This is more reliable than using GCS URIs, which can cause errors.
  const mediaPart = await fileToGenerativePart(file);

  const textPart = {
    text: `
      You are an expert Scrum Master AI. Your first step is to process the provided media file (text, audio, or video) and convert it into a text transcript.

      Processing Instructions:
      - If the file is raw text, use it as is.
      - If the file is an audio or video recording, transcribe the entire conversation.
      - **Diarization**: When transcribing audio or video, make your best effort to identify and label different speakers (e.g., 'Speaker 1:', 'Speaker 2:').

      After generating the transcript, your second step is to analyze it to produce a concise summary and extract all action items and tasks.

      Analysis Guidelines:
      1.  **Summary**: Provide a brief, neutral summary of the meeting's key discussions and outcomes based on the transcript.
      2.  **Task Extraction**: Identify every task, action item, or commitment from the transcript.
      3.  **Assignee**: Determine who is responsible for each task. Use one of the names from the provided team list.
      4.  **Status**: Assign a status to each task from this list: 'To Do', 'In Progress', 'Blocked', 'Done'.
      5.  **Task Type**: If a task is explicitly mentioned as a 'bug fix' or needs a 'patch', prepend '[Bug Fix]' or '[Patch Needed]' to the task title.
      6.  **Story Points**: Assign a reasonable story point value (1, 2, 3, 5, 8) to each new task based on its implied complexity.
      7.  **Output**: Return a single JSON object.

      Team Members: ${teamMembers.map(m => m.name).join(', ')}

      Now, process the file and generate the JSON output.
    `
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [mediaPart, textPart] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                assigneeName: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['To Do', 'In Progress', 'Blocked', 'Done'] },
                points: { type: Type.NUMBER }
              },
              required: ['title', 'assigneeName', 'status', 'points']
            }
          }
        },
        required: ['summary', 'tasks']
      },
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as MeetingSummary;
};