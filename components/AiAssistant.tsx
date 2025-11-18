import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateSummary, processAiPrompt } from '../services/geminiService';
import { TeamMember, AiMessage, Task, Meeting } from '../types';
import { TEAM_MEMBERS } from '../constants';
import { SendIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from './icons';
import { FunctionCall } from '@google/genai';

interface AiAssistantProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  addTask: (newTask: Omit<Task, 'id' | 'status'>) => void;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ teamMembers, tasks, addTask, setMeeting }) => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInitialSummary = useCallback(async () => {
    setIsLoading(true);
    setMessages([{ role: 'model', text: 'Generating daily stand-up summary...' }]);
    const updates = TEAM_MEMBERS.map(m => `${m.name}: ${m.dailyUpdate}`).join('\n');
    const summary = await generateSummary(updates);
    setMessages([{ role: 'model', text: summary, isSummary: true }]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    handleInitialSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: AiMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const isPerformanceQuery = input.toLowerCase().includes('performance') || input.toLowerCase().includes('how is the team');
      let promptForAi = input;

      if (isPerformanceQuery) {
        const completedTasks = tasks.filter(t => t.status === 'Done');
        const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
        const completedPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
        const performanceData = {
            totalTasks: tasks.length,
            completedTasks: completedTasks.length,
            totalPoints,
            completedPoints,
        };
        promptForAi = `The user is asking about team performance. Here is the current sprint data: ${JSON.stringify(performanceData)}. Based on this data, provide a concise, encouraging summary to answer the user's question: "${input}"`;
      }
      
      const response = await processAiPrompt(promptForAi, teamMembers, tasks);
      
      if (response.type === 'functionCall') {
        const fc = response.data as FunctionCall;
        if (fc.name === 'createTask' && fc.args) {
          // FIX: Cast function call arguments to their expected types.
          const title = fc.args.title as string;
          const assigneeName = fc.args.assigneeName as string;
          const points = fc.args.points as number;
          const assignee = teamMembers.find(m => m.name.toLowerCase() === assigneeName.toLowerCase());

          if (assignee) {
            // FIX: Add default priority to meet Task type requirements.
            addTask({ title, assigneeId: assignee.id, points, priority: 'Medium' });
            const modelMessage: AiMessage = { role: 'model', text: `OK, I've created the task "${title}" and assigned it to ${assignee.name} with ${points} points.` };
            setMessages(prev => [...prev, modelMessage]);
          } else {
            const modelMessage: AiMessage = { role: 'model', text: `Sorry, I couldn't find a team member named "${assigneeName}". Please use one of the available team members.` };
            setMessages(prev => [...prev, modelMessage]);
          }
        } else if (fc.name === 'rescheduleMeeting' && fc.args) {
            // FIX: Cast function call argument to its expected type.
            const time = fc.args.time as string;
            setMeeting(prev => prev ? { ...prev, time, scheduled: true } : { time, scheduled: true, attendees: teamMembers.map(m => m.id) });
            const modelMessage: AiMessage = { role: 'model', text: `OK, I've rescheduled the daily stand-up to ${time}.` };
            setMessages(prev => [...prev, modelMessage]);
        }
      } else {
        const modelMessage: AiMessage = { role: 'model', text: response.data as string };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
        const errorMessage: AiMessage = { role: 'model', text: "An error occurred. Please check the console." };
        setMessages(prev => [...prev, errorMessage]);
        console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg flex flex-col ${isExpanded ? 'h-[80vh] max-h-[850px]' : ''}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-4 w-full text-left flex items-center justify-between ${isExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
            <SparklesIcon className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg font-semibold ml-2 text-gray-800 dark:text-white">Scrum AI Assistant</h3>
        </div>
        {isExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
      </button>

      {isExpanded && (
        <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-sm ${
                    msg.role === 'user' 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                    {msg.isSummary ? (
                        <article className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                    ) : (
                        <p className="text-sm">{msg.text}</p>
                    )}
                    </div>
                </div>
                ))}
                {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1"></div>
                        </div>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI to create a task..."
                    className="flex-1 w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
                    disabled={isLoading}
                />
                <button type="submit" className="ml-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                    <SendIcon className="h-5 w-5" />
                </button>
                </form>
            </div>
        </>
      )}
    </div>
  );
};
