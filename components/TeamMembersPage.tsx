import React, { useState } from 'react';
import { TeamMember } from '../types';
import { PlusCircleIcon } from './icons';
import { AddTeamMemberModal } from './AddTeamMemberModal';

interface TeamMembersPageProps {
  teamMembers: TeamMember[];
  addTeamMember: (memberData: Omit<TeamMember, 'id' | 'avatar'>) => void;
}

export const TeamMembersPage: React.FC<TeamMembersPageProps> = ({ teamMembers, addTeamMember }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTeamMember={addTeamMember}
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Team Members</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add New Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 text-center">
              <img className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-200 dark:ring-indigo-800 mx-auto" src={member.avatar} alt={member.name} />
              <p className="mt-4 text-lg font-bold text-gray-800 dark:text-white">{member.name}</p>
              <p className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{member.role}</p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic h-20 overflow-hidden">"{member.dailyUpdate}"</p>
              <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 focus:outline-none">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};