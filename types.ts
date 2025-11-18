export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  points: number;
  priority: TaskPriority;
}

export interface TeamMember {
  id:string;
  name: string;
  avatar: string;
  role: string;
  dailyUpdate?: string;
  email?: string;
}

export interface Meeting {
  time: string;
  scheduled: boolean;
  attendees: string[];
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
  isSummary?: boolean;
}

export interface CodeReviewSuggestion {
  reviewerName: string;
  reason: string;
}

export interface SummarizedTask {
  title: string;
  assigneeName: string;
  status: TaskStatus;
  points: number;
}

export interface MeetingSummary {
  summary: string;
  tasks: SummarizedTask[];
}