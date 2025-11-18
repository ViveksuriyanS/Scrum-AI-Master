import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';
import { SparklesIcon } from './icons';

// Declare the 'google' property on the window object to resolve TypeScript errors for the Google Sign-In library.
declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

// Simple JWT decoder
const decodeJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};


export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const signInButtonRef = useRef<HTMLDivElement>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    const clientIdMeta = document.querySelector('meta[name="google-client-id"]');
    const clientId = clientIdMeta ? clientIdMeta.getAttribute('content') : null;

    if (!clientId || clientId.startsWith('YOUR_CLIENT_ID')) {
      console.error("Google Client ID is not configured. Please update it in index.html.");
      setIsConfigured(false);
      return;
    }
    
    setIsConfigured(true);

    const handleCredentialResponse = (response: any) => {
      const decoded = decodeJwt(response.credential);
      if (decoded) {
        const user: User = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };
        onLoginSuccess(user);
      }
    };

    if (window.google && signInButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        signInButtonRef.current,
        { theme: 'outline', size: 'large' }
      );
    }
  }, [onLoginSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
            <SparklesIcon className="h-12 w-12 text-indigo-500" />
            <h1 className="mt-4 text-2xl font-bold text-center text-gray-900 dark:text-white">Scrum AI Master</h1>
            <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">Sign in to continue to your dashboard</p>
        </div>
        
        {isConfigured ? (
            <div ref={signInButtonRef} className="flex justify-center"></div>
        ) : (
          <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 rounded-lg">
            <h3 className="font-bold text-red-800 dark:text-red-200">Authentication Not Configured</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              To enable Google Sign-In, you must provide your own Client ID.
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Please edit the <strong>index.html</strong> file and replace the placeholder value in the <code>{'<meta name="google-client-id" ... >'}</code> tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};