import React from 'react';

const SettingsCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        {children}
    </div>
);

const Toggle: React.FC<{label: string, enabled: boolean}> = ({label, enabled}) => {
    const [isEnabled, setIsEnabled] = React.useState(enabled);
    return (
        <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
            <button onClick={() => setIsEnabled(!isEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
    )
}

export const SettingsPage: React.FC = () => {
    // Dummy user for display
    const user = {
        name: 'Scrum Master',
        email: 'scrum.master@example.com',
        picture: 'https://i.pravatar.cc/150?u=scrum-master'
    }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <SettingsCard title="Profile">
                <div className="flex flex-col items-center space-y-4">
                    <img src={user.picture} alt={user.name} className="h-24 w-24 rounded-full"/>
                    <div>
                        <p className="font-bold text-center text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Edit Profile
                    </button>
                </div>
            </SettingsCard>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <SettingsCard title="Notifications">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <Toggle label="Email notifications for task updates" enabled={true} />
                    <Toggle label="Push notifications for meeting reminders" enabled={true} />
                    <Toggle label="Weekly performance summary email" enabled={false} />
                </div>
            </SettingsCard>
             <SettingsCard title="Theme">
                 <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Appearance</p>
                    <div className="flex items-center rounded-lg p-1 bg-gray-200 dark:bg-gray-700">
                        <button className="px-4 py-1 text-sm font-semibold rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow">Light</button>
                        <button className="px-4 py-1 text-sm font-semibold rounded-md text-gray-500 dark:text-gray-400">Dark</button>
                    </div>
                </div>
            </SettingsCard>
        </div>
      </div>
    </div>
  );
};
