import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { View } from '../../types';
import { HistoryIcon, UserIcon, BackIcon } from './Icons';

const Header: React.FC = () => {
  const { view, setView, profile } = useAppContext();

  const showBackButton = ![View.Home, View.Onboarding].includes(view);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 border-b dark:border-gray-700">
      <div className="container mx-auto max-w-lg p-4 flex justify-between items-center">
        <div className="w-1/4">
          {showBackButton && (
            <button
              onClick={() => setView(View.Home)}
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              aria-label="Go back"
            >
              <BackIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="w-1/2 text-center">
            <h1 className="text-xl font-bold text-green-700 dark:text-green-400">NutriScan AI</h1>
        </div>
        <nav className="w-1/4 flex justify-end items-center space-x-4">
          <button onClick={() => setView(View.History)} className={`text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors ${view === View.History ? 'text-green-600 dark:text-green-400' : ''}`}>
            <HistoryIcon className="w-6 h-6"/>
          </button>
          <button onClick={() => setView(View.Profile)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full">
            {profile?.avatarUrl ? (
                <img 
                    src={profile.avatarUrl} 
                    alt="User Avatar" 
                    className={`w-8 h-8 rounded-full object-cover border-2 ${view === View.Profile ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'}`} 
                />
            ) : (
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${view === View.Profile ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <UserIcon className={`w-5 h-5 ${view === View.Profile ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}/>
                </div>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;