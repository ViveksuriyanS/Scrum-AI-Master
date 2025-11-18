
import React, { useState, useEffect } from 'react';
import { Task, TeamMember, CodeReviewSuggestion } from '../types';
import { suggestReviewer } from '../services/geminiService';
import { RobotIcon, CloseIcon } from './icons';

interface CodeReviewModalProps {
  task: Task;
  teamMembers: TeamMember[];
  onClose: () => void;
}

export const CodeReviewModal: React.FC<CodeReviewModalProps> = ({ task, teamMembers, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<CodeReviewSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSuggestion = async () => {
      try {
        setIsLoading(true);
        const result = await suggestReviewer(task, teamMembers);
        setSuggestion(result);
      } catch (err) {
        setError('Failed to get a suggestion from the AI.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getSuggestion();
  }, [task, teamMembers]);

  const suggestedReviewer = teamMembers.find(m => m.name === suggestion?.reviewerName);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                <RobotIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Code Review Agent</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Task: {task.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 text-center">
            {isLoading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && suggestion && suggestedReviewer && (
              <div className="flex flex-col items-center">
                <img src={suggestedReviewer.avatar} alt={suggestedReviewer.name} className="h-20 w-20 rounded-full border-4 border-indigo-200 dark:border-indigo-700" />
                <p className="mt-3 font-semibold text-gray-800 dark:text-gray-200">AI suggests <span className="text-indigo-500">{suggestedReviewer.name}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{suggestion.reason}"</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 rounded-b-2xl flex items-center justify-end space-x-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                onClick={onClose}
                disabled={isLoading || !!error}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Thinking...' : `Notify ${suggestedReviewer?.name || 'Reviewer'}`}
            </button>
        </div>
      </div>
    </div>
  );
};
