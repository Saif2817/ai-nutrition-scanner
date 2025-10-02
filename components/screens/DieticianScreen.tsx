import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserProfile, MealPlan, View, NutritionalJustification, ConditionAdjustment, MealItem, MealIngredient, MealSwapSuggestion } from '../../types';
import { generateMealPlan, getIngredientSwaps, extractLabValuesFromFile } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import { AlertTriangleIcon, CheckCircleIcon, ChevronDownIcon, ForkKnifeIcon, LightbulbIcon, LeafIcon, TargetIcon, CalendarIcon, HeartbeatIcon, InfoIcon, UserIcon, SwapIcon, XIcon, PaperclipIcon, GoogleDriveIcon, DropboxIcon, DownloadIcon, PdfIcon, DocxIcon } from '../ui/Icons';
import { RadioGroup, CheckboxGroup, Select } from '../ui/FormElements';
import { TagInput } from '../ui/TagInput';
import Input from '../ui/Input';
import { useLocale } from '../../context/LocaleContext';

// Correctly import the renamed image components
import { NeckMeasurementIcon as NeckMeasurementImage, WaistMeasurementIcon as WaistMeasurementImage, HipMeasurementIcon as HipMeasurementImage } from '../ui/Icons';


const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    return (
        <span className="relative group inline-block">
            {children}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 text-center pointer-events-none">
                {text}
                <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </span>
        </span>
    );
};

const generateDocxContent = (plan: MealPlan, profile: UserProfile | null): string => {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; font-size: 11pt; color: #333; }
            h1 { font-size: 22pt; color: #166534; margin-bottom: 10px; }
            h2 { font-size: 16pt; color: #15803d; border-bottom: 2px solid #a7f3d0; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; }
            h3 { font-size: 14pt; color: #1f2937; margin-top: 15px; margin-bottom: 5px; }
            h4 { font-size: 12pt; color: #374151; margin-bottom: 5px; }
            p, li { color: #374151; line-height: 1.5; }
            strong { font-weight: bold; }
            .summary-box { background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .meal-card { margin-bottom: 20px; padding-left: 15px; border-left: 3px solid #6ee7b7; }
            ul { list-style-type: disc; padding-left: 20px; }
            .disclaimer { font-style: italic; color: #6b7280; font-size: 9pt; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
        </style>
        </head>
        <body>
            <h1>NutriScan AI - Personalized 7-Day Meal Plan</h1>
            <p><strong>Generated for:</strong> ${profile?.name || 'User'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <div class="summary-box">
                <p>${plan.planSummary}</p>
            </div>
    `;

    const mealOrder = ['Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
    const cleanMealName = (name: string) => name.replace(/[^a-zA-Z\\s-]/g, '').trim();

    plan.dailyPlans.slice(0, 7).forEach(day => {
        html += `<h2>${day.day.toUpperCase()} | ~${Math.round(day.dailyTotals.calories)} kcal</h2>`;

        const sortedMeals = Object.entries(day.meals).sort(([a], [b]) => {
            const indexA = mealOrder.indexOf(cleanMealName(a));
            const indexB = mealOrder.indexOf(cleanMealName(b));
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });

        sortedMeals.forEach(([mealType, mealData]) => {
            const meal = mealData as MealItem;
            html += `
                <div class="meal-card">
                    <h3>${cleanMealName(mealType)}: ${meal.name} (~${Math.round(meal.macros.calories)} kcal)</h3>
                    <p><strong>Macros:</strong> P:${meal.macros.proteinGrams.toFixed(1)}g, C:${meal.macros.carbsGrams.toFixed(1)}g, F:${meal.macros.fatGrams.toFixed(1)}g</p>
                    <p><strong>Glycemic Load (GL):</strong> ${meal.glycemicInfo.load.toFixed(1)} (${meal.glycemicInfo.explanation})</p>
                    <h4>Ingredients:</h4>
                    <ul>
                        ${meal.ingredients.map(ing => {
                            let noteText = '';
                            if (ing.notes && ing.notes.length > 0) {
                                noteText = ` <em>[Note: ${ing.notes.map(n => n.text).join(', ')}]</em>`;
                            }
                            return `<li>${ing.name} (${ing.weightGrams}g)${noteText}</li>`;
                        }).join('')}
                    </ul>
                    <h4>Recipe:</h4>
                    <p>${meal.recipe.replace(/\\n/g, '<br>')}</p>
                </div>
            `;
        });
    });

    html += `
        <h2>CLINICAL JUSTIFICATION & SAFETY NOTES</h2>
        <h4>Nutritional Justification:</h4>
        <ul>
            ${plan.nutritionalJustificationTable.map(j => `<li><strong>${j.parameter}:</strong> ${j.justification}</li>`).join('')}
        </ul>
        <h4>Condition-Specific Adjustments:</h4>
        <ul>
            ${plan.conditionSpecificAdjustments.map(a => `<li><strong>${a.condition} ${a.conflictFlag ? '(ALERT)' : ''}:</strong> ${a.adjustment}</li>`).join('')}
        </ul>

        <p class="disclaimer">
            Disclaimer: This AI-generated meal plan is for informational purposes only and is not a substitute for professional medical advice. Consult a healthcare provider before making significant dietary changes.
        </p>
    `;

    html += `</body></html>`;
    return html;
};

const SafetyPanel: React.FC<{ justifications: NutritionalJustification[], adjustments: ConditionAdjustment[] }> = ({ justifications, adjustments }) => {
    const { t } = useLocale();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <div className="flex items-center">
                    <AlertTriangleIcon className="w-6 h-6 mr-3 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-200">{t('dietician.safety_panel_title')}</h3>
                </div>
                 <ChevronDownIcon className={`w-5 h-5 text-yellow-700 dark:text-yellow-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 dark:text-gray-100">{t('dietician.justification_table_title')}</h4>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
                            {justifications.map((item, i) => (
                                <div key={i} className="p-2 bg-white/50 dark:bg-gray-800/40 rounded-md">
                                    <p><strong>{item.parameter}:</strong> {item.justification}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 dark:text-gray-100">{t('dietician.condition_adjustments_title')}</h4>
                         <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
                            {adjustments.map((item, i) => (
                                <div key={i} className={`p-2 rounded-md flex items-start gap-2 ${item.conflictFlag ? 'bg-red-100 dark:bg-red-900/50' : 'bg-white/50 dark:bg-gray-800/40'}`}>
                                   {item.conflictFlag && <AlertTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                                   <p><strong>{item.condition}:</strong> {item.adjustment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const MealPlanDisplay: React.FC<{ plan: MealPlan, onPlanUpdate: (updatedPlan: MealPlan) => void }> = ({ plan, onPlanUpdate }) => {
    const { profile } = useAppContext();
    const [activeDay, setActiveDay] = useState(0);
    const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
    const [swapState, setSwapState] = useState<{ dayIndex: number; mealType: string; meal: MealItem; ingredient: MealIngredient; isLoading: boolean; options: MealSwapSuggestion[] | null; error?: string; } | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { t } = useLocale();

    const handleExport = async (format: 'pdf' | 'docx') => {
        setShowExportModal(false);
        setIsExporting(true);
    
        // Simulate generation time
        await new Promise(resolve => setTimeout(resolve, 500));
    
        let blob: Blob;
        let fileName: string;
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
        if (format === 'docx') {
            const htmlContent = generateDocxContent(plan, profile);
            blob = new Blob([htmlContent], { type: 'application/msword' });
            fileName = `NutriScan_MealPlan_${dateStr}.doc`;
        } else { // 'pdf' which is currently txt
            let content = `NutriScan AI - Personalized 7-Day Meal Plan\n`;
            content += `Generated for: ${profile?.name || 'User'}\n`;
            content += `Date: ${new Date().toLocaleDateString()}\n`;
            content += "========================================\n\n";
            
            content += `PLAN SUMMARY\n----------------\n${plan.planSummary}\n\n`;
    
            plan.dailyPlans.slice(0, 7).forEach(day => {
                content += `================== ${day.day.toUpperCase()} | ~${Math.round(day.dailyTotals.calories)} kcal ==================\n\n`;
                
                const mealOrder = ['Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
                const mealEntries = Object.entries(day.meals).sort(([a], [b]) => {
                    const cleanA = a.replace(/[^a-zA-Z\\s-]/g, '').trim();
                    const cleanB = b.replace(/[^a-zA-Z\\s-]/g, '').trim();
                    const indexA = mealOrder.indexOf(cleanA) === -1 ? 99 : mealOrder.indexOf(cleanA);
                    const indexB = mealOrder.indexOf(cleanB) === -1 ? 99 : mealOrder.indexOf(cleanB);
                    return indexA - indexB;
                });
    
                mealEntries.forEach(([mealType, mealData]) => {
                    const meal = mealData as MealItem;
                    const cleanMealType = mealType.replace(/[^a-zA-Z\\s-]/g, '').trim();
    
                    content += `--- ${cleanMealType}: ${meal.name} (~${Math.round(meal.macros.calories)} kcal) ---\n`;
                    content += `  • Macros: P:${meal.macros.proteinGrams.toFixed(1)}g, C:${meal.macros.carbsGrams.toFixed(1)}g, F:${meal.macros.fatGrams.toFixed(1)}g\n`;
                    content += `  • Glycemic Load (GL): ${meal.glycemicInfo.load.toFixed(1)} (${meal.glycemicInfo.explanation})\n`;
                    content += `  • Ingredients:\n`;
                    meal.ingredients.forEach(ing => {
                        let noteText = '';
                        if (ing.notes && ing.notes.length > 0) {
                            noteText = ` [Note: ${ing.notes.map(n => n.text).join(', ')}]`;
                        }
                        content += `      - ${ing.name} (${ing.weightGrams}g)${noteText}\n`;
                    });
                    content += `  • Recipe:\n${meal.recipe.split('\\n').map(line => `      ${line}`).join('\\n')}\n\n`;
                });
            });
            
            content += `==================== CLINICAL JUSTIFICATION & SAFETY NOTES ====================\n\n`;
            content += `Nutritional Justification:\n`;
            plan.nutritionalJustificationTable.forEach(j => {
                content += `  • ${j.parameter}: ${j.justification}\n`;
            });
            content += `\nCondition-Specific Adjustments:\n`;
            plan.conditionSpecificAdjustments.forEach(a => {
                content += `  • ${a.condition} (${a.conflictFlag ? 'ALERT' : 'OK'}): ${a.adjustment}\n`;
            });
            
            content += `\n\n----------------------------------------\n`;
            content += `Disclaimer: This AI-generated meal plan is for informational purposes only and is not a substitute for professional medical advice. Consult a healthcare provider before making significant dietary changes.`;
    
            blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            fileName = `NutriScan_MealPlan_${dateStr}.txt`;
        }
    
        try {
            const file = new File([blob], fileName, { type: blob.type });
    
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'NutriScan AI Meal Plan',
                    text: 'Here is my 7-day meal plan from NutriScan AI.',
                    files: [file],
                });
            } else {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Export failed:", error);
            alert("Could not share or download the file.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleSwapRequest = async (dayIndex: number, mealType: string, meal: MealItem, ingredient: MealIngredient) => {
        if (!profile) return;
        setSwapState({ dayIndex, mealType, meal, ingredient, isLoading: true, options: null });
        try {
            const swapOptions = await getIngredientSwaps(meal, ingredient, profile);
            setSwapState(s => s ? { ...s, isLoading: false, options: swapOptions } : null);
        } catch (err) {
            setSwapState(s => s ? { ...s, isLoading: false, error: err instanceof Error ? err.message : 'Failed to get swaps' } : null);
        }
    };
    
    const handleSelectSwap = (suggestion: MealSwapSuggestion) => {
        if (!swapState) return;
        const { dayIndex, mealType } = swapState;
        
        const updatedDailyPlans = plan.dailyPlans.map((dayPlan, index) => {
            if (index === dayIndex) {
                const newMeals = { ...dayPlan.meals, [mealType]: suggestion.recalculatedMeal };
                return { ...dayPlan, meals: newMeals };
            }
            return dayPlan;
        });
        onPlanUpdate({ ...plan, dailyPlans: updatedDailyPlans });
        setSwapState(null); 
    };

    const toggleMeal = (mealKey: string) => {
        setExpandedMeal(prev => (prev === mealKey ? null : mealKey));
    };

    const getNoteIcon = (type: 'alert' | 'info' | 'interaction') => {
        switch (type) {
            case 'alert': return <AlertTriangleIcon className="w-4 h-4 text-yellow-400" />;
            case 'interaction': return <HeartbeatIcon className="w-4 h-4 text-red-400" />;
            case 'info': return <InfoIcon className="w-4 h-4 text-blue-400" />;
            default: return null;
        }
    };

    const DayTab: React.FC<{ day: string, index: number }> = ({ day, index }) => (
        <button
            onClick={() => setActiveDay(index)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeDay === index ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
        >
            {day.substring(0, 3)}
        </button>
    );

    const currentDayPlan = plan.dailyPlans[activeDay];

    const mealOrder = ['Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
    const sortedMeals = useMemo(() => {
        if (!currentDayPlan || !currentDayPlan.meals) return [];
        return Object.entries(currentDayPlan.meals).sort(([a], [b]) => {
            const cleanMealName = (name: string) => name.replace(/[^a-zA-Z\s-]/g, '').trim();
            const indexA = mealOrder.indexOf(cleanMealName(a));
            const indexB = mealOrder.indexOf(cleanMealName(b));
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [currentDayPlan]);

    return (
        <div className="space-y-4 animate-fadeIn">
             {swapState && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => setSwapState(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-center mb-2 dark:text-gray-100">Swap '{swapState.ingredient.name}'</h3>
                        {swapState.isLoading ? (
                             <div className="text-center py-4"><Spinner /><p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Finding alternatives...</p></div>
                        ) : swapState.error ? (
                            <p className="text-center text-red-500">{swapState.error}</p>
                        ) : (
                            <div className="space-y-3">
                                {swapState.options?.map(option => (
                                    <button key={option.swapName} onClick={() => handleSelectSwap(option)} className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <p className="font-semibold dark:text-gray-100">{option.swapName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ~{Math.round(option.recalculatedMeal.macros.calories)} kcal, GL: {option.recalculatedMeal.glycemicInfo.load.toFixed(1)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => setShowExportModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xs p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-center mb-4 dark:text-gray-100">Export Plan</h3>
                        <div className="space-y-3">
                            <button onClick={() => handleExport('pdf')} className="w-full flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <PdfIcon className="w-5 h-5 mr-2" /> Export as PDF
                            </button>
                            <button onClick={() => handleExport('docx')} className="w-full flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <DocxIcon className="w-5 h-5 mr-2" /> Export as Word Document
                            </button>
                            <button onClick={() => setShowExportModal(false)} className="w-full text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-4 bg-green-50 dark:bg-green-900/50 border-2 border-green-200 dark:border-green-800 rounded-xl flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center mb-2">
                        <LightbulbIcon className="w-6 h-6 mr-2" />
                        {t('dietician.summary_title')}
                    </h2>
                    <p className="text-green-900 dark:text-green-100 text-sm">{plan.planSummary}</p>
                </div>
                <button onClick={() => setShowExportModal(true)} disabled={isExporting} className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    {isExporting ? <Spinner /> : <DownloadIcon className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {plan.dailyPlans.slice(0, 7).map((p, i) => <DayTab key={`${p.day}-${i}`} day={p.day} index={i} />)}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-xl font-bold dark:text-gray-100">{currentDayPlan.day}</h3>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{Math.round(currentDayPlan.dailyTotals.calories)} kcal</p>
                </div>

                {sortedMeals.map(([mealType, mealData]) => {
                     const meal = mealData as MealItem;
                     if (!meal) return null;
                     const mealKey = `${currentDayPlan.day}-${mealType}`;
                     const isExpanded = expandedMeal === mealKey;

                     const cleanMealName = (name: string) => name.replace(/[^a-zA-Z\s-]/g, '').trim();
                     const mealName = cleanMealName(mealType);

                     return (
                        <div key={mealKey} className="border-t dark:border-gray-700 first:border-t-0 py-3">
                             <button onClick={() => toggleMeal(mealKey)} className="w-full flex justify-between items-center text-left">
                                <div>
                                    <p className="font-semibold capitalize text-gray-500 dark:text-gray-400 text-xs">{mealName}</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{meal.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">{Math.round(meal.macros.calories)} kcal</span>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="mt-4 pl-3 border-l-2 border-green-500 space-y-4 text-sm animate-fadeIn">
                                    <p className="text-gray-600 dark:text-gray-300"><strong>{t('dietician.meal_card.macros')}:</strong> P: {meal.macros.proteinGrams}g, C: {meal.macros.carbsGrams}g, F: {meal.macros.fatGrams}g</p>
                                    <div>
                                        <h5 className="font-semibold mb-1 dark:text-gray-100">{t('dietician.meal_card.ingredients')}:</h5>
                                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                                            {meal.ingredients.map(ing => (
                                                <li key={ing.name} className="flex items-center gap-2">
                                                    <button onClick={() => handleSwapRequest(activeDay, mealType, meal, ing)} className="flex items-center gap-2 p-1 -m-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                                        <SwapIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                                        <span>{ing.name} ({ing.weightGrams}g)</span>
                                                    </button>
                                                    {ing.notes?.map((note, idx) => (
                                                        <Tooltip key={idx} text={note.text}>
                                                            {getNoteIcon(note.type)}
                                                        </Tooltip>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-1 dark:text-gray-100">{t('dietician.meal_card.recipe')}:</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">{meal.recipe}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-1 dark:text-gray-100">{t('dietician.meal_card.glycemic_info')}:</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <strong>Glycemic Load (GL): {meal.glycemicInfo.load.toFixed(1)}</strong>. {meal.glycemicInfo.explanation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                     );
                })}
            </div>

            <SafetyPanel justifications={plan.nutritionalJustificationTable} adjustments={plan.conditionSpecificAdjustments} />
            
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center px-4 pt-2">
                {t('dietician.disclaimer')}
            </p>
        </div>
    );
}

const steps = [
    { id: 1, titleKey: 'dietician_questionnaire.p1.title', subtitleKey: 'dietician_questionnaire.p1.subtitle' },
    { id: 2, titleKey: 'dietician_questionnaire.p2.title', subtitleKey: 'dietician_questionnaire.p2.subtitle' },
    { id: 3, titleKey: 'dietician_questionnaire.p3.title', subtitleKey: 'dietician_questionnaire.p3.subtitle' },
    { id: 4, titleKey: 'dietician_questionnaire.p4.title', subtitleKey: 'dietician_questionnaire.p4.subtitle' }
];

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const progress = (currentStep / steps.length) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const MeasurementGuideModal: React.FC<{ guide: 'neck' | 'waist' | 'hip'; onClose: () => void }> = ({ guide, onClose }) => {
    const guides = {
        neck: {
            title: "How to Measure Neck Circumference",
            text: "Wrap the measuring tape around your neck, just below the larynx (Adam's apple). Keep the tape level and snug, but not tight. Read the measurement where the tape overlaps.",
            img: <NeckMeasurementImage />
        },
        waist: {
            title: "How to Measure Waist Circumference",
            text: "Find the top of your hip bone and the bottom of your ribs. Place the tape measure midway between these points and wrap it around your waist. Breathe out normally and take the measurement.",
            img: <WaistMeasurementImage />
        },
        hip: {
            title: "How to Measure Hip Circumference",
            text: "Stand with your feet together. Wrap the measuring tape around the widest part of your hips and buttocks. Ensure the tape is parallel to the floor all the way around.",
            img: <HipMeasurementImage />
        }
    };
    const currentGuide = guides[guide];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{currentGuide.title}</h3>
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                   <div className="w-full h-full p-2">{currentGuide.img}</div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentGuide.text}</p>
            </div>
        </div>
    );
};

// --- Child Components for each step ---

const Step1Goals: React.FC<{ data: Partial<UserProfile>, setData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, onValidationChange: (isValid: boolean) => void }> = ({ data, setData, onValidationChange }) => {
    const { t } = useLocale();

    useEffect(() => {
        onValidationChange(!!data.targetWeightKg && !!data.currentWeightKg);
    }, [data.targetWeightKg, data.currentWeightKg, onValidationChange]);

    const weightGoal = useMemo(() => {
        if (data.targetWeightKg && data.currentWeightKg) {
            if (data.targetWeightKg < data.currentWeightKg) return 'lose';
            if (data.targetWeightKg > data.currentWeightKg) return 'gain';
        }
        return 'maintain';
    }, [data.targetWeightKg, data.currentWeightKg]);

    const handleGoalChange = (type: 'lose' | 'maintain' | 'gain') => {
        let newTargetWeight = data.currentWeightKg || 70;
        if (type === 'lose') newTargetWeight = Math.max(40, newTargetWeight - 5);
        if (type === 'gain') newTargetWeight += 5;
        setData(d => ({ ...d, targetWeightKg: newTargetWeight }));
    };
    
    return (
        <div className="space-y-6">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">{t('dietician_questionnaire.p1.explanation')}</p>
            <RadioGroup label="" options={[ {value: 'lose', label: t('dietician_questionnaire.p1.goal_lose')}, {value: 'maintain', label: t('dietician_questionnaire.p1.goal_maintain')}, {value: 'gain', label: t('dietician_questionnaire.p1.goal_gain')} ]} selected={weightGoal} onChange={v => handleGoalChange(v as any)} />
            <Input id="targetWeight" label={t('dietician_questionnaire.p1.target_weight_label')} type="number" value={String(data.targetWeightKg || '')} onChange={e => setData(d => ({...d, targetWeightKg: parseFloat(e.target.value)}))} icon={<TargetIcon className="w-5 h-5"/>} />
        </div>
    );
};

const Step2BodyComp: React.FC<{ data: Partial<UserProfile>, setData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, onValidationChange: (isValid: boolean) => void }> = ({ data, setData, onValidationChange }) => {
    const { t } = useLocale();
    const [errors, setErrors] = useState<{ neck?: string; waist?: string; hip?: string }>({});
    const [guideVisible, setGuideVisible] = useState<'neck' | 'waist' | 'hip' | null>(null);

    const [neckValue, setNeckValue] = useState(String(data.neckCircumferenceCm ?? ''));
    const [waistValue, setWaistValue] = useState(String(data.waistCircumferenceCm ?? ''));
    const [hipValue, setHipValue] = useState(String(data.hipCircumferenceCm ?? ''));

    const createChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 5 || value.toLowerCase().includes('e')) {
            return;
        }
        const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        setter(sanitizedValue);
    };

    useEffect(() => {
        const parseAndValidate = (strValue: string, fieldKey: 'neck' | 'waist' | 'hip') => {
            const numValue = strValue === '' || strValue.endsWith('.') || strValue === '.' ? undefined : parseFloat(strValue);
            
            const ranges = {
                neck: { min: 30, max: 60 },
                waist: { min: 60, max: 160 },
                hip: { min: 60, max: 180 }
            };
            const { min, max } = ranges[fieldKey];
            
            let error: string | undefined = undefined;
            if (numValue !== undefined) {
                if (numValue < min || numValue > max) {
                    error = `Please enter a value between ${min} and ${max} cm.`;
                }
            }
            
            return {
                numValue: numValue !== undefined && !isNaN(numValue) ? numValue : undefined,
                error: error,
            };
        };

        const neckResult = parseAndValidate(neckValue, 'neck');
        const waistResult = parseAndValidate(waistValue, 'waist');
        const hipResult = parseAndValidate(hipValue, 'hip');

        setErrors({
            neck: neckResult.error,
            waist: waistResult.error,
            hip: hipResult.error,
        });

        setData(d => ({
            ...d,
            neckCircumferenceCm: neckResult.numValue,
            waistCircumferenceCm: waistResult.numValue,
            hipCircumferenceCm: hipResult.numValue
        }));

    }, [neckValue, waistValue, hipValue, setData]);

    useEffect(() => {
        const hasNeck = data.neckCircumferenceCm !== undefined && !errors.neck;
        const hasWaist = data.waistCircumferenceCm !== undefined && !errors.waist;
        const hasHip = data.hipCircumferenceCm !== undefined && !errors.hip;

        const isValid = hasNeck && hasWaist && hasHip;
        onValidationChange(isValid);
    }, [data, errors, onValidationChange]);
    
    const whr = useMemo(() => {
        if (data.waistCircumferenceCm && data.hipCircumferenceCm && data.hipCircumferenceCm > 0 && !errors.waist && !errors.hip) {
            return (data.waistCircumferenceCm / data.hipCircumferenceCm).toFixed(2);
        }
        return null;
    }, [data.waistCircumferenceCm, data.hipCircumferenceCm, errors.waist, errors.hip]);

    const whrRisk = useMemo(() => {
        if (!whr) return null;
        const whrValue = parseFloat(whr);
        const gender = data.gender;
        
        if (gender === 'Male') {
            if (whrValue >= 0.94) return { level: 'Visceral Fat Risk Alert', message: 'Your WHR indicates an elevated risk for metabolic health issues.', color: 'text-red-400' };
            return { level: 'Healthy Range', message: 'Your WHR suggests a healthy body fat distribution.', color: 'text-green-400' };
        }
        if (gender === 'Female') {
            if (whrValue >= 0.85) return { level: 'Visceral Fat Risk Alert', message: 'Your WHR indicates an elevated risk for metabolic health issues.', color: 'text-red-400' };
            return { level: 'Healthy Range', message: 'Your WHR suggests a healthy body fat distribution.', color: 'text-green-400' };
        }
        return { level: 'WHR Assessment', message: 'Risk assessment is most accurate for Male/Female categories.', color: 'text-gray-400' };
    }, [whr, data.gender]);

    const inputClasses = (hasError?: string) => `
        block w-full rounded-xl border-2 bg-white dark:bg-gray-700
        px-4 py-3 h-14
        text-gray-900 dark:text-gray-100 text-lg
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-4
        ${hasError
            ? 'border-red-500/50 dark:border-red-400/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20'
        }
    `;

    return (
        <div className="space-y-6">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">{t('dietician_questionnaire.p2.explanation')}</p>
            
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="neck" className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('dietician_questionnaire.p2.neck_label')}
                    </label>
                    <button type="button" onClick={() => setGuideVisible('neck')} className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1">
                        <InfoIcon className="w-4 h-4" /> Tap for Guide
                    </button>
                </div>
                <input id="neck" type="text" value={neckValue} onChange={createChangeHandler(setNeckValue)} className={inputClasses(errors.neck)} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Measure just below the larynx (Adam's apple) with a measuring tape perpendicular to the long axis of the neck.
                </p>
                {errors.neck && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.neck}</p>}
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="waist" className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('dietician_questionnaire.p2.waist_label')}
                    </label>
                    <button type="button" onClick={() => setGuideVisible('waist')} className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1">
                        <InfoIcon className="w-4 h-4" /> Tap for Guide
                    </button>
                </div>
                <input id="waist" type="text" value={waistValue} onChange={createChangeHandler(setWaistValue)} className={inputClasses(errors.waist)} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Measure at the narrowest point between the lower rib and the top of the hip bone.
                </p>
                {errors.waist && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.waist}</p>}
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="hip" className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('dietician_questionnaire.p2.hip_label')}
                    </label>
                    <button type="button" onClick={() => setGuideVisible('hip')} className="text-blue-500 hover:text-blue-400 text-xs font-semibold flex items-center gap-1">
                        <InfoIcon className="w-4 h-4" /> Tap for Guide
                    </button>
                </div>
                <input id="hip" type="text" value={hipValue} onChange={createChangeHandler(setHipValue)} className={inputClasses(errors.hip)} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Measure around the widest portion of the buttocks and hips, with the tape parallel to the floor.
                </p>
                {errors.hip && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.hip}</p>}
            </div>

            {whr && whrRisk && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center animate-fadeIn">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Waist-to-Hip Ratio (WHR)</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{whr}</p>
                    <p className={`text-sm font-semibold ${whrRisk.color}`}>{whrRisk.level}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{whrRisk.message}</p>
                </div>
            )}
            
            {guideVisible && <MeasurementGuideModal guide={guideVisible} onClose={() => setGuideVisible(null)} />}
        </div>
    );
};

const Step3Lifestyle: React.FC<{ data: Partial<UserProfile>, setData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, onValidationChange: (isValid: boolean) => void }> = ({ data, setData, onValidationChange }) => {
    const { t } = useLocale();
    const [dislikedFoodInput, setDislikedFoodInput] = useState('');
    const [supplementInput, setSupplementInput] = useState('');
    
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);


    const cuisineOptions = [
        { value: 'North Indian', label: 'North Indian' },
        { value: 'Tamil', label: 'Tamil' },
        { value: 'Bengali', label: 'Bengali' },
        { value: 'Mediterranean', label: 'Mediterranean' },
        { value: 'South East Asian', label: 'South East Asian' },
        { value: 'Western', label: 'Western' },
    ];
    
    const mealFreqOptions = [
        { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }
    ];

    const cookingTimeOptions = [
      { value: '< 15 mins', label: '< 15 mins' },
      { value: '15-30 mins', label: '15-30 mins' },
      { value: '> 30 mins', label: '> 30 mins' }
    ];

    return (
        <div className="space-y-6">
             <p className="text-sm text-center text-gray-600 dark:text-gray-400">{t('dietician_questionnaire.p3.explanation')}</p>
            <Select id="cuisine" label={t('dietician_questionnaire.p3.cuisine_label')} options={cuisineOptions} value={data.culturalCuisinePref || ''} onChange={e => setData(d => ({...d, culturalCuisinePref: e.target.value}))} />
            <RadioGroup label={t('dietician_questionnaire.p3.frequency_label')} options={mealFreqOptions} selected={String(data.preferredMealFrequency || '')} onChange={v => setData(d => ({...d, preferredMealFrequency: parseInt(v)}))} />
            <RadioGroup label={t('dietician_questionnaire.p3.cooking_time_label')} options={cookingTimeOptions} selected={data.cookingTime || ''} onChange={v => setData(d => ({...d, cookingTime: v as any}))} />
            <TagInput label={t('dietician_questionnaire.p3.disliked_label')} tags={data.dislikedFoods || []} setTags={tags => setData(d => ({...d, dislikedFoods: tags}))} placeholder={t('dietician_questionnaire.p3.disliked_placeholder')} inputValue={dislikedFoodInput} onInputChange={setDislikedFoodInput} />
            <TagInput label={t('dietician_questionnaire.p3.supplements_label')} tags={data.currentSupplements || []} setTags={tags => setData(d => ({...d, currentSupplements: tags}))} placeholder={t('dietician_questionnaire.p3.supplements_placeholder')} inputValue={supplementInput} onInputChange={setSupplementInput} />
        </div>
    );
};

const Step4Metabolic: React.FC<{ data: Partial<UserProfile>, setData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, onValidationChange: (isValid: boolean) => void }> = ({ data, setData, onValidationChange }) => {
    const { t } = useLocale();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isConnectingCloud, setIsConnectingCloud] = useState(false);
    const [cloudStatus, setCloudStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus(null);
        setCloudStatus(null);

        const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!supportedTypes.includes(file.type)) {
            setUploadStatus({type: 'error', message: "Unsupported file type. Please upload a PDF, DOCX, JPG, or PNG."});
            setIsUploading(false);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const dataUrl = reader.result as string;
                const base64Data = dataUrl.split(',')[1];
                const extractedText = await extractLabValuesFromFile(base64Data, file.type);

                if (extractedText) {
                    setData(d => ({
                        ...d,
                        labValues: d.labValues ? `${d.labValues}\n${extractedText}` : extractedText
                    }));
                    setUploadStatus({ type: 'success', message: "Lab values extracted and added successfully!"});
                } else {
                    setUploadStatus({ type: 'error', message: "Could not find any valid lab values in the document."});
                }

            } catch (err) {
                setUploadStatus({ type: 'error', message: err instanceof Error ? err.message : 'An unknown error occurred.' });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.onerror = () => {
             setUploadStatus({ type: 'error', message: 'Failed to read the file.'});
             setIsUploading(false);
        }
        reader.readAsDataURL(file);
    };
    
    const handleConnectCloudStorage = async (provider: 'Google Drive' | 'Dropbox') => {
        alert(`In a real app, this would initiate a secure OAuth connection to your ${provider} account to select a file.`);
        setIsConnectingCloud(true);
        setCloudStatus(null);
        setUploadStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const sampleLabReportBase64 = "iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAADW+HdfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIaSURBVHhe7d3BaoQwFAbgC/+/tA90bYJgS92J0l06CAbhYxobA8nJ75757Af45pP7/wSAgQkDEwYmDEwYmDCw6fB4PAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8Hg+L4sDEwYmDAwYWDDBBYmDEwYmDAwYWDCwIQJi4nBYDDg8wTW0dExaDR2wWDQeDyO/f0D9vf3GI/H0e/vMRgMQovFgEajgVotg9FotFotyLIsyLIsiLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsyLIsy-";
            const extractedText = await extractLabValuesFromFile(sampleLabReportBase64, 'image/png');

            if (extractedText) {
                setData(d => ({
                    ...d,
                    labValues: d.labValues ? `${d.labValues}\n${extractedText}` : extractedText
                }));
                setCloudStatus({ type: 'success', message: `Lab values extracted from ${provider} document!` });
            } else {
                setCloudStatus({ type: 'error', message: `Could not find any lab values in the document from ${provider}.` });
            }
        } catch (err) {
            setCloudStatus({ type: 'error', message: err instanceof Error ? err.message : 'An unknown error occurred.' });
        } finally {
            setIsConnectingCloud(false);
        }
    };
    
    const StatusMessage: React.FC<{ status: { type: 'error' | 'success', message: string } | null }> = ({ status }) => {
        if (!status) return null;
        const isError = status.type === 'error';
        const Icon = isError ? AlertTriangleIcon : CheckCircleIcon;
        const colors = isError
            ? 'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300'
            : 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-700 text-green-700 dark:text-green-300';
        
        return (
            <div className={`mt-3 p-3 rounded-lg flex items-center text-sm ${colors}`}>
                <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{status.message}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
             <p className="text-sm text-center text-gray-600 dark:text-gray-400">{t('dietician_questionnaire.p4.explanation')}</p>
            <textarea
                value={data.labValues || ''}
                onChange={e => setData(d => ({...d, labValues: e.target.value}))}
                rows={4}
                placeholder={t('dietician_questionnaire.p4.lab_values_placeholder')}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
             <div className="pt-4 border-t border-gray-600/50">
                 <div className="flex items-center justify-between mb-3">
                     <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                         Or, upload a lab report
                     </h3>
                     <Tooltip text="Upload documents like blood test reports, lab results (PDF, DOCX, or images). The AI will securely extract key data to create a precise meal plan.">
                        <InfoIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </Tooltip>
                 </div>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                 />
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isConnectingCloud}
                    className="w-full flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all disabled:opacity-50"
                 >
                    {isUploading ? <Spinner /> : <><PaperclipIcon className="w-5 h-5 mr-3" /> <span>Upload Lab Report</span></>}
                 </button>
                 <StatusMessage status={uploadStatus} />
            </div>

            <div className="pt-4 border-t border-gray-600/50">
                 <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                     Or, connect cloud storage
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <button
                        type="button"
                        onClick={() => handleConnectCloudStorage('Google Drive')}
                        disabled={isUploading || isConnectingCloud}
                        className="w-full flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all disabled:opacity-50"
                     >
                        <GoogleDriveIcon className="w-5 h-5 mr-3"/>
                        <span>Connect Google Drive</span>
                     </button>
                     <button
                        type="button"
                        onClick={() => handleConnectCloudStorage('Dropbox')}
                        disabled={isUploading || isConnectingCloud}
                        className="w-full flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all disabled:opacity-50"
                     >
                         <DropboxIcon className="w-5 h-5 mr-3"/>
                         <span>Connect Dropbox</span>
                     </button>
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Connection is Read-Only. We only extract and store lab values, not the original documents.
                </p>
                {isConnectingCloud && (
                    <div className="mt-3 text-center text-sm text-yellow-500 dark:text-yellow-400 flex items-center justify-center">
                        <Spinner />
                        <span className="ml-2">Connecting and processing...</span>
                    </div>
                 )}
                 <StatusMessage status={cloudStatus} />
            </div>
        </div>
    );
};


const DieticianScreen: React.FC = () => {
    const { profile, setProfile, setView } = useAppContext();
    const { t } = useLocale();
    
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {});
    const [isStepValid, setIsStepValid] = useState(false);

    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const loadingMessages = useMemo(() => [
        t('dietician.loading.message1'), t('dietician.loading.message2'), t('dietician.loading.message3'), t('dietician.loading.message4'), t('dietician.loading.message5'),
    ], [t]);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setCurrentLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages]);

    const handleGeneratePlan = async () => {
        if (!profile || !isStepValid) return;
        
        const finalProfile: UserProfile = { ...profile, ...formData, isProfileComplete: true };
        setProfile(finalProfile); 

        setIsLoading(true);
        setError(null);
        try {
            const plan = await generateMealPlan(finalProfile, { type: (formData.targetWeightKg || 0) < (profile.currentWeightKg || 0) ? 'lose' : (formData.targetWeightKg || 0) > (profile.currentWeightKg || 0) ? 'gain' : 'maintain' });
            setMealPlan(plan);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while generating your plan.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Spinner />
                <h2 className="text-xl font-semibold mt-4 dark:text-gray-100">{t('dietician.loading.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400">{currentLoadingMessage}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold dark:text-gray-100">{t('dietician.error.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <button onClick={() => { setError(null); setStep(1); }} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">Try Again</button>
            </div>
        );
    }
    
    if (mealPlan) {
        return <MealPlanDisplay plan={mealPlan} onPlanUpdate={setMealPlan} />;
    }

    const currentStepInfo = steps[step - 1];
    
    const nextButtonDisabled = !isStepValid;

    return (
        <div className="flex flex-col h-full">
            <div className="text-center py-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(currentStepInfo.titleKey)}</h1>
            </div>
            <div className="mb-4">
                <ProgressBar currentStep={step} />
            </div>

            <div className="flex-grow overflow-y-auto p-1">
                {step === 1 && <Step1Goals data={formData} setData={setFormData} onValidationChange={setIsStepValid} />}
                {step === 2 && <Step2BodyComp data={formData} setData={setFormData} onValidationChange={setIsStepValid} />}
                {step === 3 && <Step3Lifestyle data={formData} setData={setFormData} onValidationChange={setIsStepValid} />}
                {step === 4 && <Step4Metabolic data={formData} setData={setFormData} onValidationChange={setIsStepValid} />}
            </div>

             <div className="flex-shrink-0 pt-4 flex items-center justify-between">
                <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-6 py-3 rounded-lg font-semibold transition bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">{t('navigation.back')}</button>
                {step < steps.length ? (
                    <button onClick={() => setStep(s => s + 1)} disabled={nextButtonDisabled} className="px-6 py-3 rounded-lg font-semibold transition bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">{t('dietician_questionnaire.navigation.confirm_continue')}</button>
                ) : (
                    <button onClick={handleGeneratePlan} disabled={nextButtonDisabled} className="px-6 py-3 rounded-lg font-semibold transition bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {t('dietician.generate_button')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DieticianScreen;