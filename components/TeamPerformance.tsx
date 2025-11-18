import React from 'react';
import { Task, TeamMember } from '../types';

interface TeamPerformanceProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

export const TeamPerformance: React.FC<TeamPerformanceProps> = ({ tasks, teamMembers }) => {
  const completedTasks = tasks.filter(t => t.status === 'Done');
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const completedPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
  const velocity = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const memberStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assigneeId === member.id);
    const memberCompletedTasks = memberTasks.filter(t => t.status === 'Done');
    const memberCompletedPoints = memberCompletedTasks.reduce((sum, task) => sum + task.points, 0);
    return { ...member, tasksCompleted: memberCompletedTasks.length, pointsCompleted: memberCompletedPoints };
  });

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sprint Performance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tasks Completed" value={`${completedTasks.length} / ${tasks.length}`} />
        <StatCard title="Points Delivered" value={`${completedPoints} / ${totalPoints}`} />
        <StatCard title="Velocity" value={`${velocity}%`} />
        <StatCard title="Team Size" value={teamMembers.length} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Team Contribution</h3>
        <div className="space-y-3">
          {memberStats.map(member => (
            <div key={member.id} className="flex items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
              <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full" />
              <p className="ml-3 font-medium text-sm text-gray-700 dark:text-gray-300 flex-1">{member.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks: <span className="font-semibold text-gray-800 dark:text-gray-200">{member.tasksCompleted}</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">Points: <span className="font-semibold text-gray-800 dark:text-gray-200">{member.pointsCompleted}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};