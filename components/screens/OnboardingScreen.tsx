

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { OnboardingScanIcon, OnboardingAnalysisIcon, OnboardingChatIcon, OnboardingUnlockIcon } from '../ui/Icons';

const onboardingSteps = [
    {
        icon: <OnboardingScanIcon className="w-48 h-48 text-green-500" />,
        headline: "Welcome to NutriScan AI! 🥗",
        text: "Instantly scan any nutrition label with your camera. No more squinting at tiny text."
    },
    {
        icon: <OnboardingAnalysisIcon className="w-48 h-48 text-green-500" />,
        headline: "Understand Your Food",
        text: "Our AI analyzes ingredients and nutrition facts based on your unique health profile and goals."
    },
    {
        icon: <OnboardingChatIcon className="w-48 h-48 text-green-500" />,
        headline: "Have Questions? Just Ask.",
        text: "Chat with our AI to get detailed answers about any food product and how it fits into your lifestyle."
    },
    {
        icon: <OnboardingUnlockIcon className="w-48 h-48 text-gray-700 dark:text-gray-300" />,
        headline: "Unlock Your Personal Analysis",
        text: "To give you the best analysis, we need to know a little about you. Let's set up your profile."
    }
];


const OnboardingScreen: React.FC = () => {
    const { completeOnboarding } = useAppContext();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    const isLastStep = currentStep === onboardingSteps.length - 1;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-between items-center p-6 font-sans">
            <div className="w-full text-right h-10">
                {!isLastStep && (
                    <button onClick={completeOnboarding} className="text-gray-500 dark:text-gray-400 font-semibold">
                        Skip
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center text-center w-full max-w-sm">
                <div className="mb-8 h-48 flex items-center justify-center">
                    {onboardingSteps[currentStep].icon}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {onboardingSteps[currentStep].headline}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {onboardingSteps[currentStep].text}
                </p>
            </div>

            <div className="w-full max-w-sm pb-8">
                <div className="flex justify-center space-x-2 mb-8">
                    {onboardingSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                currentStep === index ? 'bg-green-600 w-6' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="w-full p-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                    {isLastStep ? "Create My Profile" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default OnboardingScreen;