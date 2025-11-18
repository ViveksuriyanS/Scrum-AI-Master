import React, { useState, useEffect } from 'react';
import { Meeting, TeamMember } from '../types';
import { generateSummary } from '../services/geminiService';
import { ChevronDownIcon, ChevronUpIcon, MailIcon } from './icons';

interface MeetingModalProps {
  meeting: Meeting;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>;
  teamMembers: TeamMember[];
}

export const MeetingModal: React.FC<MeetingModalProps> = ({ meeting, setMeeting, teamMembers }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  useEffect(() => {
    if (meeting.scheduled) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setSummary('');
        const updates = teamMembers.map(m => `${m.name}: ${m.dailyUpdate}`).join('\n');
        const generatedSummary = await generateSummary(updates);
        setSummary(generatedSummary);
        setIsLoading(false);
      };
      fetchSummary();
    }
  }, [meeting.scheduled, teamMembers]);

  const handleEmailSummary = () => {
    if (!summary || isLoading) return;

    const recipientEmails = teamMembers
      .map(member => member.email)
      .filter(Boolean)
      .join(',');

    if (!recipientEmails) {
      alert("No team member emails are configured to send the summary.");
      return;
    }

    const subject = encodeURIComponent(`Daily Scrum Summary - ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(summary);

    window.location.href = `mailto:${recipientEmails}?subject=${subject}&body=${body}`;
  };

  if (!meeting.scheduled) return null;

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Stand-up</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{meeting.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">Scheduled</span>
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">Tip: Use the AI Assistant to reschedule, e.g., "reschedule meeting to 10am".</p>
      <div className="mt-4 flex space-x-2">
        <a
          href="https://meet.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Join Now
        </a>
        <button
          onClick={() => setMeeting(prev => prev ? { ...prev, scheduled: false } : null)}
          className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
      <div className="mt-2">
        <button
            onClick={handleEmailSummary}
            disabled={isLoading || !summary}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <MailIcon className="h-5 w-5 mr-2" />
            Email Summary to Team
        </button>
      </div>
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="w-full flex justify-between items-center text-left"
          aria-expanded={isSummaryExpanded}
        >
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">AI Summary</h4>
          {isSummaryExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
        </button>
        {isSummaryExpanded && (
            <div className="mt-2">
                {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse ml-1"></div>
                </div>
                ) : (
                <article className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                )}
            </div>
        )}
      </div>
    </div>
  );
};