import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Task, TeamMember, Meeting, TaskStatus, User } from './types';
import { INITIAL_TASKS, TEAM_MEMBERS } from './constants';
import { TaskBoardPage } from './components/TaskBoardPage';
import { TeamMembersPage } from './components/TeamMembersPage';
import { SettingsPage } from './components/SettingsPage';
import { Login } from './components/Login';

export type Page = 'Dashboard' | 'Task Board' | 'Team Members' | 'Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>({
    name: 'Scrum Master',
    email: 'scrum.master@example.com',
    picture: 'https://i.pravatar.cc/150?u=scrum-master'
  });
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [meeting, setMeeting] = useState<Meeting | null>({
    time: '09:30 AM',
    scheduled: true,
    attendees: TEAM_MEMBERS.map(m => m.id)
  });
  const [reviewTask, setReviewTask] = useState<Task | null>(null);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate && newStatus === 'In Review' && taskToUpdate.status !== 'In Review') {
      setReviewTask({ ...taskToUpdate, status: newStatus });
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'status'> & { status?: TaskStatus }) => {
    setTasks(prevTasks => [
      ...prevTasks,
      {
        ...newTask,
        id: `T-${Math.floor(Math.random() * 1000) + prevTasks.length}`,
        status: newTask.status || 'To Do',
      }
    ]);
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'avatar'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `U-${Math.floor(Math.random() * 100) + teamMembers.length}`,
      avatar: `https://i.pravatar.cc/150?u=${memberData.name.toLowerCase().replace(/\s/g, '')}`
    };
    setTeamMembers(prevMembers => [...prevMembers, newMember]);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Task Board':
        return <TaskBoardPage tasks={tasks} teamMembers={teamMembers} updateTaskStatus={updateTaskStatus} addTask={addTask} />;
      case 'Team Members':
        return <TeamMembersPage teamMembers={teamMembers} addTeamMember={addTeamMember} />;
      case 'Settings':
        return <SettingsPage />;
      case 'Dashboard':
      default:
        return (
          <Dashboard
            tasks={tasks}
            teamMembers={teamMembers}
            meeting={meeting}
            setMeeting={setMeeting}
            updateTaskStatus={updateTaskStatus}
            addTask={addTask}
            reviewTask={reviewTask}
            setReviewTask={setReviewTask}
          />
        );
    }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;