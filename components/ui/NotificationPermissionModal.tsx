import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import { BellIcon } from './Icons';

interface NotificationPermissionModalProps {
    onAllow: () => void;
    onDeny: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ onAllow, onDeny }) => {
    const { t } = useLocale();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                    <BellIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('notifications.title')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {t('notifications.body')}
                </p>
                <div className="mt-6 flex flex-col space-y-3">
                    <button
                        onClick={onAllow}
                        className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {t('notifications.allow_button')}
                    </button>
                    <button
                        onClick={onDeny}
                        className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t('notifications.deny_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPermissionModal;
