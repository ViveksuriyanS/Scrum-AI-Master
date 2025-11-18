import { Task, TeamMember } from '../types';
import { INITIAL_TASKS, TEAM_MEMBERS } from '../constants';

const TASKS_STORAGE_KEY = 'scrum-ai-master-tasks';
const TEAM_MEMBERS_STORAGE_KEY = 'scrum-ai-master-team-members';

interface AppState {
  tasks: Task[];
  teamMembers: TeamMember[];
}

export const saveState = (state: AppState): void => {
  try {
    const tasksJson = JSON.stringify(state.tasks);
    localStorage.setItem(TASKS_STORAGE_KEY, tasksJson);

    const teamMembersJson = JSON.stringify(state.teamMembers);
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, teamMembersJson);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

export const loadState = (): AppState => {
  try {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
    const teamMembersJson = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);

    const tasks = tasksJson ? JSON.parse(tasksJson) : INITIAL_TASKS;
    const teamMembers = teamMembersJson ? JSON.parse(teamMembersJson) : TEAM_MEMBERS;

    return { tasks, teamMembers };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    // Fallback to initial data if there's an error (e.g., corrupted data)
    return {
      tasks: INITIAL_TASKS,
      teamMembers: TEAM_MEMBERS,
    };
  }
};
