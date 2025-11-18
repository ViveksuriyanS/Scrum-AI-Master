import React from 'react';
import { DashboardIcon, BoardIcon, TeamIcon, SettingsIcon, SparklesIcon, LogoutIcon } from './icons';
import { Page } from '../App';
import { User } from '../types';

interface NavLinkProps {
  icon: React.ReactNode;
  label: Page;
  active: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-indigo-500 text-white shadow-lg'
        : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </a>
);

interface SidebarProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage, onLogout }) => {
  const navItems: { label: Page; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <DashboardIcon className="h-6 w-6" /> },
    { label: 'Task Board', icon: <BoardIcon className="h-6 w-6" /> },
    { label: 'Team Members', icon: <TeamIcon className="h-6 w-6" /> },
    { label: 'Settings', icon: <SettingsIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <SparklesIcon className="h-8 w-8 text-indigo-500" />
        <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Scrum AI</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map(({ label, icon }) => (
          <NavLink
            key={label}
            icon={icon}
            label={label}
            active={currentPage === label}
            onClick={() => setCurrentPage(label)}
          />
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <img className="h-10 w-10 rounded-full object-cover flex-shrink-0" src={user.picture} alt={user.name} />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="ml-2 p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            title="Logout"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};