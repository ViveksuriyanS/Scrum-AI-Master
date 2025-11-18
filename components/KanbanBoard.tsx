import React from 'react';
import { TaskCard } from './TaskCard';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const KanbanColumn: React.FC<{ title: TaskStatus; tasks: Task[]; teamMembers: TeamMember[]; updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void; }> = ({ title, tasks, teamMembers, updateTaskStatus }) => {
  const statusColorMap: { [key in TaskStatus]: string } = {
    'To Do': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Blocked': 'bg-red-500',
    'In Review': 'bg-purple-500',
    'Done': 'bg-green-500'
  };

  const priorityOrder: { [key in TaskPriority]: number } = {
    'Urgent': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
  };

  const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex-1 min-w-72">
      <div className="flex items-center mb-4">
        <span className={`h-2.5 w-2.5 rounded-full ${statusColorMap[title]} mr-2`}></span>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <span className="ml-auto text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="space-y-4">
        {sortedTasks.map(task => (
          <TaskCard key={task.id} task={task} teamMembers={teamMembers} updateTaskStatus={updateTaskStatus} />
        ))}
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, teamMembers, updateTaskStatus }) => {
  const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Blocked', 'In Review', 'Done'];

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">SAM Task Board</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4">
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            title={status}
            tasks={tasks.filter(t => t.status === status)}
            teamMembers={teamMembers}
            updateTaskStatus={updateTaskStatus}
          />
        ))}
      </div>
    </div>
  );
};