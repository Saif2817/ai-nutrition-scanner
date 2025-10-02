import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { View } from '../../types';
import { analyzeLabelImage, analyzePlateImage } from '../../services/geminiService';
import { CameraIcon, UploadIcon, AlertIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const ScanScreen: React.FC = () => {
  const { profile, setView, setCurrentAnalysis, setScanHistory, scanHistory, scanMode } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API
        setError("Image size cannot exceed 4MB.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        processImage(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (dataUrl: string) => dataUrl.split(',')[1];

  const processImage = async (dataUrl: string, mimeType: string) => {
    if (!profile) {
        setError("User profile not found. Please log in again.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = toBase64(dataUrl);

      let newScanResult;
      if (scanMode === 'plate') {
        const plateAnalysis = await analyzePlateImage(base64Image, mimeType, profile);
        newScanResult = {
          id: new Date().toISOString(),
          date: new Date().toLocaleString(),
          imageUrl: dataUrl,
          scanType: 'plate' as const,
          plateAnalysis,
        };
      } else {
        const { nutritionData, gptAnalysis } = await analyzeLabelImage(base64Image, mimeType, profile);
        newScanResult = {
          id: new Date().toISOString(),
          date: new Date().toLocaleString(),
          imageUrl: dataUrl,
          scanType: 'label' as const,
          nutritionData,
          gptAnalysis,
        };
      }

      setCurrentAnalysis(newScanResult);
      setScanHistory([newScanResult, ...scanHistory]);
      setView(View.Analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      {isLoading ? (
        <div className="text-center">
          <Spinner />
          <h2 className="text-xl font-semibold mt-4 dark:text-gray-100">Analyzing Your {scanMode === 'label' ? 'Label' : 'Plate'}...</h2>
          <p className="text-gray-500 dark:text-gray-400">The AI is working its magic. This may take a moment.</p>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Scan or Upload a {scanMode === 'label' ? 'Label' : 'Plate'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
            Position the {scanMode === 'label' ? 'nutrition label' : 'meal'} clearly in the frame for the best results.
          </p>
          <div className="space-y-4">
             <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center p-5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              <CameraIcon className="w-8 h-8 mr-4" />
              <span className="text-xl">Use Camera</span>
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center p-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all"
            >
              <UploadIcon className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
              <span>Upload from Gallery</span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {error && (
            <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center dark:bg-red-900 dark:text-red-200 dark:border-red-700">
              <AlertIcon className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanScreen;