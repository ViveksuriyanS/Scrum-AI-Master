
import React from 'react';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const isBlocked = member.dailyUpdate?.toLowerCase().includes('block');
  
  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <img className="h-12 w-12 rounded-full object-cover" src={member.avatar} alt={member.name} />
        <div className="ml-4">
          <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
        </div>
        {isBlocked && (
            <span className="ml-auto text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-full">BLOCKED</span>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 italic">"{member.dailyUpdate}"</p>
    </div>
  );
};
