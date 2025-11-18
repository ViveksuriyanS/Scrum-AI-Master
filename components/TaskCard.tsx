import React from 'react';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';
import { PriorityUrgentIcon, PriorityHighIcon, PriorityMediumIcon, PriorityLowIcon } from './icons';

interface TaskCardProps {
  task: Task;
  teamMembers: TeamMember[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const PriorityIcon: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const priorityMap: { [key in TaskPriority]: { icon: React.ElementType, color: string } } = {
    'Urgent': { icon: PriorityUrgentIcon, color: 'text-red-500' },
    'High': { icon: PriorityHighIcon, color: 'text-orange-500' },
    'Medium': { icon: PriorityMediumIcon, color: 'text-yellow-500' },
    'Low': { icon: PriorityLowIcon, color: 'text-green-500' },
  };
  const { icon: Icon, color } = priorityMap[priority];
  return <Icon className={`h-4 w-4 ${color}`} />;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, teamMembers, updateTaskStatus }) => {
  const assignee = teamMembers.find(m => m.id === task.assigneeId);
  
  const nextStatus: { [key in TaskStatus]?: TaskStatus } = {
    'To Do': 'In Progress',
    'In Progress': 'In Review',
    'Blocked': 'In Progress',
    'In Review': 'Done',
  };
  
  const buttonText: { [key in TaskStatus]?: string } = {
    'To Do': 'Start Progress',
    'In Progress': 'Request Review',
    'Blocked': 'Unblock',
    'In Review': 'Approve',
  };

  const handleMove = () => {
    const newStatus = nextStatus[task.status];
    if (newStatus) {
      updateTaskStatus(task.id, newStatus);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
            <div title={task.priority}>
                 <PriorityIcon priority={task.priority} />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
        </div>
        <div className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full px-2 py-1 flex-shrink-0">{task.points}</div>
      </div>
      <div className="flex items-center justify-between mt-4 gap-2">
        <div className="flex items-center min-w-0">
          {assignee && (
            <img className="h-6 w-6 rounded-full object-cover flex-shrink-0" src={assignee.avatar} alt={assignee.name} title={assignee.name} />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 truncate">{assignee?.name || 'Unassigned'}</span>
        </div>
        {task.status !== 'Done' && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {task.status === 'In Progress' && (
               <button 
                onClick={() => updateTaskStatus(task.id, 'Blocked')}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                >
                    Block
                </button>
            )}
            <button 
                onClick={handleMove}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors whitespace-nowrap"
            >
                {buttonText[task.status]} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};