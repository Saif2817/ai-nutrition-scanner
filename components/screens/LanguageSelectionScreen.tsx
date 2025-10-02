import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useLocale } from '../../context/LocaleContext';
import { CheckCircleIcon, LondonBridgeIcon, IndiaGateIcon, TamilTempleIcon, KeralaBoatIcon } from '../ui/Icons';

const languages = [
    { code: 'English', nameKey: 'languages.English', icon: <LondonBridgeIcon className="w-16 h-16 text-gray-700 dark:text-gray-300" /> },
    { code: 'Hindi', nameKey: 'languages.Hindi', icon: <IndiaGateIcon className="w-16 h-16 text-gray-700 dark:text-gray-300" /> },
    { code: 'Tamil', nameKey: 'languages.Tamil', icon: <TamilTempleIcon className="w-16 h-16 text-gray-700 dark:text-gray-300" /> },
    { code: 'Malayalam', nameKey: 'languages.Malayalam', icon: <KeralaBoatIcon className="w-16 h-16 text-gray-700 dark:text-gray-300" /> },
];

const LanguageSelectionScreen: React.FC = () => {
    const { selectLanguage } = useAppContext();
    const { t } = useLocale();
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const handleContinue = () => {
        if (selectedLanguage) {
            selectLanguage(selectedLanguage);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center p-6 font-sans">
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {t('language_selection.title')}
                </h1>
            </div>

            <div className="flex-grow w-full max-w-md flex flex-col items-center justify-center space-y-4 my-8">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`
                            relative w-full p-4 flex items-center space-x-4 rounded-xl border-2 transition-all duration-200
                            ${selectedLanguage === lang.code
                                ? 'bg-green-100 dark:bg-green-900/50 border-green-500 shadow-lg'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
                            }
                        `}
                    >
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                            {lang.icon}
                        </div>
                        <span className="flex-grow text-left text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {t(lang.nameKey)}
                        </span>
                        {selectedLanguage === lang.code && (
                            <div className="absolute top-3 right-3 text-green-600 dark:text-green-400">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-md pb-8">
                 <button
                    onClick={handleContinue}
                    disabled={!selectedLanguage}
                    className="w-full p-4 bg-green-600 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {t('language_selection.continue')}
                </button>
                 <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('language_selection.footer')}
                </p>
            </div>
        </div>
    );
};

export default LanguageSelectionScreen;