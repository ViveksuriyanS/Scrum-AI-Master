

import { Task, TeamMember } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'U-1', name: 'Alice', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=alice', role: 'Frontend Dev', dailyUpdate: "Finished the login page UI. Starting on the dashboard layout. No blockers." },
  { id: 'U-2', name: 'Bob', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=bob', role: 'Backend Dev', dailyUpdate: "Deployed the new authentication service. Currently working on the user profile endpoint. Blocked by API gateway configuration." },
  { id: 'U-3', name: 'Charlie', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=charlie', role: 'UX/UI Designer', dailyUpdate: "Completed mockups for the settings page. Will be gathering feedback from the team today." },
  { id: 'U-4', name: 'Diana', email: 'diana@example.com', avatar: 'https://i.pravatar.cc/150?u=diana', role: 'QA Engineer', dailyUpdate: "Wrote test cases for the login flow. Found a minor bug on password validation, SAM ticket created." },
];

export const INITIAL_TASKS: Task[] = [
  { id: 'T-1', title: 'Implement User Login UI', assigneeId: 'U-1', status: 'Done', points: 5, priority: 'High' },
  { id: 'T-2', title: 'Develop Authentication API', assigneeId: 'U-2', status: 'Done', points: 8, priority: 'High' },
  { id: 'T-3', title: 'Design Settings Page Mockups', assigneeId: 'U-3', status: 'In Review', points: 3, priority: 'Medium' },
  { id: 'T-4', title: 'Write Test Cases for Auth', assigneeId: 'U-4', status: 'In Progress', points: 5, priority: 'High' },
  { id: 'T-5', title: 'Build Dashboard Layout', assigneeId: 'U-1', status: 'In Progress', points: 8, priority: 'Urgent' },
  { id: 'T-6', title: 'Create User Profile Endpoint', assigneeId: 'U-2', status: 'To Do', points: 5, priority: 'Medium' },
  { id: 'T-7', title: 'Setup CI/CD Pipeline', assigneeId: 'U-2', status: 'To Do', points: 8, priority: 'Low' },
];