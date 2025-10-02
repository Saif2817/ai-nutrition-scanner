

import React from 'react';
import { useAppContext } from '../../context/AppContext';
// FIX: Import ScanResult type for function parameter.
import { View, ScanResult } from '../../types';
import { AlertTriangleIcon, ChevronRightIcon } from '../ui/Icons';

const HistoryScreen: React.FC = () => {
  const { scanHistory, setView, setCurrentAnalysis } = useAppContext();

  // FIX: Add explicit type to the 'item' parameter.
  const handleSelectHistoryItem = (item: ScanResult) => {
    setCurrentAnalysis(item);
    setView(View.Analysis);
  }

  if (scanHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold dark:text-gray-100">No Scans Yet</h2>
        <p className="text-gray-500 dark:text-gray-400">Your scanned items will appear here.</p>
        <button onClick={() => setView(View.Scan)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
          Scan Your First Item
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 px-2">Scan History</h1>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {scanHistory.map((item) => {
           const title = item.scanType === 'plate' 
              ? 'Scanned Meal' 
              : item.nutritionData?.productName || 'Scanned Label';
          const subtitle = item.scanType === 'plate' && item.plateAnalysis
              ? `${Math.round(item.plateAnalysis.totalCalories)} kcal - ${item.date}`
              : item.date;

          return (
            <li
              key={item.id}
              onClick={() => handleSelectHistoryItem(item)}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={title} className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-600" />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HistoryScreen;
