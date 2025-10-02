import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserProfile, Medication } from '../../types';
import { validateDateOfBirth, calculateBmi, getOptimalHealthyWeight, cmToFtIn, kgToLbs } from '../../utils/validation';
import { TagInput } from '../ui/TagInput';
import { CheckboxGroup, RadioGroup, Select, SearchableSelect } from '../ui/FormElements';
import { UserIcon, CalendarIcon, LanguageIcon, GenderIcon, LeafIcon, AlertTriangleIcon, HeartIcon, TargetIcon, RunningIcon, GlobeIcon, HeightIcon, ScaleIcon, LightbulbIcon, BedIcon, InfoIcon, FireIcon, WineIcon, BrainIcon, UsersIcon, ForkKnifeIcon, ChefHatIcon, WaterDropIcon, BriefcaseIcon, PaperclipIcon, CheckIcon, XIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';
import Input from '../ui/Input';
import { getAllStates, getCitiesForState, getLanguageRecommendations, getAllLanguages } from '../../data/languages';
import { useLocale } from '../../context/LocaleContext';
import { extractProfileFromFile } from '../../services/geminiService';

const medicationsDB: Medication[] = [
    {
        id: 'metformin_500',
        genericName: 'Metformin',
        brandNames: ['Glycomet', 'Glucophage', 'Glyciphage'],
        formulation: 'Tablet',
        activeIngredients: ['Metformin Hydrochloride'],
        commonDosages: ['250mg', '500mg', '850mg', '1000mg'],
        associatedConditions: ['Diabetes', 'PCOS/PCOD'],
        regionCode: 'IN',
        notes: 'Commonly used to control blood sugar in Type 2 Diabetes and manage symptoms of PCOS.'
    },
    {
        id: 'glimepiride_1',
        genericName: 'Glimepiride',
        brandNames: ['Amaryl', 'Glimy', 'Zoryl'],
        formulation: 'Tablet',
        activeIngredients: ['Glimepiride'],
        commonDosages: ['1mg', '2mg', '3mg', '4mg'],
        associatedConditions: ['Diabetes'],
        regionCode: 'IN',
        notes: 'Stimulates the pancreas to produce more insulin. Used for Type 2 Diabetes.'
    },
    {
        id: 'amlodipine_5',
        genericName: 'Amlodipine',
        brandNames: ['Amlong', 'Amlopres', 'Stamlo'],
        formulation: 'Tablet',
        activeIngredients: ['Amlodipine Besylate'],
        commonDosages: ['2.5mg', '5mg', '10mg'],
        associatedConditions: ['High Blood Pressure (Hypertension)'],
        regionCode: 'IN',
        notes: 'A calcium channel blocker that relaxes blood vessels to improve blood flow.'
    },
    {
        id: 'telmisartan_40',
        genericName: 'Telmisartan',
        brandNames: ['Telma', 'Cresar', 'Telsartan'],
        formulation: 'Tablet',
        activeIngredients: ['Telmisartan'],
        commonDosages: ['20mg', '40mg', '80mg'],
        associatedConditions: ['High Blood Pressure (Hypertension)'],
        regionCode: 'IN',
        notes: 'An angiotensin II receptor blocker (ARB) used to treat high blood pressure.'
    },
    {
        id: 'zerodol_mr',
        genericName: 'Aceclofenac + Paracetamol + Tizanidine',
        brandNames: ['Zerodol-MR'],
        formulation: 'Tablet',
        activeIngredients: ['Aceclofenac', 'Paracetamol', 'Tizanidine'],
        commonDosages: ['100mg/325mg/2mg'],
        associatedConditions: ['Pain', 'Inflammation'],
        regionCode: 'IN',
        notes: 'A combination medication for pain relief, fever reduction, and muscle relaxation.'
    },
    {
        id: 'atorvastatin_10',
        genericName: 'Atorvastatin',
        brandNames: ['Atorva', 'Lipitor', 'Storvas'],
        formulation: 'Tablet',
        activeIngredients: ['Atorvastatin'],
        commonDosages: ['10mg', '20mg', '40mg', '80mg'],
        associatedConditions: ['High Cholesterol (Dyslipidemia)'],
        regionCode: 'IN',
        notes: 'A statin used to lower "bad" cholesterol (LDL) and fats (triglycerides).'
    },
    {
        id: 'thyroxine_50',
        genericName: 'Thyroxine Sodium',
        brandNames: ['Thyronorm', 'Eltroxin', 'Thyroup'],
        formulation: 'Tablet',
        activeIngredients: ['Thyroxine Sodium'],
        commonDosages: ['12.5mcg', '25mcg', '50mcg', '100mcg'],
        associatedConditions: ['Thyroid Disorder'],
        regionCode: 'IN',
        notes: 'A synthetic thyroid hormone used to treat hypothyroidism.'
    },
    {
        id: 'alprax_0.5',
        genericName: 'Alprazolam',
        brandNames: ['Alprax', 'Xanax', 'Anxit'],
        formulation: 'Tablet',
        activeIngredients: ['Alprazolam'],
        commonDosages: ['0.25mg', '0.5mg', '1mg'],
        associatedConditions: ['Anxiety Disorder'],
        regionCode: 'IN',
        notes: 'A benzodiazepine used to treat anxiety and panic disorders.'
    },
    {
        id: 'becosules',
        genericName: 'Vitamin B Complex with Vitamin C',
        brandNames: ['Becosules', 'Bocosules', 'Supradyn'],
        formulation: 'Capsule',
        activeIngredients: ['Thiamine', 'Riboflavin', 'Niacinamide', 'Pyridoxine', 'Calcium Pantothenate', 'Ascorbic Acid', 'Folic Acid', 'Cobalamin'],
        commonDosages: ['1 capsule daily'],
        associatedConditions: ['General Wellness'],
        regionCode: 'IN',
        notes: 'A supplement for vitamin B and C deficiencies.'
    },
    {
        id: 'limcee_500',
        genericName: 'Vitamin C',
        brandNames: ['Limcee', 'Celin'],
        formulation: 'Tablet',
        activeIngredients: ['Ascorbic Acid'],
        commonDosages: ['500mg'],
        associatedConditions: ['General Wellness'],
        regionCode: 'IN',
        notes: 'A supplement for Vitamin C deficiency and boosting immunity.'
    },
    {
        id: 'zincovit',
        genericName: 'Multivitamins and Minerals',
        brandNames: ['Zincovit'],
        formulation: 'Syrup',
        activeIngredients: ['Zinc', 'Copper', 'Selenium', 'Vitamin A', 'Vitamin C', 'Vitamin E', 'B-Vitamins'],
        commonDosages: ['5ml daily'],
        associatedConditions: ['General Wellness'],
        regionCode: 'IN',
        notes: 'A multivitamin and mineral supplement to improve overall health.'
    }
];

const searchMedications = (query: string, currentMeds: string[]): Medication[] => {
    if (query.length < 2) return [];
    const lowerQuery = query.toLowerCase().replace(/^(tab|cap|syr)\.?\s*/, '').trim();
    const currentMedsSet = new Set(currentMeds);

    return medicationsDB.filter(med =>
        !currentMedsSet.has(med.id) &&
        (med.genericName.toLowerCase().includes(lowerQuery) ||
        med.brandNames.some(brand => brand.toLowerCase().includes(lowerQuery)))
    ).slice(0, 5);
};

const findMedicationById = (id: string): Medication | undefined => {
    return medicationsDB.find(med => med.id === id);
};

const getFormulationAbbreviation = (formulation: Medication['formulation']) => {
    switch (formulation) {
        case 'Tablet': return 'Tab';
        case 'Capsule': return 'Cap';
        case 'Syrup': return 'Syr';
        case 'Injection': return 'Inj';
        case 'Ointment': return 'Oint';
        case 'Cream': return 'Cream';
        default: return '';
    }
};

const steps = [
    { id: 1, titleKey: 'setup.steps.basic_info.title', subtitleKey: 'setup.steps.basic_info.subtitle' },
    { id: 2, titleKey: 'setup.steps.height.title', subtitleKey: 'setup.steps.height.subtitle' },
    { id: 3, titleKey: 'setup.steps.weight.title', subtitleKey: 'setup.steps.weight.subtitle' },
    { id: 4, titleKey: 'setup.steps.allergies.title', subtitleKey: 'setup.steps.allergies.subtitle' },
    { id: 5, titleKey: 'setup.steps.diet.title', subtitleKey: 'setup.steps.diet.subtitle' },
    { id: 6, titleKey: 'setup.steps.health.title', subtitleKey: 'setup.steps.health.subtitle' },
    { id: 7, titleKey: 'setup.steps.eating_habits.title', subtitleKey: 'setup.steps.eating_habits.subtitle' },
    { id: 8, titleKey: 'setup.steps.mind_body.title', subtitleKey: 'setup.steps.mind_body.subtitle' },
    { id: 9, titleKey: 'setup.steps.lifestyle.title', subtitleKey: 'setup.steps.lifestyle.subtitle' },
    { id: 10, titleKey: 'setup.steps.summary.title', subtitleKey: 'setup.steps.summary.subtitle' }
];

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const progress = (currentStep / steps.length) * 100;
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const ChipButton: React.FC<{label: string, isSelected: boolean, onClick: () => void}> = ({label, isSelected, onClick}) => (
    <button 
        type="button"
        onClick={onClick}
        className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium border-2 transition ${isSelected ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}
    >
        {label}
    </button>
);

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    return (
        <span className="relative group inline-flex items-center">
            {children}
            <span className="absolute bottom-full mb-2 w-56 p-2 bg-gray-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-center pointer-events-none">
                {text}
                <svg className="absolute text-gray-600 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </span>
        </span>
    );
};


const ProfileSetupScreen: React.FC = () => {
    const { profile, setProfile } = useAppContext();
    const { t } = useLocale();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<UserProfile>>(profile || { language: 'English' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStepValid, setIsStepValid] = useState(false);
    const [showStepErrors, setShowStepErrors] = useState(false);
    const [showSubmitError, setShowSubmitError] = useState(false);


    const handleFieldChange = useCallback((field: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const nextStep = () => {
        if (!isStepValid) {
            setShowStepErrors(true);
            return;
        }
        setShowStepErrors(false);
        setStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setShowStepErrors(false);
        setShowSubmitError(false);
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid) {
            setShowSubmitError(true);
            return;
        }
        setShowSubmitError(false);
        setIsSubmitting(true);
        setTimeout(() => { 
            if (profile) {
                const completeProfile: UserProfile = {
                    ...profile,
                    ...formData,
                    isProfileComplete: true,
                };
                setProfile(completeProfile);
            }
            setIsSubmitting(false);
        }, 1000);
    };

    const currentStepInfo = steps[step - 1];

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white p-4 font-sans">
            <div className="text-center py-4">
                <h1 className="text-2xl font-bold">{t(currentStepInfo.titleKey)}</h1>
                <p className="text-gray-400 text-sm">{t(currentStepInfo.subtitleKey)}</p>
            </div>

            <div className="mb-4">
                <ProgressBar currentStep={step} />
                {/* FIX: Use `t` function with interpolation parameters. */}
                <p className="text-xs text-center text-gray-500 font-medium">{t('setup.progress', { current: step, total: steps.length })}</p>
            </div>

            <div className="flex-grow overflow-y-auto p-2 -mx-2">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    {step === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} onValidationChange={setIsStepValid} showErrors={showStepErrors} />}
                    {step === 2 && <Step2Height formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 3 && <Step3Weight formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 4 && <Step4Allergies formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 5 && <Step5Diet formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 6 && <Step6Health formData={formData} setFormData={setFormData} onValidationChange={setIsStepValid} />}
                    {step === 7 && <Step7EatingHabits formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 8 && <Step8MindBody formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 9 && <Step9GeneralLifestyle formData={formData} handleFieldChange={handleFieldChange} onValidationChange={setIsStepValid} />}
                    {step === 10 && <Step10Summary formData={formData} onValidationChange={setIsStepValid} showSubmitError={showSubmitError} />}
                </div>
            </div>

            <div className="flex-shrink-0 pt-4">
                <div className="flex items-center justify-between">
                    <button onClick={prevStep} className={`px-6 py-3 rounded-lg font-semibold transition ${step === 1 ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'}`} disabled={step === 1}>{t('navigation.back')}</button>
                    {step < steps.length ? (
                        <button onClick={nextStep} className="px-6 py-3 rounded-lg font-semibold transition bg-green-600 hover:bg-green-700 text-white">{t('navigation.next')}</button>
                    ) : (
                        <button onClick={handleSubmit} className={`px-6 py-3 rounded-lg font-semibold transition ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'}`} disabled={isSubmitting}>
                           {isSubmitting ? <Spinner /> : t('setup.finish_button')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Child Components for each step ---

const Step1BasicInfo: React.FC<{ formData: Partial<UserProfile>, setFormData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, onValidationChange: (isValid: boolean) => void, showErrors: boolean }> = ({ formData, setFormData, onValidationChange, showErrors }) => {
    const { t } = useLocale();
    const [dobValidation, setDobValidation] = useState(() => validateDateOfBirth(formData.dob || ''));
    
    const [states, setStates] = useState<Array<{ value: string; label: string }>>([]);
    const [cities, setCities] = useState<Array<{ value: string; label: string }>>([]);
    
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);
    const [extractSuccess, setExtractSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [minDOB, maxDOB] = useMemo(() => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 14);
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        return ['1935-01-01', formatDate(maxDate)];
    }, []);

    useEffect(() => {
        const allStates = getAllStates();
        setStates(allStates.map(s => ({ value: s, label: t(`locations.states.${s}`) || s })));
    }, [t]);
    
    useEffect(() => {
        const state = formData.location?.state;
        if (state) {
            const stateCities = getCitiesForState(state);
            setCities(stateCities.map(c => ({ value: c, label: t(`locations.cities.${c}`) || c })));
        } else {
            setCities([]);
        }
    }, [formData.location?.state, t]);

    const handleFieldChange = (field: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'dob') {
            setDobValidation(validateDateOfBirth(value));
        }
    };
    
    const handleLocationChange = (part: 'state' | 'city', value: string) => {
        setFormData(prev => {
            const newLocation = { ...(prev.location || { state: '', city: '' }), [part]: value };
            if (part === 'state') newLocation.city = '';
            return { ...prev, location: newLocation };
        });
    };

    useEffect(() => {
        const isValid = !!formData.name && validateDateOfBirth(formData.dob || '').isValid;
        onValidationChange(isValid);
    }, [formData.name, formData.dob, onValidationChange]);

    const dobMessage = useMemo(() => {
        return dobValidation.messageKey ? t(dobValidation.messageKey, dobValidation.messageParams) : undefined;
    }, [dobValidation.messageKey, dobValidation.messageParams, t]);

    const genderOptions = [
        { value: 'Male', label: t('profile.basic_info.gender_options.male') },
        { value: 'Female', label: t('profile.basic_info.gender_options.female') },
        { value: 'Other', label: t('profile.basic_info.gender_options.other') },
        { value: 'Prefer not to say', label: t('profile.basic_info.gender_options.prefer_not_to_say') }
    ];
    
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        setExtractError(null);
        setExtractSuccess(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const dataUrl = reader.result as string;
                const base64Data = dataUrl.split(',')[1];
                const extractedData = await extractProfileFromFile(base64Data, file.type);
                
                setFormData(prev => {
                    const updatedData = { ...prev };
                    for (const key in extractedData) {
                        const value = extractedData[key as keyof UserProfile];
                        if (value !== null && value !== undefined && (!Array.isArray(value) || value.length > 0)) {
                            (updatedData as any)[key] = value;
                        }
                    }
                    return updatedData;
                });

                setExtractSuccess("We've pre-filled some fields for you. Please review and edit if needed.");
            } catch (err) {
                 setExtractError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsExtracting(false);
                // Clear the file input value to allow re-uploading the same file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.onerror = () => {
             setExtractError('Failed to read the file.');
             setIsExtracting(false);
        }
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <Input id="name" label={t('profile.basic_info.name')} type="text" value={formData.name || ''} onChange={(e) => handleFieldChange('name', e.target.value)} icon={<UserIcon className="w-5 h-5" />} />
            <Input id="dob" label={t('profile.basic_info.dob')} type="date" value={formData.dob || ''} onChange={(e) => handleFieldChange('dob', e.target.value)} icon={<CalendarIcon className="w-5 h-5" />} error={(formData.dob && !dobValidation.isValid) || (showErrors && !formData.dob) ? dobMessage : undefined} success={dobValidation.isValid && formData.dob ? dobMessage : undefined} min={minDOB} max={maxDOB}/>
            <SearchableSelect id="state" label={t('profile.region.state')} value={formData.location?.state || ''} onChange={(v) => handleLocationChange('state', v)} options={states} icon={<GlobeIcon className="w-5 h-5" />} placeholder={t('profile.region.state_placeholder')} />
            <SearchableSelect id="city" label={t('profile.region.district_city')} value={formData.location?.city || ''} onChange={(v) => handleLocationChange('city', v)} options={cities} icon={<GlobeIcon className="w-5 h-5" />} placeholder={t('profile.region.city_placeholder')} disabled={!formData.location?.state} />
            <Select id="gender" label={t('profile.basic_info.gender')} value={formData.gender || ''} onChange={(e) => handleFieldChange('gender', e.target.value)} options={genderOptions} icon={<GenderIcon className="w-5 h-5" />} />
            
            <div className="pt-4 border-t border-gray-700/50">
                 <div className="flex items-center justify-between">
                     <h3 className="font-semibold text-gray-300">Or, upload a document</h3>
                     <Tooltip text="You can upload hospital records, discharge summaries, or any file with your information. The AI will extract the data to provide a personalized analysis for you.">
                        <InfoIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </Tooltip>
                 </div>
                 <p className="text-xs text-gray-400 mt-1 mb-3">Supported formats: Word, PDF, JPG, PNG</p>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,image/jpeg,image/png"
                 />
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                    className="w-full flex items-center justify-center p-3 bg-gray-700 text-gray-200 font-semibold rounded-xl shadow-md hover:bg-gray-600 border border-gray-600 transition-all disabled:opacity-50"
                 >
                    <PaperclipIcon className="w-5 h-5 mr-3" />
                    <span>Upload Document</span>
                 </button>

                 {isExtracting && (
                    <div className="mt-3 text-center text-sm text-yellow-400 flex items-center justify-center">
                        <Spinner />
                        <span className="ml-2">Analyzing your document...</span>
                    </div>
                 )}
                 {extractError && (
                    <div className="mt-3 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center text-sm">
                        <AlertTriangleIcon className="w-5 h-5 mr-2" />
                        <span>{extractError}</span>
                    </div>
                 )}
                  {extractSuccess && (
                    <div className="mt-3 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-lg flex items-center text-sm">
                        <CheckIcon className="w-5 h-5 mr-2" />
                        <span>{extractSuccess}</span>
                    </div>
                 )}
            </div>
        </div>
    );
};

const Step2Height: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    const [unit, setUnit] = useState('ft');
    const heightCm = formData.heightCm || 170;

    useEffect(() => {
        onValidationChange(heightCm > 100 && heightCm < 250);
    }, [heightCm, onValidationChange]);

    const displayValue = unit === 'ft' ? cmToFtIn(heightCm) : `${heightCm} cm`;

    return (
        <div className="flex flex-col items-center space-y-6 text-white">
            <div className="text-center">
                <div className="p-4 bg-gray-900 rounded-lg text-5xl font-bold w-48 mx-auto">{displayValue}</div>
                <div className="mt-4 inline-flex bg-gray-700 p-1 rounded-lg">
                    <button onClick={() => setUnit('ft')} className={`px-4 py-1 text-sm rounded-md ${unit === 'ft' ? 'bg-gray-500' : ''}`}>ft / in</button>
                    <button onClick={() => setUnit('cm')} className={`px-4 py-1 text-sm rounded-md ${unit === 'cm' ? 'bg-gray-500' : ''}`}>cm</button>
                </div>
            </div>
            
            <input 
                type="range" 
                min="100" 
                max="250" 
                step="1" 
                value={heightCm} 
                onChange={e => handleFieldChange('heightCm', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-vertical"
                style={{
                    // @ts-ignore
                    '--slider-color': '#10B981',
                    '--slider-track-color': '#374151',
                    '--slider-thumb-color': '#1F2937'
                }}
            />
            <div className="bg-blue-900/50 p-4 rounded-lg flex items-start text-sm">
                <LightbulbIcon className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="font-bold mb-1">{t('setup.steps.height.why_title')}</h3>
                    <p className="text-gray-300 text-xs">{t('setup.steps.height.why_text')}</p>
                </div>
            </div>
        </div>
    );
};

const Step3Weight: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    const [weightUnit, setWeightUnit] = useState('kg');
    const [maintainWeight, setMaintainWeight] = useState(true);
    const { bmi, category } = calculateBmi(formData.currentWeightKg, formData.heightCm);

    useEffect(() => {
       onValidationChange(!!formData.currentWeightKg);
    }, [formData.currentWeightKg, onValidationChange]);
    
    useEffect(() => {
        if(maintainWeight && formData.currentWeightKg) {
            handleFieldChange('targetWeightKg', formData.currentWeightKg);
        }
    }, [maintainWeight, formData.currentWeightKg, handleFieldChange]);

    const optimalWeight = getOptimalHealthyWeight(formData.heightCm);

    const bmiColorClasses: { [key: string]: string } = {
        'N/A': 'bg-gray-600',
        'Underweight': 'bg-blue-600',
        'Healthy Weight': 'bg-green-600',
        'Overweight': 'bg-yellow-600',
        'Obesity': 'bg-red-600',
    };

    const bmiCategoryKeys: { [key: string]: string } = {
        'Underweight': 'setup.steps.weight.bmi_status_underweight',
        'Healthy Weight': 'setup.steps.weight.bmi_status_healthy',
        'Overweight': 'setup.steps.weight.bmi_status_overweight',
        'Obesity': 'setup.steps.weight.bmi_status_obese',
    };

    const bmiSupportiveMessageKeys: { [key: string]: string } = {
        'Underweight': 'setup.steps.weight.bmi_support_underweight',
        'Healthy Weight': 'setup.steps.weight.bmi_support_healthy',
        'Overweight': 'setup.steps.weight.bmi_support_overweight',
        'Obesity': 'setup.steps.weight.bmi_support_obese',
    };
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                <label className="text-sm text-gray-400">{t('setup.steps.weight.current_weight_label')}</label>
                 <div className="mt-2 inline-flex items-center bg-gray-700 p-1 rounded-lg">
                    <button onClick={() => setWeightUnit('kg')} className={`px-4 py-1 text-sm rounded-md ${weightUnit === 'kg' ? 'bg-gray-500' : ''}`}>kg</button>
                    <button onClick={() => setWeightUnit('lbs')} className={`px-4 py-1 text-sm rounded-md ${weightUnit === 'lbs' ? 'bg-gray-500' : ''}`}>lbs</button>
                </div>
                <p className="text-3xl font-bold mt-2">{weightUnit === 'kg' ? formData.currentWeightKg || 60 : kgToLbs(formData.currentWeightKg || 60)} {weightUnit}</p>
                <input type="range" min="30" max="200" step="0.5" value={formData.currentWeightKg || 60} onChange={e => handleFieldChange('currentWeightKg', parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-4" />
            </div>

            <div className={`p-4 rounded-lg text-center ${bmiColorClasses[category]}`}>
                <p className="text-xs font-bold">{t('setup.steps.weight.bmi_title')}</p>
                <p className="text-3xl font-bold">{bmi || '--'}</p>
                <p className="text-sm font-semibold">{bmi ? t(bmiCategoryKeys[category]) : t('setup.steps.weight.bmi_prompt')}</p>
                {bmi && bmiSupportiveMessageKeys[category] && <p className="text-xs mt-1">{t(bmiSupportiveMessageKeys[category])}</p>}
            </div>

            <div>
                <Input 
                    id="targetWeight" 
                    label={t('setup.steps.weight.target_weight_label', { unit: weightUnit })} 
                    type="number" 
                    value={String(maintainWeight ? formData.currentWeightKg || '' : formData.targetWeightKg || '')} 
                    onChange={e => handleFieldChange('targetWeightKg', parseFloat(e.target.value))} 
                    icon={<TargetIcon className="w-5 h-5" />} 
                    disabled={maintainWeight} 
                />
                <label className="flex items-center mt-2 space-x-2 cursor-pointer">
                    <input type="checkbox" checked={maintainWeight} onChange={e => setMaintainWeight(e.target.checked)} className="h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 bg-gray-800" />
                    <span className="text-sm">{t('setup.steps.weight.maintain_weight_checkbox')}</span>
                </label>
            </div>
            
            {optimalWeight && <p className="text-xs text-yellow-400 text-center"><LightbulbIcon className="w-4 h-4 inline-block mr-1"/> {t('setup.steps.weight.weight_suggestion', { weight: optimalWeight })}</p>}
            <p className="text-xs text-gray-500 text-center italic">{t('setup.steps.weight.fun_fact')}</p>
        </div>
    );
};

const Step4Allergies: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    const [otherAllergyInput, setOtherAllergyInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);

    const commonAllergiesData = useMemo(() => [
        { value: "Peanuts", tKey: "setup.steps.allergies.items.peanuts" },
        { value: "Tree Nuts", tKey: "setup.steps.allergies.items.tree_nuts" },
        { value: "Milk", tKey: "setup.steps.allergies.items.milk" },
        { value: "Soy", tKey: "setup.steps.allergies.items.soy" },
        { value: "Eggs", tKey: "setup.steps.allergies.items.eggs" },
        { value: "Wheat", tKey: "setup.steps.allergies.items.wheat" },
        { value: "Fish", tKey: "setup.steps.allergies.items.fish" },
        { value: "Shellfish", tKey: "setup.steps.allergies.items.shellfish" },
        { value: "Sesame", tKey: "setup.steps.allergies.items.sesame" },
        { value: "Mustard", tKey: "setup.steps.allergies.items.mustard" }
    ], []);

    const commonIntolerancesData = useMemo(() => [
        { value: "Lactose Intolerance", tKey: "setup.steps.allergies.items.lactose_intolerance" },
        { value: "Gluten Sensitivity", tKey: "setup.steps.allergies.items.gluten_sensitivity" },
        { value: "Histamine Intolerance", tKey: "setup.steps.allergies.items.histamine_intolerance" },
        { value: "Sulfite Sensitivity", tKey: "setup.steps.allergies.items.sulfite_sensitivity" }
    ], []);

    const commonAllergiesValues = useMemo(() => commonAllergiesData.map(a => a.value), [commonAllergiesData]);

    const allPossibleAllergies = useMemo(() => [
        "Celery", "Corn", "Lupin", "Molluscs", "Nightshades", "Nickel", "Pollen", "Red Meat", "Seeds", "Spices", "Sulphites", "Avocado", "Banana", "Citrus", "Kiwi",
        ...commonAllergiesValues
    ].sort(), [commonAllergiesValues]);

    useEffect(() => {
        if (otherAllergyInput.trim().length > 1) {
            const lowercasedInput = otherAllergyInput.toLowerCase();
            const filtered = allPossibleAllergies.filter(allergy =>
                allergy.toLowerCase().includes(lowercasedInput) &&
                !formData.allergies?.includes(allergy)
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [otherAllergyInput, formData.allergies, allPossibleAllergies]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (suggestion: string) => {
        const currentAllergies = formData.allergies || [];
        if (!currentAllergies.includes(suggestion)) {
            handleFieldChange('allergies', [...currentAllergies, suggestion]);
        }
        setOtherAllergyInput('');
    };

    const toggleSelection = (fieldName: 'allergies' | 'intolerances', item: string) => {
        const currentList = formData[fieldName] || [];
        const newList = currentList.includes(item) 
            ? currentList.filter(i => i !== item) 
            : [...currentList, item];
        handleFieldChange(fieldName, newList);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm text-gray-400 mb-2 block">{`🥜 ${t('setup.steps.allergies.common_allergies_heading')}`}</label>
                <div className="flex flex-wrap gap-2">
                    {commonAllergiesData.map(item => <ChipButton key={item.value} label={t(item.tKey)} isSelected={(formData.allergies || []).includes(item.value)} onClick={() => toggleSelection('allergies', item.value)} />)}
                </div>
            </div>
             <div className="relative" ref={suggestionsRef}>
                <label className="text-sm text-gray-400 mb-2 block">{`➕ ${t('setup.steps.allergies.other_allergies_heading')}`}</label>
                <TagInput 
                    label=""
                    tags={formData.allergies?.filter(a => !commonAllergiesValues.includes(a)) || []} 
                    setTags={tags => handleFieldChange('allergies', [...(formData.allergies || []).filter(a => commonAllergiesValues.includes(a)), ...tags])} 
                    placeholder={t('setup.steps.allergies.input_placeholder')} 
                    inputValue={otherAllergyInput}
                    onInputChange={setOtherAllergyInput}
                />
                 {suggestions.length > 0 && (
                    <ul className="absolute z-20 w-full bg-gray-600 border border-gray-500 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {suggestions.map(suggestion => (
                            <li 
                                key={suggestion} 
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-500 text-sm"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
             </div>
             <div>
                <label className="text-sm text-gray-400 mb-2 block">{`🥛 ${t('setup.steps.allergies.common_intolerances_heading')}`}</label>
                <div className="flex flex-wrap gap-2">
                    {commonIntolerancesData.map(item => <ChipButton key={item.value} label={t(item.tKey)} isSelected={(formData.intolerances || []).includes(item.value)} onClick={() => toggleSelection('intolerances', item.value)} />)}
                </div>
            </div>
             <p className="text-xs text-gray-500 text-center pt-4">{t('setup.steps.allergies.disclaimer')}</p>
        </div>
    );
};

const Step5Diet: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    const [conflictWarning, setConflictWarning] = useState('');
    const selected = formData.dietaryPreferences || [];

    useEffect(() => {
        onValidationChange(true);
    }, [onValidationChange]);

    const handleDietChange = (newSelection: string[]) => {
        const exclusiveGroup = ['Non-Vegetarian', 'Vegetarian', 'Vegan'];
        const lastAdded = newSelection.find(item => !(selected).includes(item));

        let finalSelection = newSelection;

        if (lastAdded && exclusiveGroup.includes(lastAdded)) {
            // Keep the last added exclusive item, and filter out the others from the exclusive group.
            // Also keep any non-exclusive items that were already selected.
            finalSelection = newSelection.filter(item => !exclusiveGroup.includes(item) || item === lastAdded);
        }
        
        handleFieldChange('dietaryPreferences', finalSelection);
    };

    useEffect(() => {
        const hasKeto = selected.includes('Keto');
        const hasDash = selected.includes('DASH');

        if (hasKeto && hasDash) {
            setConflictWarning(t('setup.steps.diet.conflict_warning'));
        } else {
            setConflictWarning('');
        }
    }, [selected, t]);

    const coreDiets = [
        { value: 'Non-Vegetarian', label: t('profile.health.diet_pref_options.non_vegetarian') },
        { value: 'Vegan', label: t('profile.health.diet_pref_options.vegan') },
        { value: 'Vegetarian', label: t('profile.health.diet_pref_options.vegetarian') },
        { value: 'Paleo', label: t('profile.health.diet_pref_options.paleo') },
        { value: 'Keto', label: t('profile.health.diet_pref_options.keto') },
    ];
    
    const healthDiets = [
        { value: 'Low Sodium', label: t('profile.health.diet_pref_options.low_sodium') },
        { value: 'DASH', label: t('profile.health.diet_pref_options.dash') },
        { value: 'Diabetic/Low Glycemic Index (GI)', label: t('profile.health.diet_pref_options.diabetic') },
        { value: 'Gluten-Free', label: t('profile.health.diet_pref_options.gluten_free') },
        { value: 'Lactose-Free/Dairy-Free', label: t('profile.health.diet_pref_options.lactose_free') },
        { value: 'Low Fodmap', label: t('profile.health.diet_pref_options.low_fodmap') },
        { value: 'Renal Diet', label: t('profile.health.diet_pref_options.renal') }
    ];

    const advancedMods = [
        { value: 'High Protein', label: t('profile.health.diet_pref_options.high_protein') },
        { value: 'Whole Food Focused', label: t('profile.health.diet_pref_options.whole_food') },
        { value: 'Intermittent Fasting (IF)', label: t('profile.health.diet_pref_options.intermittent_fasting') }
    ];

    const culturalDiets = [
        { value: 'Halal', label: t('profile.health.diet_pref_options.halal') },
        { value: 'Kosher', label: t('profile.health.diet_pref_options.kosher') },
        { value: 'Jain', label: t('profile.health.diet_pref_options.jain') },
        { value: 'Ayurvedic', label: t('profile.health.diet_pref_options.ayurvedic') }
    ];
    
    return (
        <div className="space-y-6">
            <CheckboxGroup label={t('setup.steps.diet.restrictive_title')} options={coreDiets} selected={selected} onChange={handleDietChange} />
            <CheckboxGroup label={t('setup.steps.diet.health_title')} options={healthDiets} selected={selected} onChange={v => handleFieldChange('dietaryPreferences', v)} />
            <CheckboxGroup label={t('setup.steps.diet.advanced_title')} options={advancedMods} selected={selected} onChange={v => handleFieldChange('dietaryPreferences', v)} />
            <CheckboxGroup label={t('setup.steps.diet.cultural_title')} options={culturalDiets} selected={selected} onChange={v => handleFieldChange('dietaryPreferences', v)} />

            {conflictWarning && (
                <div className="p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg flex items-start text-sm animate-fadeIn">
                    <AlertTriangleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{conflictWarning}</span>
                </div>
            )}
        </div>
    );
};

const CategoryHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="text-lg font-bold text-green-400 border-b-2 border-green-800 pb-2 mb-4">{title}</h3>
);

const ConditionInput: React.FC<{
    condition: string;
    isChecked: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}> = ({ condition, isChecked, onToggle, children }) => (
    <div className="bg-gray-700/50 p-3 rounded-lg">
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onToggle}
                className="h-4 w-4 rounded border-gray-500 text-green-600 focus:ring-green-500 bg-gray-800"
            />
            <span className="text-sm text-gray-200 font-medium">{condition}</span>
        </label>
        {isChecked && children && (
            <div className="mt-3 pt-3 border-t border-gray-600 pl-6 animate-fadeIn">
                {children}
            </div>
        )}
    </div>
);

const otherConditionsSuggestions = [
  'Asthma', 'Multiple Sclerosis', "Crohn's Disease", 'Celiac Disease', 'Rheumatoid Arthritis',
  'Lupus', 'Psoriasis', 'Gout', 'Endometriosis', 'Migraines', 'Epilepsy',
  'Depression', 'Anxiety Disorder', 'Bipolar Disorder', 'Schizophrenia',
  'Breast Cancer', 'Lung Cancer', 'Prostate Cancer', 'Colon Cancer',
  'Anemia', 'GERD', 'Sleep Apnea', 'Osteoarthritis', 'Fibromyalgia'
].sort();

const MedicationDetailsModal: React.FC<{ medication: Medication; onClose: () => void }> = ({ medication, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
                <XIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">{medication.brandNames[0] || medication.genericName}</h3>
            <p className="text-sm text-gray-400 mb-4">{medication.genericName}</p>
            <div className="space-y-3 text-sm">
                <div>
                    <h4 className="font-semibold text-gray-300">Active Ingredients:</h4>
                    <p className="text-gray-400">{medication.activeIngredients.join(', ')}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300">Common Dosages:</h4>
                    <p className="text-gray-400">{medication.commonDosages.join(', ')}</p>
                </div>
                {medication.notes && (
                    <div>
                        <h4 className="font-semibold text-gray-300">Common Indications:</h4>
                        <p className="text-gray-400">{medication.notes}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ProactiveSuggestions: React.FC<{
    conditions: string[];
    onAdd: (medId: string) => void;
    currentMeds: string[];
}> = ({ conditions, onAdd, currentMeds }) => {
    const suggestions = useMemo(() => {
        if (conditions.length === 0) return [];
        const conditionSet = new Set(conditions);
        return medicationsDB.filter(med => 
            med.associatedConditions.some(ac => conditionSet.has(ac)) &&
            !currentMeds.includes(med.id)
        ).slice(0, 3);
    }, [conditions, currentMeds]);
    
    if (suggestions.length === 0) return null;

    return (
        <div className="bg-blue-900/50 p-3 rounded-lg text-sm mb-4">
            <h4 className="font-bold mb-2 text-blue-300 flex items-center"><LightbulbIcon className="w-5 h-5 mr-2"/> Suggested for you</h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map(med => (
                    <button key={med.id} onClick={() => onAdd(med.id)} className="px-3 py-1.5 bg-blue-800/70 hover:bg-blue-700 text-blue-200 rounded-full text-xs font-semibold">
                        + {med.brandNames[0] || med.genericName}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Step6Health: React.FC<{ 
    formData: Partial<UserProfile>, 
    setFormData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>, 
    onValidationChange: (isValid: boolean) => void 
}> = ({ formData, setFormData, onValidationChange }) => {
    const { t } = useLocale();
    const currentGoals = formData.healthGoals || [];
    const [otherConditionsInput, setOtherConditionsInput] = useState('');

    const [medicationInput, setMedicationInput] = useState('');
    const [medicationSuggestions, setMedicationSuggestions] = useState<Medication[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const [selectedMedicationForModal, setSelectedMedicationForModal] = useState<Medication | null>(null);
    const medInputWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ckdSelected = formData.healthConditions?.includes('Chronic Kidney Disease (CKD)');
        const ckdStageSelected = !!formData.healthConditionsDetails?.ckdStage;
        onValidationChange(!(ckdSelected && !ckdStageSelected));
    }, [formData.healthConditions, formData.healthConditionsDetails, onValidationChange]);

    const handleConditionToggle = (condition: string) => {
        const currentConditions = formData.healthConditions || [];
        const newConditions = currentConditions.includes(condition)
            ? currentConditions.filter(c => c !== condition)
            : [...currentConditions, condition];
        setFormData(prev => ({ ...prev, healthConditions: newConditions }));
    };

    const handleDetailChange = (field: keyof NonNullable<UserProfile['healthConditionsDetails']>, value: any) => {
        setFormData(prev => ({
            ...prev,
            healthConditionsDetails: {
                ...prev.healthConditionsDetails,
                [field]: value
            }
        }));
    };

    const isChecked = (condition: string) => (formData.healthConditions || []).includes(condition);
    const details = formData.healthConditionsDetails || {};

    const metabolicConditions = [
        { name: 'Diabetes', detailField: 'diabetesType', options: [{value: 'Type 1', label: 'Type 1'}, {value: 'Type 2', label: 'Type 2'}, {value: 'Gestational', label: 'Gestational'}] },
        { name: 'PCOS/PCOD', detailField: 'pcosPhenotype', options: [{value: 'NIH', label: 'NIH'}, {value: 'Rotterdam', label: 'Rotterdam'}, {value: 'Androgen Excess', label: 'Androgen Excess'}] },
        { name: 'Thyroid Disorder', detailField: 'thyroidDisorder', options: [{value: 'Hypothyroidism', label: 'Hypothyroidism'}, {value: 'Hyperthyroidism', label: 'Hyperthyroidism'}] },
        { name: 'Fatty Liver Disease', detailField: 'fattyLiverStage', options: [{value: 'Grade 1', label: 'Grade 1'}, {value: 'Grade 2', label: 'Grade 2'}, {value: 'Grade 3', label: 'Grade 3'}, {value: 'Cirrhosis', label: 'Cirrhosis'}] }
    ];
    
    const cardioConditions = [
        { name: 'High Blood Pressure (Hypertension)', detailField: 'hypertensionSeverity', options: [{value: 'Pre-hypertension', label: 'Pre-hypertension'}, {value: 'Stage 1', label: 'Stage 1'}, {value: 'Stage 2', label: 'Stage 2'}] },
        { name: 'Heart Disease', detailField: 'heartDiseaseType', options: [{value: 'Previous MI', label: 'Previous MI'}, {value: 'Congestive Heart Failure (CHF)', label: 'CHF'}, {value: 'Angina', label: 'Angina'}] },
        { name: 'High Cholesterol (Dyslipidemia)', detailField: 'highCholesterolFocus', options: [{value: 'High LDL', label: 'High LDL'}, {value: 'Low HDL', label: 'Low HDL'}, {value: 'High Triglycerides', label: 'High Triglycerides'}] }
    ];
    
    const handleHealthGoalChange = (newGoals: string[]) => {
        const lastSelected = newGoals.find(g => !currentGoals.includes(g));
        let finalGoals = [...newGoals];

        if (lastSelected === 'Weight Loss') {
            finalGoals = finalGoals.filter(g => g !== 'Weight Gain');
        } else if (lastSelected === 'Weight Gain') {
            finalGoals = finalGoals.filter(g => g !== 'Weight Loss' && g !== 'Fat Loss');
        } else if (lastSelected === 'Fat Loss') {
            finalGoals = finalGoals.filter(g => g !== 'Weight Gain');
        }
        
        setFormData(d => ({ ...d, healthGoals: finalGoals }));
    };

    const disabledOptions = useMemo(() => {
        const goals = formData.healthGoals || [];
        if (goals.includes('Weight Loss')) return ['Weight Gain'];
        if (goals.includes('Weight Gain')) return ['Weight Loss', 'Fat Loss'];
        if (goals.includes('Fat Loss')) return ['Weight Gain'];
        return [];
    }, [formData.healthGoals]);

    // Medication handlers
    const addMedication = (medId: string) => {
        const currentMeds = formData.medications || [];
        if (!currentMeds.includes(medId)) {
            setFormData(d => ({ ...d, medications: [...currentMeds, medId] }));
        }
        setMedicationInput('');
        setMedicationSuggestions([]);
        setIsSuggestionsVisible(false);
    };

    const removeMedication = (medId: string) => {
        setFormData(d => ({ ...d, medications: (d.medications || []).filter(id => id !== medId) }));
    };

    useEffect(() => {
        if (medicationInput.length >= 2) {
            const results = searchMedications(medicationInput, formData.medications || []);
            setMedicationSuggestions(results);
            setIsSuggestionsVisible(results.length > 0);
        } else {
            setMedicationSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    }, [medicationInput, formData.medications]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (medInputWrapperRef.current && !medInputWrapperRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-8">
            {/* Health Conditions */}
            <div>
                <CategoryHeader title="Metabolic & Endocrine" />
                <div className="space-y-2">
                    {metabolicConditions.map(cond => (
                        <ConditionInput key={cond.name} condition={cond.name} isChecked={isChecked(cond.name)} onToggle={() => handleConditionToggle(cond.name)}>
                            <RadioGroup label={`Subtype`} options={cond.options} selected={details[cond.detailField as keyof typeof details] || ''} onChange={v => handleDetailChange(cond.detailField as any, v)} />
                        </ConditionInput>
                    ))}
                </div>
            </div>
            <div>
                <CategoryHeader title="Cardiovascular & Hypertension" />
                <div className="space-y-2">
                    {cardioConditions.map(cond => (
                        <ConditionInput key={cond.name} condition={cond.name} isChecked={isChecked(cond.name)} onToggle={() => handleConditionToggle(cond.name)}>
                            <RadioGroup label="Severity/Type" options={cond.options} selected={details[cond.detailField as keyof typeof details] || ''} onChange={v => handleDetailChange(cond.detailField as any, v)} />
                        </ConditionInput>
                    ))}
                </div>
            </div>
            <div>
                <CategoryHeader title="Kidney & Renal" />
                <div className="space-y-2">
                    <ConditionInput condition="Chronic Kidney Disease (CKD)" isChecked={isChecked('Chronic Kidney Disease (CKD)')} onToggle={() => handleConditionToggle('Chronic Kidney Disease (CKD)')}>
                        <RadioGroup label="Stage (Mandatory)" options={[{value:'Stage 1', label:'Stage 1'},{value:'Stage 2', label:'Stage 2'},{value:'Stage 3', label:'Stage 3'},{value:'Stage 4', label:'Stage 4'},{value:'Stage 5/Dialysis', label:'Stage 5/Dialysis'}]} selected={details.ckdStage || ''} onChange={v => handleDetailChange('ckdStage', v)} />
                        {isChecked('Chronic Kidney Disease (CKD)') && !details.ckdStage && <p className="text-xs text-red-400 mt-2">Please select a stage for CKD.</p>}
                    </ConditionInput>
                </div>
            </div>
            <div>
                <CategoryHeader title="Digestive & Gut" />
                 <div className="space-y-2">
                    <ConditionInput condition="Irritable Bowel Syndrome (IBS)" isChecked={isChecked('Irritable Bowel Syndrome (IBS)')} onToggle={() => handleConditionToggle('Irritable Bowel Syndrome (IBS)')}>
                        <RadioGroup label="Type" options={[{value:'IBS-D', label:'IBS-D'},{value:'IBS-C', label:'IBS-C'},{value:'IBS-M', label:'IBS-M'}]} selected={details.ibsType || ''} onChange={v => handleDetailChange('ibsType', v)} />
                    </ConditionInput>
                    <ConditionInput condition="GERD / Acid Reflux" isChecked={isChecked('GERD / Acid Reflux')} onToggle={() => handleConditionToggle('GERD / Acid Reflux')} />
                </div>
            </div>
             <div>
                <CategoryHeader title="Mental Health" />
                <div className="space-y-2">
                    <ConditionInput condition="Anxiety Disorder" isChecked={isChecked('Anxiety Disorder')} onToggle={() => handleConditionToggle('Anxiety Disorder')} />
                    <ConditionInput condition="Depression" isChecked={isChecked('Depression')} onToggle={() => handleConditionToggle('Depression')} />
                </div>
            </div>
            <div>
                <CategoryHeader title="Musculoskeletal & Joint" />
                <div className="space-y-2">
                    <ConditionInput condition="Osteoporosis / Osteopenia" isChecked={isChecked('Osteoporosis / Osteopenia')} onToggle={() => handleConditionToggle('Osteoporosis / Osteopenia')} />
                </div>
            </div>
            <div>
                <CategoryHeader title="General Health" />
                <div className="space-y-2">
                    <ConditionInput condition="Obesity" isChecked={isChecked('Obesity')} onToggle={() => handleConditionToggle('Obesity')} />
                </div>
            </div>
             <div className="pt-4 border-t border-gray-700">
                <TagInput
                    label={t('setup.steps.health.other_conditions_label')}
                    tags={formData.otherConditions || []}
                    setTags={(tags) => setFormData(d => ({ ...d, otherConditions: tags }))}
                    placeholder={t('setup.steps.health.other_conditions_placeholder')}
                    inputValue={otherConditionsInput}
                    onInputChange={setOtherConditionsInput}
                    suggestions={otherConditionsSuggestions}
                    icon={<HeartIcon className="w-5 h-5"/>}
                />
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-bold text-green-400 mb-4">Health Goals</h3>
                <CheckboxGroup 
                    label="" 
                    options={[
                        { value: 'Weight Loss', label: 'Weight Loss' },
                        { value: 'Weight Gain', label: 'Weight Gain' },
                        { value: 'Muscle Gain', label: 'Muscle Gain' },
                        { value: 'Fat Loss', label: 'Fat Loss' },
                        { value: 'Diabetes Control', label: 'Diabetes Control' },
                        { value: 'Heart Health', label: 'Heart Health' },
                        { value: 'Improve Sleep', label: 'Improve Sleep' },
                        { value: 'Reduce Stress', label: 'Reduce Stress' },
                        { value: 'General Wellness', label: 'General Wellness' }
                    ]} 
                    selected={currentGoals} 
                    onChange={handleHealthGoalChange}
                    disabledOptions={disabledOptions}
                />
            </div>

            {/* NEW MEDICATION SECTION */}
            <div className="pt-6 border-t border-gray-700">
                <h3 className="text-lg font-bold text-green-400 mb-4">Current Medications</h3>
                
                <ProactiveSuggestions 
                    conditions={formData.healthConditions || []} 
                    currentMeds={formData.medications || []}
                    onAdd={addMedication}
                />

                <div className="relative" ref={medInputWrapperRef}>
                    <Input 
                        id="medication-input"
                        label="Type medication name and press Enter"
                        type="text"
                        value={medicationInput}
                        onChange={(e) => setMedicationInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && medicationInput.trim()) {
                                e.preventDefault();
                                if (medicationSuggestions.length > 0) {
                                    addMedication(medicationSuggestions[0].id);
                                } else {
                                    // Fallback for free-text entry
                                    const trimmedInput = medicationInput.trim();
                                    const unverifiedId = `unverified:${trimmedInput}`;
                                    addMedication(unverifiedId);
                                }
                            }
                        }}
                        icon={<TargetIcon className="w-5 h-5"/>}
                    />
                    {isSuggestionsVisible && (
                        <ul className="absolute z-30 w-full bg-gray-600 border border-gray-500 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                            {medicationSuggestions.map((med) => (
                                <li 
                                    key={med.id} 
                                    onClick={() => addMedication(med.id)}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-500 text-sm"
                                >
                                    <span className="font-semibold">{med.brandNames[0] || med.genericName}</span>
                                    <span className="text-xs text-gray-300 ml-2">({med.genericName})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {(formData.medications || []).map(medId => {
                        // Handle unverified drugs
                        if (medId.startsWith('unverified:')) {
                            const medName = medId.replace('unverified:', '');
                            const displayName = medName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            
                            return (
                                <div key={medId} className="flex items-center bg-yellow-800/50 text-sm font-medium pl-3 pr-1 py-1 rounded-full animate-fadeIn border border-yellow-700">
                                    <span className="mr-1 text-yellow-200">{displayName}</span>
                                    <span className="text-xs text-yellow-400 mr-2">(Unverified)</span>
                                    <Tooltip text="This drug was added as free text. Please ensure correct spelling. The AI will use this name to check for interactions, but accuracy depends on correct input.">
                                        <button className="p-1 rounded-full hover:bg-gray-600 transition-colors">
                                            <InfoIcon className="w-4 h-4 text-blue-400" />
                                        </button>
                                    </Tooltip>
                                    <button onClick={() => removeMedication(medId)} className="p-1 rounded-full hover:bg-gray-600 transition-colors">
                                        <XIcon className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            );
                        }

                        // Existing logic for verified drugs
                        const med = findMedicationById(medId);
                        if (!med) return null;
                        
                        const ingredients = med.activeIngredients;
                        const ingredientsText = ingredients.length > 2
                            ? `${ingredients.slice(0, 2).join(' + ')}...`
                            : ingredients.join(' + ');

                        return (
                            <div key={med.id} className="flex items-center bg-gray-700 text-sm font-medium pl-3 pr-1 py-1 rounded-full animate-fadeIn">
                                <span className="mr-1">{getFormulationAbbreviation(med.formulation)} {med.brandNames[0] || med.genericName}</span>
                                <span className="text-xs text-gray-400 mr-2">({ingredientsText})</span>
                                <button onClick={() => setSelectedMedicationForModal(med)} className="p-1 rounded-full hover:bg-gray-600 transition-colors">
                                    <InfoIcon className="w-4 h-4 text-blue-400" />
                                </button>
                                <button onClick={() => removeMedication(med.id)} className="p-1 rounded-full hover:bg-gray-600 transition-colors">
                                    <XIcon className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedMedicationForModal && (
                <MedicationDetailsModal medication={selectedMedicationForModal} onClose={() => setSelectedMedicationForModal(null)} />
            )}
        </div>
    );
};


const Step7EatingHabits: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);

    const mealFrequencyOptions = [
        { value: '1-2 meals/day', label: t('profile.eating_habits.meal_frequency_options.one_two') },
        { value: '3 meals/day', label: t('profile.eating_habits.meal_frequency_options.three') },
        { value: '4-5 small meals/day', label: t('profile.eating_habits.meal_frequency_options.four_five') }
    ];
    
    const cookingSkillsOptions = [
        { value: 'Beginner', label: t('profile.eating_habits.cooking_skills_options.beginner') },
        { value: 'Intermediate', label: t('profile.eating_habits.cooking_skills_options.intermediate') },
        { value: 'Expert', label: t('profile.eating_habits.cooking_skills_options.expert') }
    ];

    return (
        <div className="space-y-6">
            <RadioGroup label={t('profile.eating_habits.meal_frequency')} options={mealFrequencyOptions} selected={formData.mealFrequency || ''} onChange={v => handleFieldChange('mealFrequency', v)} icon={<ForkKnifeIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.eating_habits.cooking_skills')} options={cookingSkillsOptions} selected={formData.cookingSkills || ''} onChange={v => handleFieldChange('cookingSkills', v)} icon={<ChefHatIcon className="w-5 h-5" />} />
        </div>
    );
};

const Step8MindBody: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    const [lifeEventInput, setLifeEventInput] = useState('');
    
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);
    
    useEffect(() => {
        if (formData.waterIntakeLiters === undefined) {
            handleFieldChange('waterIntakeLiters', 2.5);
        }
    }, [formData.waterIntakeLiters, handleFieldChange]);

    const waterIntakeOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(v => ({
        value: String(v),
        label: `${v} L`
    }));

    const waterIntakeValue = formData.waterIntakeLiters;
    const guidanceMessage = useMemo(() => {
        if (waterIntakeValue && waterIntakeValue <= 1.5) {
            const unit = t(waterIntakeValue === 1 ? 'units.liter' : 'units.liters');
            return t('setup.steps.mind_body.water_intake_low_warning', { value: `${waterIntakeValue} ${unit}` });
        } else if (waterIntakeValue && waterIntakeValue >= 4) {
            const unit = t('units.liters'); // 4 and above is always plural
            return t('setup.steps.mind_body.water_intake_high_warning', { value: `${waterIntakeValue} ${unit}` });
        }
        return '';
    }, [waterIntakeValue, t]);

    const primaryBeveragesOptions = [
        { value: 'Water', label: t('profile.mind_body.primary_beverages_options.water') },
        { value: 'Coffee/Tea', label: t('profile.mind_body.primary_beverages_options.coffee_tea') },
        { value: 'Sugary Drinks', label: t('profile.mind_body.primary_beverages_options.sugary_drinks') }
    ];
    const lifeStageOptions = [
        { value: 'Student', label: t('profile.mind_body.life_stage_options.student') },
        { value: 'Working Professional', label: t('profile.mind_body.life_stage_options.professional') },
        { value: 'Parent', label: t('profile.mind_body.life_stage_options.parent') },
        { value: 'Retiree', label: t('profile.mind_body.life_stage_options.retiree') }
    ];
    const motivationOptions = [
        { value: 'Thinking about it', label: t('profile.mind_body.motivation_options.thinking') },
        { value: 'Ready to start', label: t('profile.mind_body.motivation_options.ready') },
        { value: 'Already started', label: t('profile.mind_body.motivation_options.started') }
    ];
    const socialSupportOptions = [
        { value: 'true', label: t('profile.mind_body.social_support_options.yes') },
        { value: 'false', label: t('profile.mind_body.social_support_options.no') }
    ];

    return (
        <div className="space-y-6">
             <div>
                <Select
                    id="waterIntake"
                    label={t('profile.mind_body.water_intake')}
                    options={waterIntakeOptions}
                    value={String(formData.waterIntakeLiters || '')}
                    onChange={(e) => handleFieldChange('waterIntakeLiters', e.target.value ? parseFloat(e.target.value) : undefined)}
                    icon={<WaterDropIcon className="w-5 h-5" />}
                />
                {guidanceMessage && (
                    <div className="mt-3 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg flex items-start text-sm animate-fadeIn">
                        <AlertTriangleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{guidanceMessage}</span>
                    </div>
                )}
                <p className="text-xs text-gray-500 text-center mt-3">
                    <em>{t('setup.steps.mind_body.water_intake_disclaimer')}</em>
                </p>
            </div>
            <CheckboxGroup label={t('profile.mind_body.primary_beverages')} options={primaryBeveragesOptions} selected={formData.primaryBeverages || []} onChange={v => handleFieldChange('primaryBeverages', v)} icon={<WineIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.mind_body.life_stage')} options={lifeStageOptions} selected={formData.lifeStage || ''} onChange={v => handleFieldChange('lifeStage', v)} icon={<BriefcaseIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.mind_body.motivation')} options={motivationOptions} selected={formData.motivation || ''} onChange={v => handleFieldChange('motivation', v)} icon={<TargetIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.mind_body.social_support')} options={socialSupportOptions} selected={formData.socialSupport === true ? 'true' : formData.socialSupport === false ? 'false' : ''} onChange={v => handleFieldChange('socialSupport', v === 'true' ? true : (v === 'false' ? false : null))} icon={<UsersIcon className="w-5 h-5" />} />
            <TagInput label={t('profile.mind_body.life_events')} tags={formData.lifeEvents || []} setTags={(tags) => handleFieldChange('lifeEvents', tags)} placeholder={t('profile.mind_body.life_events_placeholder')} icon={<CalendarIcon className="w-5 h-5" />} inputValue={lifeEventInput} onInputChange={setLifeEventInput} />
        </div>
    );
};


const Step9GeneralLifestyle: React.FC<{ formData: Partial<UserProfile>, handleFieldChange: (field: keyof UserProfile, value: any) => void, onValidationChange: (isValid: boolean) => void }> = ({ formData, handleFieldChange, onValidationChange }) => {
    const { t } = useLocale();
    useEffect(() => { onValidationChange(true); }, [onValidationChange]);
    
    const activityOptions = [
        { value: 'Sedentary', label: t('profile.lifestyle.activity_options.sedentary') },
        { value: 'Light', label: t('profile.lifestyle.activity_options.light') },
        { value: 'Moderate', label: t('profile.lifestyle.activity_options.moderate') },
        { value: 'Active', label: t('profile.lifestyle.activity_options.active') },
        { value: 'Athlete', label: t('profile.lifestyle.activity_options.athlete') }
    ];
    const stressOptions = [
        { value: 'Low', label: t('profile.lifestyle.stress_options.low') },
        { value: 'Medium', label: t('profile.lifestyle.stress_options.medium') },
        { value: 'High', label: t('profile.lifestyle.stress_options.high') }
    ];
    const smokingOptions = [
        { value: 'true', label: t('profile.lifestyle.smoking_options.yes') },
        { value: 'false', label: t('profile.lifestyle.smoking_options.no') }
    ];
    const alcoholOptions = [
        { value: 'Never', label: t('profile.lifestyle.alcohol_options.never') },
        { value: 'Occasionally', label: t('profile.lifestyle.alcohol_options.occasionally') },
        { value: 'Daily', label: t('profile.lifestyle.alcohol_options.daily') }
    ];

    const sleepTrackingOptions = [
        { value: 'Estimate', label: t('profile.lifestyle.sleep_tracking_options.estimate') },
        { value: 'Tracked', label: t('profile.lifestyle.sleep_tracking_options.tracked') }
    ];
    const sleepQualityOptions = [
        { value: 'Poor', label: t('profile.lifestyle.sleep_quality_options.poor') },
        { value: 'Fair', label: t('profile.lifestyle.sleep_quality_options.fair') },
        { value: 'Good', label: t('profile.lifestyle.sleep_quality_options.good') },
        { value: 'Excellent', label: t('profile.lifestyle.sleep_quality_options.excellent') }
    ];

    return (
        <div className="space-y-6">
            <RadioGroup label={t('profile.lifestyle.activity')} options={activityOptions} selected={formData.activityLevel || ''} onChange={v => handleFieldChange('activityLevel', v)} icon={<RunningIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.lifestyle.stress')} options={stressOptions} selected={formData.stressLevel || ''} onChange={v => handleFieldChange('stressLevel', v)} icon={<BrainIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.lifestyle.smoking')} options={smokingOptions} selected={formData.smoking === true ? 'true' : formData.smoking === false ? 'false' : ''} onChange={v => handleFieldChange('smoking', v === 'true' ? true : (v === 'false' ? false : null))} icon={<FireIcon className="w-5 h-5" />} />
            <RadioGroup label={t('profile.lifestyle.alcohol')} options={alcoholOptions} selected={formData.alcohol || ''} onChange={v => handleFieldChange('alcohol', v)} icon={<WineIcon className="w-5 h-5" />} />
            <div className="space-y-4 border-t border-gray-700 pt-6">
                 <Input
                    id="sleepHours"
                    label={t('profile.lifestyle.sleep')}
                    type="number"
                    value={String(formData.sleepHours || '')}
                    onChange={(e) => handleFieldChange('sleepHours', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    icon={<BedIcon className="w-5 h-5" />}
                />
                <RadioGroup label={t('profile.lifestyle.sleep_tracking')} options={sleepTrackingOptions} selected={formData.sleepTracking || ''} onChange={v => handleFieldChange('sleepTracking', v)} icon={<InfoIcon className="w-5 h-5" />} />
                <RadioGroup label={t('profile.lifestyle.sleep_quality')} options={sleepQualityOptions} selected={formData.sleepQuality || ''} onChange={v => handleFieldChange('sleepQuality', v)} icon={<InfoIcon className="w-5 h-5" />} />
            </div>
        </div>
    );
};

const Step10Summary: React.FC<{ formData: Partial<UserProfile>, onValidationChange: (isValid: boolean) => void, showSubmitError?: boolean }> = ({ formData, onValidationChange, showSubmitError }) => {
    const [agreed, setAgreed] = useState(false);
    
    useEffect(() => {
        onValidationChange(agreed);
    }, [agreed, onValidationChange]);

    const SummaryItem: React.FC<{label: string, value: string | undefined | null | string[] | number | boolean}> = ({label, value}) => {
        let displayValue: string;

        if (Array.isArray(value) && value.length > 0) {
            displayValue = value.join(', ');
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else if (value) {
            displayValue = String(value);
        } else {
            return null; // Don't render if value is empty/null/undefined
        }
        
        return (
            <div className="flex justify-between text-sm py-2 border-b border-gray-700">
                <dt className="text-gray-400">{label}:</dt>
                <dd className="text-right font-semibold text-gray-200 break-words text-wrap ml-4">{displayValue}</dd>
            </div>
        );
    };

    const formattedConditions = useMemo(() => {
        if (!formData.healthConditions || formData.healthConditions.length === 0) return [];
        const details = formData.healthConditionsDetails || {};
        return formData.healthConditions.map(c => {
            let detail = '';
            if (c === 'Diabetes' && details.diabetesType) detail = `: ${details.diabetesType}`;
            if (c === 'PCOS/PCOD' && details.pcosPhenotype) detail = `: ${details.pcosPhenotype}`;
            if (c === 'Thyroid Disorder' && details.thyroidDisorder) detail = `: ${details.thyroidDisorder}`;
            if (c === 'Fatty Liver Disease' && details.fattyLiverStage) detail = `: ${details.fattyLiverStage}`;
            if (c === 'High Blood Pressure (Hypertension)' && details.hypertensionSeverity) detail = `: ${details.hypertensionSeverity}`;
            if (c === 'Heart Disease' && details.heartDiseaseType) detail = `: ${details.heartDiseaseType}`;
            if (c === 'Chronic Kidney Disease (CKD)' && details.ckdStage) detail = `: ${details.ckdStage}`;
            if (c === 'Irritable Bowel Syndrome (IBS)' && details.ibsType) detail = `: ${details.ibsType}`;
            return `${c}${detail}`;
        });
    }, [formData.healthConditions, formData.healthConditionsDetails]);

    const formattedMedications = useMemo(() => {
        return (formData.medications || [])
            .map(id => {
                if (id.startsWith('unverified:')) {
                    return id.replace('unverified:', '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' (Unverified)';
                }
                const med = findMedicationById(id);
                return med?.brandNames[0] || med?.genericName;
            })
            .filter(Boolean) as string[];
    }, [formData.medications]);


    return (
        <div className="space-y-6">
            <dl className="space-y-1">
                <SummaryItem label="Name" value={formData.name} />
                <SummaryItem label="DoB" value={formData.dob} />
                <SummaryItem label="Gender" value={formData.gender} />
                <SummaryItem label="Location" value={formData.location ? `${formData.location.city}, ${formData.location.state}`: null} />
                <SummaryItem label="Height" value={formData.heightCm ? `${formData.heightCm} cm` : null} />
                <SummaryItem label="Weight" value={formData.currentWeightKg ? `${formData.currentWeightKg} kg` : null} />
                <SummaryItem label="Target Weight" value={formData.targetWeightKg ? `${formData.targetWeightKg} kg` : null} />
                <SummaryItem label="Diet" value={formData.dietaryPreferences} />
                <SummaryItem label="Allergies" value={formData.allergies} />
                <SummaryItem label="Intolerances" value={formData.intolerances} />
                <SummaryItem label="Conditions" value={formattedConditions} />
                <SummaryItem label="Other Conditions" value={formData.otherConditions} />
                <SummaryItem label="Medications" value={formattedMedications} />
                <SummaryItem label="Goals" value={formData.healthGoals} />
                <SummaryItem label="Meal Frequency" value={formData.mealFrequency} />
                <SummaryItem label="Cooking Skill" value={formData.cookingSkills} />
                <SummaryItem label="Water Intake" value={formData.waterIntakeLiters ? `${formData.waterIntakeLiters} L` : null} />
                <SummaryItem label="Life Stage" value={formData.lifeStage} />
                <SummaryItem label="Activity" value={formData.activityLevel} />
                <SummaryItem label="Stress Level" value={formData.stressLevel} />
                <SummaryItem label="Smoking" value={formData.smoking} />
                <SummaryItem label="Alcohol Intake" value={formData.alcohol} />
                <SummaryItem label="Sleep Hours" value={formData.sleepHours ? `${formData.sleepHours} hrs` : null} />
                <SummaryItem label="Sleep Data Type" value={formData.sleepTracking} />
                <SummaryItem label="Sleep Quality" value={formData.sleepQuality} />
            </dl>
            <div className="pt-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 bg-gray-800" />
                    <div>
                        <span className="text-sm">I agree to the use of my data for personalized nutrition insights.</span>
                         {showSubmitError && !agreed && <p className="text-xs text-red-400 mt-1">You must agree to the data usage terms to finish setup.</p>}
                    </div>
                </label>
            </div>
        </div>
    );
};


export default ProfileSetupScreen;