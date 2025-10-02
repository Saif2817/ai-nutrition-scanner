import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { NutrientRiskLevel, View, InteractionSeverity, NutrientFact, GPTAnalysis, PlateAnalysis, PlateFoodItem, DietaryCompliance, ScanResult } from '../../types';
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon, InfoIcon, ThumbsUpIcon, ThumbsDownIcon, LightbulbIcon, ShareIcon, MegaphoneIcon, GlycemicIcon, PairingIcon, TimeIcon, SwapIcon, ChartPieIcon, OverviewIcon, HeartbeatIcon, BulbIcon, ChartBarIcon, ForkKnifeIcon, ChatIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';
import { useLocale } from '../../context/LocaleContext';

type AnalysisTab = 'overview' | 'health' | 'advice' | 'data';

const getRiskIndicator = (level: NutrientRiskLevel | undefined) => {
    switch (level) {
        case NutrientRiskLevel.High: return <div className="w-3 h-3 rounded-full bg-red-500" title="High"></div>;
        case NutrientRiskLevel.Medium: return <div className="w-3 h-3 rounded-full bg-yellow-400" title="Medium"></div>;
        case NutrientRiskLevel.Low: return <div className="w-3 h-3 rounded-full bg-green-500" title="Low"></div>;
        default: return <div className="w-3 h-3 rounded-full bg-gray-300" title="Info"></div>;
    }
};

const getSeverityBadgeStyle = (severity: InteractionSeverity) => {
    switch (severity) {
        case InteractionSeverity.High: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case InteractionSeverity.Moderate: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case InteractionSeverity.Low: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    return (
        <span className="relative group inline-flex items-center">
            {children}
            <span className="absolute bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center pointer-events-none">
                {text}
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </span>
        </span>
    );
};

const PersonalizedScore: React.FC<{ scoreData: GPTAnalysis['personalizedScore'] }> = ({ scoreData }) => {
    if (!scoreData) return null;
    const { score, rationale } = scoreData;
    const percentage = score * 10;
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (s: number) => {
        if (s <= 3) return { ring: 'text-red-500', bg: 'bg-red-500/10' };
        if (s <= 6) return { ring: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { ring: 'text-green-500', bg: 'bg-green-500/10' };
    };
    const { ring, bg } = getColor(score);

    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 ${bg}`}>
            <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className={`${ring} transform -rotate-90 origin-center`}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${ring.replace('text-', 'text-')}`}>{score}</span>
                    <span className={`text-lg font-semibold ${ring.replace('text-', 'text-')}`}>/10</span>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Personalized Score for You</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{rationale}</p>
            </div>
        </div>
    );
};


const FlaggedIngredients: React.FC<{ analysis: GPTAnalysis, ingredients: string[] }> = ({ analysis, ingredients }) => {
    const getFlagIcon = (flag: 'positive' | 'negative' | 'neutral') => {
        switch (flag) {
            case 'positive': return <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />;
            case 'negative': return <XCircleIcon className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />;
            default: return <InfoIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />;
        }
    };

    if (!analysis.flaggedIngredients || analysis.flaggedIngredients.length === 0) {
        return <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ingredients.join(', ')}</p>;
    }

    return (
        <ul className="space-y-2">
            {analysis.flaggedIngredients.map((item, i) => (
                <li key={i} className="flex items-start text-xs">
                    {getFlagIcon(item.flag)}
                    <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{item.ingredient}</span>
                        <span className="text-gray-500 dark:text-gray-400"> - {item.reason}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

const MacroBreakdown: React.FC<{ facts: NutrientFact[] }> = ({ facts }) => {
    const getGrams = (name: string) => {
        const fact = facts.find(f => f.name.toLowerCase().includes(name.toLowerCase()));
        if (!fact) return 0;
        return parseFloat(fact.value) || 0;
    };

    const proteinG = getGrams('protein');
    const carbG = getGrams('total carbohydrates');
    const fatG = getGrams('total fat');

    const proteinCal = proteinG * 4;
    const carbCal = carbG * 4;
    const fatCal = fatG * 9;

    const totalCal = proteinCal + carbCal + fatCal;

    if (totalCal === 0) {
        return null; // Don't render if no macro data
    }

    const proteinP = Math.round((proteinCal / totalCal) * 100);
    const carbP = Math.round((carbCal / totalCal) * 100);
    const fatP = Math.round((fatCal / totalCal) * 100);

    const macros = [
        { name: 'Carbs', value: `${carbG.toFixed(1)}g`, percentage: carbP, color: 'bg-blue-500' },
        { name: 'Protein', value: `${proteinG.toFixed(1)}g`, percentage: proteinP, color: 'bg-red-500' },
        { name: 'Fat', value: `${fatG.toFixed(1)}g`, percentage: fatP, color: 'bg-yellow-500' },
    ];

    return (
        <div>
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-2">
                <ChartPieIcon className="w-5 h-5 mr-2" />
                Macronutrient Split
            </h3>
            <div className="bg-white dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg p-4 space-y-3 text-sm">
                {macros.map(macro => (
                    <div key={macro.name}>
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{macro.name} <span className="text-gray-500 dark:text-gray-400">({macro.value})</span></span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{macro.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className={`${macro.color} h-2 rounded-full`} style={{ width: `${macro.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TotalMealMacros: React.FC<{ analysis: PlateAnalysis }> = ({ analysis }) => {
    const { totalCalories, totalMacros } = analysis;
    const proteinCal = totalMacros.proteinGrams * 4;
    const carbCal = totalMacros.carbohydratesGrams * 4;
    const fatCal = totalMacros.fatGrams * 9;
    const totalMacroCals = proteinCal + carbCal + fatCal;
    
    if (totalMacroCals === 0) return null;

    const proteinP = Math.round((proteinCal / totalMacroCals) * 100);
    const carbP = Math.round((carbCal / totalMacroCals) * 100);
    const fatP = Math.round((fatCal / totalMacroCals) * 100);

     const macros = [
        { name: 'Carbs', value: `${totalMacros.carbohydratesGrams.toFixed(1)}g`, percentage: carbP, color: 'bg-blue-500' },
        { name: 'Protein', value: `${totalMacros.proteinGrams.toFixed(1)}g`, percentage: proteinP, color: 'bg-red-500' },
        { name: 'Fat', value: `${totalMacros.fatGrams.toFixed(1)}g`, percentage: fatP, color: 'bg-yellow-500' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800/50 border dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-4">
                 <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <ChartPieIcon className="w-5 h-5 mr-2" />
                    Meal Breakdown
                </h2>
                <div>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(totalCalories)}</span>
                    <span className="text-md font-semibold text-gray-500 dark:text-gray-400"> kcal</span>
                </div>
            </div>
             <div className="space-y-3 text-sm">
                {macros.map(macro => (
                    <div key={macro.name}>
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{macro.name} <span className="text-gray-500 dark:text-gray-400">({macro.value})</span></span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{macro.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className={`${macro.color} h-2 rounded-full`} style={{ width: `${macro.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const MealScoreDisplay: React.FC<{ analysis: PlateAnalysis }> = ({ analysis }) => {
    const { mealScore, scoreRationale, scoreColor } = analysis;

    const colorClasses = {
        green: {
            bg: 'bg-green-500/10 dark:bg-green-900/50',
            text: 'text-green-600 dark:text-green-300',
            ring: 'text-green-500',
        },
        yellow: {
            bg: 'bg-yellow-500/10 dark:bg-yellow-900/50',
            text: 'text-yellow-600 dark:text-yellow-300',
            ring: 'text-yellow-500',
        },
        red: {
            bg: 'bg-red-500/10 dark:bg-red-900/50',
            text: 'text-red-600 dark:text-red-300',
            ring: 'text-red-500',
        },
    };

    const { bg, text, ring } = colorClasses[scoreColor];
    const percentage = mealScore * 10;
    const circumference = 2 * Math.PI * 28; // 2 * pi * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 ${bg}`}>
            <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 64 64">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                    <circle
                        className={`${ring} transform -rotate-90 origin-center transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${text}`}>{mealScore.toFixed(1)}</span>
                </div>
            </div>
            <div>
                <h3 className={`font-bold text-lg ${text}`}>Meal Score</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{scoreRationale}</p>
            </div>
        </div>
    );
};

const PlateAnalysisView: React.FC<{ scanResult: ScanResult }> = ({ scanResult }) => {
    const { t } = useLocale();
    const { setView, setChatContext } = useAppContext();
    
    if (!scanResult.plateAnalysis) return null;

    const { foodItems, summary, personalizedFeedback, mealCategory } = scanResult.plateAnalysis;
    const analysis = scanResult.plateAnalysis;

    const handleAskAi = () => {
        setChatContext(scanResult);
        setView(View.Chat);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <MealScoreDisplay analysis={analysis} />
            
            <div className="bg-green-50 dark:bg-green-900/50 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center mb-2">
                        <LightbulbIcon className="w-6 h-6 mr-2" />
                        {t('analysis.summary.title')}
                    </h2>
                    <span className="text-xs font-semibold bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded-full">{mealCategory}</span>
                </div>
                <p className="text-green-900 dark:text-green-100 text-sm leading-relaxed">{summary}</p>
                <div className="mt-4 space-y-2">
                    {personalizedFeedback.positivePoints.map((point, i) => (
                        <div key={i} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </div>
                    ))}
                    {personalizedFeedback.negativePoints.map((point, i) => (
                        <div key={i} className="flex items-start text-sm">
                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleAskAi}
                className="w-full flex items-center justify-center p-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
                <ChatIcon className="w-6 h-6 mr-3" />
                <span>{t('analysis.ask_ai_meal_button')}</span>
            </button>

            <TotalMealMacros analysis={analysis} />

            <div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-2">
                    <ForkKnifeIcon className="w-5 h-5 mr-2" />
                    Identified Food Items
                </h3>
                <div className="space-y-3">
                    {foodItems.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{Math.round(item.calories)} kcal</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{`P:${item.macros.proteinGrams.toFixed(0)} C:${item.macros.carbohydratesGrams.toFixed(0)} F:${item.macros.fatGrams.toFixed(0)}`}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${item.confidenceScore * 100}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">Confidence: {Math.round(item.confidenceScore * 100)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="space-y-2">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Dietary Compliance</h3>
                {personalizedFeedback.dietaryCompliance.map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg flex items-start text-sm ${item.compliant ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800' : 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'}`}>
                        {item.compliant ? <InfoIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"/> : <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />}
                        <div>
                            <span className="font-bold dark:text-gray-200">{item.preference}: {item.compliant ? t('analysis.compliance.compliant') : t('analysis.compliance.issue')}</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.reason}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AnalysisScreen: React.FC = () => {
    const { currentAnalysis, setView, setChatContext } = useAppContext();
    const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
    const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
    const { t } = useLocale();

    if (!currentAnalysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangleIcon className="w-12 h-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold dark:text-gray-100">{t('analysis.no_data_title')}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t('analysis.no_data_subtitle')}</p>
                <button onClick={() => setView(View.Home)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
                    {t('analysis.go_home_button')}
                </button>
            </div>
        );
    }
    
    const { imageUrl, nutritionData, gptAnalysis, scanType, plateAnalysis } = currentAnalysis;
    const isPlateScan = scanType === 'plate';

    if ((!isPlateScan && (!nutritionData || !gptAnalysis)) || (isPlateScan && !plateAnalysis)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Spinner />
                <p className="mt-4 text-gray-600 dark:text-gray-400">{t('analysis.processing')}</p>
            </div>
        )
    }

    const handleShare = async () => {
        if (!navigator.share) {
            alert("Sharing is not supported on this browser.");
            return;
        }

        let shareText = `NutriScan AI Analysis for: ${isPlateScan ? 'My Meal' : nutritionData!.productName}\n\n`;
        if (!isPlateScan && gptAnalysis!.personalizedScore) {
            shareText += `Personalized Score: ${gptAnalysis!.personalizedScore.score}/10\n`;
        }
        if (isPlateScan) {
            shareText += `Meal Score: ${plateAnalysis!.mealScore.toFixed(1)}/10\n`;
            shareText += `Estimated Calories: ${Math.round(plateAnalysis!.totalCalories)} kcal\n`;
        }
        shareText += `SUMMARY:\n${isPlateScan ? plateAnalysis!.summary : gptAnalysis!.summary}\n\n`;
        if (!isPlateScan && gptAnalysis!.recallInfo?.isRecalled) {
            shareText += `🚨 RECALL ALERT: ${gptAnalysis!.recallInfo.reason}\n\n`;
        }
        shareText += "Disclaimer: This is an AI-generated analysis. Consult a healthcare professional.";

        try {
            await navigator.share({
                title: `NutriScan AI Analysis: ${isPlateScan ? 'My Meal' : nutritionData!.productName}`,
                text: shareText,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };
    
    const handleAskAi = () => {
        setChatContext(currentAnalysis);
        setView(View.Chat);
    };

    const TabButton: React.FC<{id: AnalysisTab, label: string, icon: React.ReactNode}> = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center p-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === id
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="mt-1">{label}</span>
        </button>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <OverviewIcon className="w-5 h-5" /> },
        { id: 'health', label: 'Health', icon: <HeartbeatIcon className="w-5 h-5" /> },
        { id: 'advice', label: 'Advice', icon: <BulbIcon className="w-5 h-5" /> },
        { id: 'data', label: 'Data', icon: <ChartBarIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="p-1 space-y-4">
             <div className="relative">
                <img src={imageUrl} alt={isPlateScan ? 'Scanned Meal' : 'Food Label'} className="rounded-xl object-cover w-full h-48 shadow-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-end justify-between p-4">
                    <h1 className="text-2xl font-bold text-white shadow-xl">{isPlateScan ? 'Meal Analysis' : nutritionData!.productName}</h1>
                     <button onClick={handleShare} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors">
                        <ShareIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {isPlateScan ? (
                <PlateAnalysisView scanResult={currentAnalysis} />
            ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm flex gap-2">
                        {tabs.map(tab => <TabButton key={tab.id} id={tab.id as AnalysisTab} label={tab.label} icon={tab.icon} />)}
                    </div>

                    <div className="space-y-6">
                        {/* --- OVERVIEW TAB --- */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fadeIn">
                                {gptAnalysis!.personalizedScore && <PersonalizedScore scoreData={gptAnalysis!.personalizedScore} />}
                                
                                {/* Food Recall Alert */}
                                {gptAnalysis!.recallInfo?.isRecalled && (
                                    <div className="bg-red-600 border-2 border-red-700 rounded-xl p-4 shadow-lg text-white">
                                        <h2 className="text-lg font-bold flex items-center mb-2">
                                            <MegaphoneIcon className="w-6 h-6 mr-3" />
                                            {t('analysis.recall.title')}
                                        </h2>
                                        <p className="font-semibold">{gptAnalysis!.recallInfo.reason}</p>
                                    </div>
                                )}

                                <div className="bg-green-50 dark:bg-green-900/50 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm">
                                    <h2 className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center mb-2">
                                        <LightbulbIcon className="w-6 h-6 mr-2" />
                                        {t('analysis.summary.title')}
                                    </h2>
                                    <p className="text-green-900 dark:text-green-100 text-sm leading-relaxed">{gptAnalysis!.summary}</p>
                                    <div className="mt-4 space-y-2">
                                        {gptAnalysis!.positivePoints.map((point, i) => (
                                            <div key={i} className="flex items-start text-sm">
                                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                            </div>
                                        ))}
                                        {gptAnalysis!.negativePoints.map((point, i) => (
                                            <div key={i} className="flex items-start text-sm">
                                            <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* --- HEALTH DEEP DIVE TAB --- */}
                        {activeTab === 'health' && (
                            <div className="space-y-6 animate-fadeIn">
                                {gptAnalysis!.drugNutrientInteractions && gptAnalysis!.drugNutrientInteractions.length > 0 && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/50 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-4 shadow-sm">
                                        <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 flex items-center mb-3">
                                            <AlertTriangleIcon className="w-6 h-6 mr-2" />
                                            {t('analysis.interaction.title')}
                                        </h2>
                                        <div className="space-y-3">
                                            {gptAnalysis!.drugNutrientInteractions.map((interaction, i) => (
                                                <div key={i} className="text-sm">
                                                <div className="flex justify-between items-center">
                                                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                                                            {interaction.medication} & {interaction.interactingIngredient}
                                                        </p>
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getSeverityBadgeStyle(interaction.severity)}`}>
                                                            {interaction.severity} Risk
                                                        </span>
                                                </div>
                                                    <p className="text-yellow-800 dark:text-yellow-200 mt-1">{interaction.explanation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {gptAnalysis!.glycemicImpact && (
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-2">
                                            <GlycemicIcon className="w-5 h-5 mr-2" /> 
                                            <Tooltip text="The Glycemic Index (GI) is a measure of how quickly a food can make your blood sugar rise. Low GI foods are preferred for stable energy.">
                                                Glycemic Impact
                                                <InfoIcon className="w-4 h-4 text-gray-400 ml-1"/>
                                            </Tooltip>
                                        </h3>
                                        <div className="bg-white dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg p-4">
                                            <p className="font-bold text-lg dark:text-gray-100">{gptAnalysis!.glycemicImpact.level}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{gptAnalysis!.glycemicImpact.reasoning}</p>
                                        </div>
                                    </div>
                                )}

                                {(gptAnalysis!.contextualNotes || gptAnalysis!.portioningGuidance) && (
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Important Notes</h3>
                                        <div className="space-y-2">
                                            {gptAnalysis!.portioningGuidance && (
                                                <div className="p-3 rounded-lg flex items-start text-sm bg-yellow-50 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700">
                                                    <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-bold dark:text-gray-200">{gptAnalysis!.portioningGuidance.title}</span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{gptAnalysis!.portioningGuidance.guidance}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {gptAnalysis!.contextualNotes?.map((note, i) => (
                                                <div key={i} className="p-3 rounded-lg flex items-start text-sm bg-yellow-50 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700">
                                                    <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-bold dark:text-gray-200">{note.title}</span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{note.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- ACTIONABLE ADVICE TAB --- */}
                        {activeTab === 'advice' && (
                            <div className="space-y-2 animate-fadeIn">
                                {gptAnalysis!.timeOfDayRecommendation && (
                                    <div className="p-3 rounded-lg flex items-start text-sm bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800">
                                        <TimeIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <span className="font-bold dark:text-gray-200">Best Time to Eat</span>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{gptAnalysis!.timeOfDayRecommendation}</p>
                                        </div>
                                    </div>
                                )}
                                {gptAnalysis!.mealPairingSuggestions && gptAnalysis!.mealPairingSuggestions.length > 0 && (
                                    <div className="p-3 rounded-lg flex items-start text-sm bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800">
                                        <PairingIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <span className="font-bold dark:text-gray-200">Meal Pairing Suggestions</span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {gptAnalysis!.mealPairingSuggestions.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {gptAnalysis!.smarterSwaps && gptAnalysis!.smarterSwaps.length > 0 && (
                                    <div className="p-3 rounded-lg flex items-start text-sm bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800">
                                        <SwapIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <span className="font-bold dark:text-gray-200">Smarter Swaps</span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {gptAnalysis!.smarterSwaps.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* --- NUTRITION DATA TAB --- */}
                        {activeTab === 'data' && (
                            <div className="space-y-6 animate-fadeIn">
                                <MacroBreakdown facts={nutritionData!.nutritionFacts} />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('analysis.facts.title')}</h3>
                                    <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between font-bold border-b pb-1 dark:border-gray-600">
                                            <span className="dark:text-gray-100">{t('analysis.facts.nutrient')}</span>
                                            <span className="dark:text-gray-100">{t('analysis.facts.dv')}</span>
                                        </div>
                                        {nutritionData!.nutritionFacts.map((fact, i) => (
                                            <div key={i} className="flex justify-between items-center py-1">
                                            <div className="flex items-center">
                                                {getRiskIndicator(fact.riskLevel)}
                                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{fact.name}</span>
                                                <span className="ml-1 text-gray-500 dark:text-gray-400">{fact.value}</span>
                                            </div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{fact.dailyValue || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('analysis.ingredients.title')}</h3>
                                    <div className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-3">
                                        <FlaggedIngredients analysis={gptAnalysis!} ingredients={nutritionData!.ingredients}/>
                                        {nutritionData!.allergens.length > 0 && 
                                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-2">{t('analysis.ingredients.contains')}: {nutritionData!.allergens.join(', ')}</p>
                                        }
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{t('analysis.compliance.title')}</h3>
                                    {gptAnalysis!.dietaryCompliance.map((item, i) => (
                                        <div key={i} className={`p-3 rounded-lg flex items-start text-sm ${item.compliant ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800' : 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'}`}>
                                            {item.compliant ? <InfoIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"/> : <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />}
                                            <div>
                                                <span className="font-bold dark:text-gray-200">{item.preference}: {item.compliant ? t('analysis.compliance.compliant') : t('analysis.compliance.issue')}</span>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{item.reason}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={handleAskAi}
                        className="w-full flex items-center justify-center p-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        <ChatIcon className="w-6 h-6 mr-3" />
                        <span>{t('analysis.ask_ai_label_button')}</span>
                    </button>
                </>
            )}

             {/* Feedback Section */}
            <div className="text-center py-4 mt-4 border-t dark:border-gray-700">
                {feedback ? (
                    <p className="text-green-600 dark:text-green-400 font-semibold">{t('analysis.feedback.thanks')}</p>
                ) : (
                    <>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('analysis.feedback.prompt')}</h4>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setFeedback('good')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-700 transition-colors">
                                <ThumbsUpIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button onClick={() => setFeedback('bad')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
                                <ThumbsDownIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default AnalysisScreen;