import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { View } from '../../types';
import { ScanIcon, ChatIcon, ForkKnifeIcon, ShoppingBagIcon, DieticianIcon } from '../ui/Icons';
import { useLocale } from '../../context/LocaleContext';

const HomeScreen: React.FC = () => {
  const { setView, setScanMode } = useAppContext();
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('home.welcome')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10">{t('home.welcome_subtitle')}</p>

        <div className="space-y-4">
          <button
            onClick={() => {
              setScanMode('label');
              setView(View.Scan);
            }}
            className="w-full flex items-center justify-center p-5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            <ScanIcon className="w-8 h-8 mr-4" />
            <span className="text-xl">{t('home.scan_button')}</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
             <button
                onClick={() => {
                  setScanMode('plate');
                  setView(View.Scan);
                }}
                className="w-full h-28 flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all"
            >
                <ForkKnifeIcon className="w-7 h-7 mb-2 text-green-600 dark:text-green-400" />
                <span>{t('home.plate_button')}</span>
            </button>
            <button
                onClick={() => setView(View.Dietician)}
                className="w-full h-28 flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all"
            >
                <DieticianIcon className="w-7 h-7 mb-2 text-green-600 dark:text-green-400" />
                <span>{t('home.dietician_button')}</span>
            </button>
            <button
                onClick={() => setView(View.Shopping)}
                className="w-full h-28 flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all"
            >
                <ShoppingBagIcon className="w-7 h-7 mb-2 text-green-600 dark:text-green-400" />
                <span>{t('home.shopping_button')}</span>
            </button>
            <button
                onClick={() => setView(View.Chat)}
                className="w-full h-28 flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all"
            >
                <ChatIcon className="w-7 h-7 mb-2 text-green-600 dark:text-green-400" />
                <span>{t('home.chat_button')}</span>
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-12">
            {t('home.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;