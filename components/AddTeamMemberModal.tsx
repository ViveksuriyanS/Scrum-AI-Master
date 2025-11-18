import React, { useState } from 'react';
import { TeamMember } from '../types';
import { CloseIcon } from './icons';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeamMember: (memberData: Omit<TeamMember, 'id' | 'avatar'>) => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ isOpen, onClose, onAddTeamMember }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dailyUpdate, setDailyUpdate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !dailyUpdate.trim()) {
      setError('All fields are required.');
      return;
    }
    onAddTeamMember({
      name,
      role,
      dailyUpdate
    });
    // Reset form and close modal
    setName('');
    setRole('');
    setDailyUpdate('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Team Member</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Frontend Dev"
                required
              />
            </div>

            <div>
              <label htmlFor="dailyUpdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Daily Update</label>
              <textarea
                id="dailyUpdate"
                value={dailyUpdate}
                onChange={(e) => setDailyUpdate(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="What are you working on?"
                required
              />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 rounded-b-2xl flex items-center justify-end space-x-3">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                  Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  Add Member
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};