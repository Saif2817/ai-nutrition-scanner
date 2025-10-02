import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { View } from './types';
import { LocaleProvider } from './context/LocaleContext';

import Header from './components/ui/Header';
import HomeScreen from './components/screens/HomeScreen';
import ScanScreen from './components/screens/ScanScreen';
import AnalysisScreen from './components/screens/AnalysisScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ChatScreen from './components/screens/ChatScreen';
import AuthScreen from './components/screens/AuthScreen';
import ProfileSetupScreen from './components/screens/ProfileSetupScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import LanguageSelectionScreen from './components/screens/LanguageSelectionScreen';
import NotificationPermissionModal from './components/ui/NotificationPermissionModal';
import ShoppingScreen from './components/screens/ShoppingScreen';
import DieticianScreen from './components/screens/DieticianScreen';

const AppContent: React.FC = () => {
    const { view, isAuthenticated, profile, hasCompletedOnboarding, hasSelectedLanguage } = useAppContext();
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

    useEffect(() => {
        const promptShown = localStorage.getItem('notificationPromptShown') === 'true';
        // Check if the Notification API is available in the browser
        if (!promptShown && 'Notification' in window) {
            if (Notification.permission === 'default') {
                // The user hasn't been asked yet, so we can show our custom prompt.
                setShowNotificationPrompt(true);
            } else {
                // The user has already granted or denied permission.
                // We mark the prompt as shown to avoid re-checking on every app load.
                localStorage.setItem('notificationPromptShown', 'true');
            }
        }
    }, []);

    const handlePermissionResponse = (allow: boolean) => {
        // Mark that we've shown our custom prompt.
        localStorage.setItem('notificationPromptShown', 'true');
        setShowNotificationPrompt(false);
        
        // If the user clicked "Allow", we then trigger the browser's native permission request.
        if (allow) {
            Notification.requestPermission();
        }
    };

    return (
        <LocaleProvider language={profile?.language || 'English'}>
            {showNotificationPrompt && <NotificationPermissionModal onAllow={() => handlePermissionResponse(true)} onDeny={() => handlePermissionResponse(false)} />}
            
            {(() => {
                if (!isAuthenticated) {
                    return <AuthScreen />;
                }

                if (!hasCompletedOnboarding) {
                    return <OnboardingScreen />;
                }

                if (!hasSelectedLanguage) {
                    return <LanguageSelectionScreen />;
                }
                
                if (!profile?.isProfileComplete) {
                    return <ProfileSetupScreen />;
                }

                return (
                    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
                        <div className="container mx-auto max-w-lg bg-white dark:bg-gray-800 shadow-2xl min-h-screen flex flex-col">
                            <Header />
                            <main className="flex-grow p-4 overflow-y-auto">
                                {(() => {
                                    switch (view) {
                                        case View.Home: return <HomeScreen />;
                                        case View.Scan: return <ScanScreen />;
                                        case View.Analysis: return <AnalysisScreen />;
                                        case View.History: return <HistoryScreen />;
                                        case View.Profile: return <ProfileScreen />;
                                        case View.Chat: return <ChatScreen />;
                                        case View.Shopping: return <ShoppingScreen />;
                                        case View.Dietician: return <DieticianScreen />;
                                        default: return <HomeScreen />;
                                    }
                                })()}
                            </main>
                        </div>
                    </div>
                );
            })()}
        </LocaleProvider>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;