import React, { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { Task, TeamMember, TaskStatus } from '../types';
import { PlusCircleIcon } from './icons';
import { AddTaskModal } from './AddTaskModal';

interface TaskBoardPageProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (newTask: Omit<Task, 'id' | 'status'> & { status?: TaskStatus }) => void;
}

export const TaskBoardPage: React.FC<TaskBoardPageProps> = ({ tasks, teamMembers, updateTaskStatus, addTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamMembers={teamMembers}
        onAddTask={addTask}
      />
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Task Board</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add New Task
          </button>
        </div>
        <div className="flex-grow">
          <KanbanBoard tasks={tasks} teamMembers={teamMembers} updateTaskStatus={updateTaskStatus} />
        </div>
      </div>
    </>
  );
};