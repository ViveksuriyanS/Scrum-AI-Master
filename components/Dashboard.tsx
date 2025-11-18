import React from 'react';
import { KanbanBoard } from './KanbanBoard';
import { AiAssistant } from './AiAssistant';
import { MeetingModal } from './MeetingModal';
import { TeamMemberCard } from './TeamMemberCard';
import { Task, TeamMember, Meeting, TaskStatus } from '../types';
import { TeamPerformance } from './TeamPerformance';
import { CodeReviewModal } from './CodeReviewModal';
import { MeetingSummaryUploader } from './MeetingSummaryUploader';

interface DashboardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  meeting: Meeting | null;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (newTask: Omit<Task, 'id' | 'status'> & { status?: TaskStatus }) => void;
  reviewTask: Task | null;
  setReviewTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, teamMembers, meeting, setMeeting, updateTaskStatus, addTask, reviewTask, setReviewTask }) => {
  return (
    <>
      {reviewTask && (
        <CodeReviewModal 
          task={reviewTask}
          teamMembers={teamMembers}
          onClose={() => setReviewTask(null)}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TeamPerformance tasks={tasks} teamMembers={teamMembers} />
          <KanbanBoard tasks={tasks} teamMembers={teamMembers} updateTaskStatus={updateTaskStatus} />
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Team Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {meeting && <MeetingModal meeting={meeting} setMeeting={setMeeting} teamMembers={teamMembers} />}
          <MeetingSummaryUploader teamMembers={teamMembers} addTask={addTask} />
          <AiAssistant teamMembers={teamMembers} addTask={addTask} tasks={tasks} setMeeting={setMeeting} />
        </div>
      </div>
    </>
  );
};