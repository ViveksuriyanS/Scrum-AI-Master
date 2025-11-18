import React from 'react';
import { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{currentPage}</h1>
      <div className="flex items-center">
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          End Sprint
        </button>
      </div>
    </header>
  );
};
