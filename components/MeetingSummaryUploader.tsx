import React, { useState } from 'react';
import { summarizeMeetingMedia } from '../services/geminiService';
import { TeamMember, MeetingSummary, SummarizedTask, Task, TaskStatus } from '../types';
import { DocumentTextIcon, UploadIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';
import { sampleAudioBase64, sampleAudioMimeType } from '../sampleData';

interface MeetingSummaryUploaderProps {
  teamMembers: TeamMember[];
  addTask: (newTask: Omit<Task, 'id' | 'status'> & { status?: TaskStatus }) => void;
}

const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
};

export const MeetingSummaryUploader: React.FC<MeetingSummaryUploaderProps> = ({ teamMembers, addTask }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<MeetingSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResultsExpanded, setIsResultsExpanded] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setSummaryResult(null);
      setError(null);
    }
  };

  const handleUseSampleAudio = () => {
    const sampleFile = base64ToFile(sampleAudioBase64, 'sample-meeting.wav', sampleAudioMimeType);
    setFile(sampleFile);
    setSummaryResult(null);
    setError(null);
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a transcript or recording file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummaryResult(null);

    try {
      const result = await summarizeMeetingMedia(file, teamMembers);
      setSummaryResult(result);
      setIsResultsExpanded(true); // Automatically expand on new result
    } catch (err) {
      console.error('Error summarizing media:', err);
      setError('Failed to summarize the file. The format may not be supported. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = (task: SummarizedTask) => {
    const assignee = teamMembers.find(m => m.name.toLowerCase() === task.assigneeName.toLowerCase());
    if (assignee) {
        // FIX: Add default priority to meet Task type requirements.
        addTask({ title: task.title, assigneeId: assignee.id, points: task.points, status: task.status, priority: 'Medium' });
        // Optionally, remove the task from the list after adding
        setSummaryResult(prev => prev ? ({
            ...prev,
            tasks: prev.tasks.filter(t => t !== task)
        }) : null);
    } else {
        alert(`Could not find team member: ${task.assigneeName}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
        <h3 className="text-lg font-semibold ml-2 text-gray-800 dark:text-white">Meeting Summary</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Transcript or Recording
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,audio/*,video/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{file ? file.name : 'TXT, MP3, WAV, MP4, MOV...'}</p>
            </div>
          </div>
        </div>
        <div className="text-center">
             <button type="button" onClick={handleUseSampleAudio} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Or Use Sample Audio
              </button>
        </div>
        <button
          onClick={handleSummarize}
          disabled={!file || isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Generate Summary & Tasks'}
        </button>
      </div>

      {isLoading && (
         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse ml-2"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse ml-2"></div>
            </div>
         </div>
      )}

      {error && <p className="p-4 text-sm text-red-500">{error}</p>}
      
      {summaryResult && (
        <div className="border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                className="w-full p-4 flex justify-between items-center text-left"
                aria-expanded={isResultsExpanded}
            >
                <h4 className="font-semibold text-gray-800 dark:text-white">Analysis Results</h4>
                {isResultsExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
            </button>
            {isResultsExpanded && (
                <div className="px-4 pb-4 max-h-96 overflow-y-auto">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">Summary</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{summaryResult.summary}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white">Identified Tasks ({summaryResult.tasks.length})</h4>
                        <ul className="mt-2 space-y-2">
                        {summaryResult.tasks.map((task, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                            <div className="text-sm">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.assigneeName} • {task.points} pts • {task.status}</p>
                            </div>
                            <button onClick={() => handleAddTask(task)} title="Add to Task Board" className="text-indigo-500 hover:text-indigo-700">
                                <PlusCircleIcon className="h-6 w-6"/>
                            </button>
                            </li>
                        ))}
                        {summaryResult.tasks.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No new tasks were identified.</p>
                        )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
