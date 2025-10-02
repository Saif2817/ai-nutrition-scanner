import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { validateDateOfBirth } from '../../utils/validation';
import { BackIcon, CheckIcon, UserIcon, CalendarIcon, LanguageIcon, GenderIcon, HeartIcon, LeafIcon, AlertTriangleIcon, TargetIcon, RunningIcon, BrainIcon, GlobeIcon, HeightIcon, ScaleIcon, ChevronRightIcon, LightbulbIcon, InfoIcon, ShareIcon, LogoutIcon, UsersIcon, FireIcon, BedIcon, WineIcon, ForkKnifeIcon, WaterDropIcon, ChefHatIcon, BriefcaseIcon, CameraIcon } from '../ui/Icons';
import { TagInput } from '../ui/TagInput';
import { Select, CheckboxGroup, RadioGroup, SearchableSelect } from '../ui/FormElements';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import { getAllStates, getCitiesForState, getLanguageRecommendations, getAllLanguages } from '../../data/languages';
import { useLocale } from '../../context/LocaleContext';


type SaveStatus = 'idle' | 'saving' | 'saved';
type Page = 'main' | 'edit' | 'how' | 'about';

const ProfileScreen: React.FC = () => {
    const { profile, setProfile, logout } = useAppContext();
    const { t } = useLocale();
    const [page, setPage] = useState<Page>('main');
    
    const handleShare = async () => {
        if (!profile?.id) return;
        const referralLink = `https://nutriscanai.com/download?ref=${profile.id}`;
        const shareText = `Hey! I've been using NutriScan AI to find healthier foods. It's super helpful. Check it out using my personal link: ${referralLink}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out NutriScan AI',
                    text: shareText,
                    url: referralLink,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            navigator.clipboard.writeText(shareText);
            alert('Referral link copied to clipboard!');
        }
    };

    const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
      <div className="flex items-center mb-4 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2 -mx-4 px-4">
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors mr-4"
          aria-label="Go back"
        >
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
      </div>
    );
    
    const ProfileMenuItem: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; hasShare?: boolean }> = ({ icon, title, onClick, hasShare = false }) => (
        <button onClick={onClick} className="w-full flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border dark:border-gray-700 shadow-sm">
            <div className="text-green-600 dark:text-green-400">{icon}</div>
            <span className="flex-grow text-left ml-4 font-semibold text-gray-700 dark:text-gray-200">{title}</span>
            {hasShare ? (
                <ShareIcon className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
            ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
            )}
        </button>
    );
    
    if (page === 'edit') {
        return <ProfileEditor onBack={() => setPage('main')} />;
    }

    if (page === 'how') {
        return (
            <div className="p-2">
                <PageHeader title={t('how_it_works_page.title')} onBack={() => setPage('main')} />
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <Section title={t('how_it_works_page.section1_title')}>
                        <p>{t('how_it_works_page.section1_p1')}</p>
                        <p>{t('how_it_works_page.section1_p2')}</p>
                        <p>{t('how_it_works_page.section1_p3')}</p>
                        <p>{t('how_it_works_page.section1_p4')}</p>
                    </Section>

                    <Section title={t('how_it_works_page.section2_title')}>
                         <p>{t('how_it_works_page.section2_p1')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><strong className="text-green-600 dark:text-green-400">{t('how_it_works_page.section2_li1_strong')}</strong>{t('how_it_works_page.section2_li1_text')}</li>
                            <li><strong className="text-yellow-500">{t('how_it_works_page.section2_li2_strong')}</strong>{t('how_it_works_page.section2_li2_text')}</li>
                            <li><strong className="text-red-500">{t('how_it_works_page.section2_li3_strong')}</strong>{t('how_it_works_page.section2_li3_text')}</li>
                        </ul>
                    </Section>
                    
                     <Section title={t('how_it_works_page.section3_title')}>
                        <p>{t('how_it_works_page.section3_p1')}</p>
                    </Section>
                </div>
            </div>
        );
    }
    
     if (page === 'about') {
        return (
            <div className="p-2">
                <PageHeader title={t('about_page.title')} onBack={() => setPage('main')} />
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                     <Section title={t('about_page.section1_title')}>
                        <p className="italic">{t('about_page.section1_p1')}</p>
                    </Section>
                    <Section title={t('about_page.section2_title')}>
                        <p>{t('about_page.section2_p1')}</p>
                    </Section>
                    <Section title={t('about_page.section3_title')}>
                        <p>{t('about_page.section3_p1')}</p>
                    </Section>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 space-y-6">
            <div className="flex items-center space-x-4 p-2">
                {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile?.name || t('profile_main.title')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email || profile?.phone}</p>
                </div>
            </div>

            <div className="space-y-3">
                 <ProfileMenuItem icon={<UserIcon className="w-6 h-6"/>} title={t('profile_main.edit_profile')} onClick={() => setPage('edit')} />
                 <ProfileMenuItem icon={<LightbulbIcon className="w-6 h-6"/>} title={t('profile_main.how_it_works')} onClick={() => setPage('how')} />
                 <ProfileMenuItem icon={<UsersIcon className="w-6 h-6"/>} title={t('profile_main.refer_friend')} onClick={handleShare} hasShare />
                 <ProfileMenuItem icon={<InfoIcon className="w-6 h-6"/>} title={t('profile_main.about')} onClick={() => setPage('about')} />
            </div>
             <div className="mt-8 pt-4">
                <button 
                    onClick={logout} 
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-lg hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
                >
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    {t('profile_main.logout')}
                </button>
            </div>
        </div>
    );
};


const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">{title}</h2>
        <div className="space-y-2 text-sm">
            {children}
        </div>
    </div>
);


const ProfileEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { profile, setProfile } = useAppContext();
    const { t } = useLocale();
    const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>(profile || {});
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [openSection, setOpenSection] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [allergyInput, setAllergyInput] = useState('');
    const [intoleranceInput, setIntoleranceInput] = useState('');
    const [medicationInput, setMedicationInput] = useState('');
    const [lifeEventInput, setLifeEventInput] = useState('');

    const [dobValidation, setDobValidation] = useState<{ messageKey: string; messageParams?: Record<string, any>; isValid: boolean; isSuccess: boolean; }>(() => {
        if (!profile?.dob) {
            return { messageKey: '', isValid: true, isSuccess: false };
        }
        const initialResult = validateDateOfBirth(profile.dob);
        return {
            ...initialResult,
            isSuccess: initialResult.isValid
        };
    });
    
    const [states, setStates] = useState<Array<{ value: string; label: string }>>([]);
    const [cities, setCities] = useState<Array<{ value: string; label: string }>>([]);

    const [minDOB, maxDOB] = (() => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 14);
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        return ['1935-01-01', formatDate(maxDate)];
    })();

    useEffect(() => {
        const allStates = getAllStates();
        setStates(allStates.map(s => ({ value: s, label: t(`locations.states.${s}`) || s })));
    }, [t]);
    
    useEffect(() => {
        const state = editedProfile.location?.state;
        if (state) {
            const stateCities = getCitiesForState(state);
            setCities(stateCities.map(c => ({ value: c, label: t(`locations.cities.${c}`) || c })));
        } else {
            setCities([]);
        }
    }, [editedProfile.location?.state, t]);
    
    const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        return (...args: Parameters<F>): void => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const autoSaveChanges = useCallback((newProfileData: Partial<UserProfile>) => {
        if (!profile) return;
        setSaveStatus('saving');
        setTimeout(() => { // Simulate API call
            const updatedProfile = { ...profile, ...newProfileData };
            setProfile(updatedProfile);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    }, [profile, setProfile]);

    const debouncedSave = useCallback(debounce(autoSaveChanges, 800), [autoSaveChanges]);

    const handleFieldChange = (field: keyof UserProfile, value: any) => {
        const newProfile = { ...editedProfile, [field]: value };
        setEditedProfile(newProfile);

        if (field === 'dob') {
            if (!value) {
                setDobValidation({ messageKey: '', isValid: true, isSuccess: false });
                debouncedSave(newProfile);
            } else {
                const validationResult = validateDateOfBirth(value);
                setDobValidation({ 
                    messageKey: validationResult.messageKey, 
                    messageParams: validationResult.messageParams,
                    isValid: validationResult.isValid,
                    isSuccess: validationResult.isValid
                });
                if (validationResult.isValid) debouncedSave(newProfile);
            }
        } else {
            debouncedSave(newProfile);
        }
    }
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            handleFieldChange('avatarUrl', dataUrl);
          };
          reader.readAsDataURL(file);
        }
    };
    
    const handleLocationChange = (part: 'state' | 'city', value: string) => {
        const newLocation = { ...(editedProfile.location || { state: '', city: '' }), [part]: value };
        if (part === 'state') {
            newLocation.city = '';
        }
        const newProfile = { ...editedProfile, location: newLocation };
        setEditedProfile(newProfile);
        debouncedSave(newProfile);
    };
    
    const CollapsibleSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
        <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <button onClick={() => setOpenSection(openSection === id ? null : id)} className="w-full p-4 text-left font-semibold flex justify-between items-center dark:text-gray-200">
                {title}
                <span className={`transform transition-transform text-gray-500 ${openSection === id ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {openSection === id && <div className="p-4 border-t dark:border-gray-600 space-y-6 bg-gray-50/50 dark:bg-black/20">{children}</div>}
        </div>
    );

    if (!profile) return <div>Loading profile...</div>;

    const dobMessage = dobValidation.messageKey ? t(dobValidation.messageKey, dobValidation.messageParams) : undefined;
    
    const genderOptions = [
        { value: 'Male', label: t('profile.basic_info.gender_options.male') },
        { value: 'Female', label: t('profile.basic_info.gender_options.female') },
        { value: 'Other', label: t('profile.basic_info.gender_options.other') },
        { value: 'Prefer not to say', label: t('profile.basic_info.gender_options.prefer_not_to_say') }
    ];

    const languageOptions = [
        { value: 'English', label: t('languages.English') },
        { value: 'Hindi', label: t('languages.Hindi') },
        { value: 'Tamil', label: t('languages.Tamil') },
        { value: 'Malayalam', label: t('languages.Malayalam') }
    ];

    const healthConditionOptions = [
        { value: 'Type 2 Diabetes', label: t('profile.health.condition_options.diabetes') },
        { value: 'High Blood Pressure', label: t('profile.health.condition_options.blood_pressure') },
        { value: 'CKD Stage 3', label: t('profile.health.condition_options.ckd') },
        { value: 'Heart Disease', label: t('profile.health.condition_options.heart_disease') },
        { value: 'PCOS', label: t('profile.health.condition_options.pcos') },
        { value: 'Obesity', label: t('profile.health.condition_options.obesity') }
    ];

    const dietPrefOptions = [
        { value: 'Vegetarian', label: t('profile.health.diet_pref_options.vegetarian') },
        { value: 'Vegan', label: t('profile.health.diet_pref_options.vegan') },
        { value: 'Low Sodium', label: t('profile.health.diet_pref_options.low_sodium') },
        { value: 'Keto', label: t('profile.health.diet_pref_options.keto') },
        { value: 'Paleo', label: t('profile.health.diet_pref_options.paleo') },
        { value: 'Halal', label: t('profile.health.diet_pref_options.halal') }
    ];

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
        <div className="p-2 space-y-6">
             <div className="flex items-center mb-4 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2 -mx-4 px-4">
                <button
                onClick={onBack}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors mr-4"
                aria-label="Go back"
                >
                <BackIcon className="w-6 h-6" />
                </button>
                <div className="flex-grow flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('profile.title')}</h1>
                    <div className="w-28 text-right h-5">
                        {saveStatus === 'saving' && <span className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center"><Spinner />{t('profile.saving')}</span>}
                        {saveStatus === 'saved' && <span className="text-sm text-green-600 dark:text-green-400 flex items-center"><CheckIcon className="w-4 h-4 mr-1"/>{t('profile.saved')}</span>}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                    />
                    {editedProfile.avatarUrl ? (
                        <img src={editedProfile.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-700" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                            <UserIcon className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors border-2 border-white dark:border-gray-800"
                        aria-label="Change avatar"
                    >
                        <CameraIcon className="w-4 h-4 text-white" />
                    </button>
                </div>
                <p className="text-xl font-bold text-gray-100">{editedProfile.name || 'Your Name'}</p>
            </div>

            <div className="space-y-4">
                <CollapsibleSection title={t('profile.basic_info.title')} id="basic">
                    <Input id="name" label={t('profile.basic_info.name')} type="text" value={editedProfile.name || ''} onChange={(e) => handleFieldChange('name', e.target.value)} icon={<UserIcon className="w-6 h-6" />} />
                    <Input id="dob" label={t('profile.basic_info.dob')} type="date" value={editedProfile.dob || ''} onChange={(e) => handleFieldChange('dob', e.target.value)} icon={<CalendarIcon className="w-6 h-6" />} error={!dobValidation.isValid ? dobMessage : undefined} success={dobValidation.isSuccess ? dobMessage : undefined} min={minDOB} max={maxDOB} />
                    <Select id="gender" label={t('profile.basic_info.gender')} value={editedProfile.gender || ''} onChange={e => handleFieldChange('gender', e.target.value)} icon={<GenderIcon className="w-6 h-6" />}>
                         {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </CollapsibleSection>

                <CollapsibleSection title={t('profile.region.title')} id="region">
                     <Select id="language" label={t('profile.region.language')} value={editedProfile.language || 'English'} onChange={e => handleFieldChange('language', e.target.value)} options={languageOptions} icon={<LanguageIcon className="w-6 h-6" />} />
                    <SearchableSelect
                        id="state"
                        label={t('profile.region.state')}
                        value={editedProfile.location?.state || ''}
                        onChange={(value) => handleLocationChange('state', value)}
                        options={states}
                        icon={<GlobeIcon className="w-6 h-6" />}
                        placeholder={t('profile.region.state_placeholder')}
                    />
                    <SearchableSelect
                        id="city"
                        label={t('profile.region.district_city')}
                        value={editedProfile.location?.city || ''}
                        onChange={(value) => handleLocationChange('city', value)}
                        options={cities}
                        disabled={!editedProfile.location?.state || cities.length === 0}
                        icon={<GlobeIcon className="w-6 h-6" />}
                        placeholder={t('profile.region.city_placeholder')}
                    />
                </CollapsibleSection>
                
                 <CollapsibleSection title={t('profile.biometrics.title')} id="biometrics">
                    <Input id="height" label={t('profile.biometrics.height')} type="number" value={String(editedProfile.heightCm || '')} onChange={(e) => handleFieldChange('heightCm', e.target.value ? parseInt(e.target.value) : undefined)} icon={<HeightIcon className="w-6 h-6" />} />
                    <Input id="currentWeight" label={t('profile.biometrics.current_weight')} type="number" value={String(editedProfile.currentWeightKg || '')} onChange={(e) => handleFieldChange('currentWeightKg', e.target.value ? parseFloat(e.target.value) : undefined)} icon={<ScaleIcon className="w-6 h-6" />} />
                    <Input id="targetWeight" label={t('profile.biometrics.target_weight')} type="number" value={String(editedProfile.targetWeightKg || '')} onChange={(e) => handleFieldChange('targetWeightKg', e.target.value ? parseFloat(e.target.value) : undefined)} icon={<TargetIcon className="w-6 h-6" />} />
                </CollapsibleSection>
                
                <CollapsibleSection title={t('profile.health.title')} id="health">
                    <CheckboxGroup label={t('profile.health.conditions')} options={healthConditionOptions} selected={editedProfile.healthConditions || []} onChange={v => handleFieldChange('healthConditions', v)} icon={<HeartIcon className="w-6 h-6" />} />
                    <CheckboxGroup label={t('profile.health.diet_prefs')} options={dietPrefOptions} selected={editedProfile.dietaryPreferences || []} onChange={v => handleFieldChange('dietaryPreferences', v)} icon={<LeafIcon className="w-6 h-6" />} />
                    <TagInput label={t('profile.health.allergies')} tags={editedProfile.allergies || []} setTags={(tags) => handleFieldChange('allergies', tags)} placeholder={t('profile.health.allergies_placeholder')} icon={<AlertTriangleIcon className="w-6 h-6" />} inputValue={allergyInput} onInputChange={setAllergyInput} />
                    <TagInput label={t('profile.health.intolerances')} tags={editedProfile.intolerances || []} setTags={(tags) => handleFieldChange('intolerances', tags)} placeholder={t('profile.health.intolerances_placeholder')} icon={<AlertTriangleIcon className="w-6 h-6" />} inputValue={intoleranceInput} onInputChange={setIntoleranceInput} />
                    <TagInput label={t('profile.health.medications')} tags={editedProfile.medications || []} setTags={(tags) => handleFieldChange('medications', tags)} placeholder={t('profile.health.medications_placeholder')} icon={<TargetIcon className="w-6 h-6" />} inputValue={medicationInput} onInputChange={setMedicationInput} />
                </CollapsibleSection>

                 <CollapsibleSection title={t('profile.eating_habits.title')} id="eating_habits">
                    <RadioGroup label={t('profile.eating_habits.meal_frequency')} options={mealFrequencyOptions} selected={editedProfile.mealFrequency || ''} onChange={v => handleFieldChange('mealFrequency', v as any)} icon={<ForkKnifeIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.eating_habits.cooking_skills')} options={cookingSkillsOptions} selected={editedProfile.cookingSkills || ''} onChange={v => handleFieldChange('cookingSkills', v as any)} icon={<ChefHatIcon className="w-6 h-6" />} />
                </CollapsibleSection>

                <CollapsibleSection title={t('profile.mind_body.title')} id="mind_body">
                    <Input id="waterIntake" label={t('profile.mind_body.water_intake')} type="number" value={String(editedProfile.waterIntakeLiters || '')} onChange={(e) => handleFieldChange('waterIntakeLiters', e.target.value ? parseFloat(e.target.value) : undefined)} icon={<WaterDropIcon className="w-6 h-6" />} />
                    <CheckboxGroup label={t('profile.mind_body.primary_beverages')} options={primaryBeveragesOptions} selected={editedProfile.primaryBeverages || []} onChange={v => handleFieldChange('primaryBeverages', v)} icon={<WineIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.mind_body.life_stage')} options={lifeStageOptions} selected={editedProfile.lifeStage || ''} onChange={v => handleFieldChange('lifeStage', v as any)} icon={<BriefcaseIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.mind_body.motivation')} options={motivationOptions} selected={editedProfile.motivation || ''} onChange={v => handleFieldChange('motivation', v as any)} icon={<TargetIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.mind_body.social_support')} options={socialSupportOptions} selected={editedProfile.socialSupport === true ? 'true' : editedProfile.socialSupport === false ? 'false' : ''} onChange={v => handleFieldChange('socialSupport', v === 'true' ? true : (v === 'false' ? false : null))} icon={<UsersIcon className="w-6 h-6" />} />
                    <TagInput label={t('profile.mind_body.life_events')} tags={editedProfile.lifeEvents || []} setTags={(tags) => handleFieldChange('lifeEvents', tags)} placeholder={t('profile.mind_body.life_events_placeholder')} icon={<CalendarIcon className="w-6 h-6" />} inputValue={lifeEventInput} onInputChange={setLifeEventInput} />
                </CollapsibleSection>

                <CollapsibleSection title={t('profile.lifestyle.title')} id="lifestyle">
                    <RadioGroup label={t('profile.lifestyle.activity')} options={activityOptions} selected={editedProfile.activityLevel || ''} onChange={v => handleFieldChange('activityLevel', v)} icon={<RunningIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.lifestyle.stress')} options={stressOptions} selected={editedProfile.stressLevel || ''} onChange={v => handleFieldChange('stressLevel', v)} icon={<BrainIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.lifestyle.smoking')} options={smokingOptions} selected={editedProfile.smoking === true ? 'true' : editedProfile.smoking === false ? 'false' : ''} onChange={v => handleFieldChange('smoking', v === 'true' ? true : (v === 'false' ? false : null))} icon={<FireIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.lifestyle.alcohol')} options={alcoholOptions} selected={editedProfile.alcohol || ''} onChange={v => handleFieldChange('alcohol', v as any)} icon={<WineIcon className="w-6 h-6" />} />
                    <Input id="sleepHours" label={t('profile.lifestyle.sleep')} type="number" value={String(editedProfile.sleepHours || '')} onChange={(e) => handleFieldChange('sleepHours', e.target.value ? parseInt(e.target.value, 10) : 8)} icon={<BedIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.lifestyle.sleep_tracking')} options={sleepTrackingOptions} selected={editedProfile.sleepTracking || ''} onChange={v => handleFieldChange('sleepTracking', v as any)} icon={<InfoIcon className="w-6 h-6" />} />
                    <RadioGroup label={t('profile.lifestyle.sleep_quality')} options={sleepQualityOptions} selected={editedProfile.sleepQuality || ''} onChange={v => handleFieldChange('sleepQuality', v as any)} icon={<InfoIcon className="w-6 h-6" />} />
                </CollapsibleSection>
            </div>
        </div>
    );
}

export default ProfileScreen;