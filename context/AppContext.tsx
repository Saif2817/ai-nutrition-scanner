import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { View, UserProfile, ScanResult, ChatMessage, ShoppingListItem } from '../types';

// This is a mock user profile for a newly signed-up user.
// In a real app, this would be created on the backend after signup.
const createNewUserProfile = (phone: string, email?: string): UserProfile => ({
    id: new Date().toISOString(),
    phone,
    email,
    name: "",
    avatarUrl: "",
    dob: "",
    gender: "",
    language: "English",
    heightCm: undefined,
    currentWeightKg: undefined,
    targetWeightKg: undefined,
    location: { state: "", city: "" },
    dietaryPreferences: [],
    allergies: [],
    intolerances: [],
    healthConditions: [],
    medications: [],
    healthGoals: [],
    healthConditionsDetails: {},
    otherConditions: [],
    activityLevel: "",
    smoking: null,
    alcohol: "",
    sleepHours: 8,
    sleepTracking: '',
    sleepQuality: '',
    stressLevel: "",
    mealFrequency: "",
    mealTiming: "",
    mainMeal: "",
    cookingSkills: "",
    cookingTime: "",
    waterIntakeLiters: undefined,
    primaryBeverages: [],
    socialEatingFrequency: "",
    emotionalEating: "",
    motivation: "",
    socialSupport: null,
    mindfulEating: null,
    lifeStage: "",
    lifeEvents: [],
    // New advanced questionnaire fields
    neckCircumferenceCm: undefined,
    waistCircumferenceCm: undefined,
    hipCircumferenceCm: undefined,
    culturalCuisinePref: '',
    preferredMealFrequency: undefined,
    dislikedFoods: [],
    currentSupplements: [],
    labValues: '',
    isProfileComplete: false,
});


interface AppContextType {
  view: View;
  setView: (view: View) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  isAuthenticated: boolean;
  login: (phone: string, email?: string, isNewUser?: boolean) => void;
  logout: () => void;
  currentAnalysis: ScanResult | null;
  setCurrentAnalysis: (analysis: ScanResult | null) => void;
  scanHistory: ScanResult[];
  setScanHistory: (history: ScanResult[]) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  hasSelectedLanguage: boolean;
  selectLanguage: (language: string) => void;
  scanMode: 'label' | 'plate';
  setScanMode: (mode: 'label' | 'plate') => void;
  chatContext: ScanResult | null;
  setChatContext: (context: ScanResult | null) => void;
  shoppingList: ShoppingListItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingListItem[]>>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>(View.Home);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [scanMode, setScanMode] = useState<'label' | 'plate'>('label');
  const [chatContext, setChatContext] = useState<ScanResult | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);


  useEffect(() => {
    // Check local storage on initial load
    const onboardingCompleted = localStorage.getItem('hasCompletedOnboarding') === 'true';
    if (onboardingCompleted) {
      setHasCompletedOnboarding(true);
    }
    const languageSelected = localStorage.getItem('hasSelectedLanguage') === 'true';
    if (languageSelected) {
        setHasSelectedLanguage(true);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setHasCompletedOnboarding(true);
  }, []);

  const selectLanguage = useCallback((language: string) => {
    setProfile(prev => {
        if (!prev) return null;
        return { ...prev, language };
    });
    localStorage.setItem('hasSelectedLanguage', 'true');
    setHasSelectedLanguage(true);
  }, []);

  const login = useCallback((phone: string, email?: string, isNewUser: boolean = false) => {
    // In a real app, this logic would be more sophisticated.
    // A new user would have a new profile created on the backend.
    // An existing user would have their profile data fetched.
    
    if (isNewUser) {
        // This is a new user signing up.
        setProfile(createNewUserProfile(phone, email));
        setHasCompletedOnboarding(false);
        setHasSelectedLanguage(false);
        localStorage.setItem('hasCompletedOnboarding', 'false');
        localStorage.removeItem('hasSelectedLanguage');
    } else {
        // This is an existing user logging in.
        const existingProfile: UserProfile = {
            ...createNewUserProfile(phone, email),
            name: "Alex Doe", 
            avatarUrl: "",
            dob: "1995-05-15",
            gender: 'Male',
            location: { state: "Delhi", city: "New Delhi" },
            isProfileComplete: true,
            healthConditions: ['Diabetes'],
            healthConditionsDetails: { diabetesType: 'Type 2' },
            // Add new fields for existing user as well
            neckCircumferenceCm: 38,
            waistCircumferenceCm: 90,
            culturalCuisinePref: 'North Indian',
            preferredMealFrequency: 3,
            dislikedFoods: ['Okra'],
            currentSupplements: ['Vitamin D3'],
            labValues: 'HbA1c: 5.8%',
        };
        setProfile(existingProfile);
        setHasCompletedOnboarding(true);
        setHasSelectedLanguage(true);
        localStorage.setItem('hasCompletedOnboarding', 'true');
        localStorage.setItem('hasSelectedLanguage', 'true');
    }
    
    setIsAuthenticated(true);
}, []);


  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
    setScanHistory([]);
    setChatHistory([]);
    setCurrentAnalysis(null);
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('hasSelectedLanguage');
    setHasCompletedOnboarding(false);
    setHasSelectedLanguage(false);
  }, []);


  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
  }, []);

  const value = {
    view,
    setView,
    profile,
    setProfile,
    isAuthenticated,
    login,
    logout,
    currentAnalysis,
    setCurrentAnalysis,
    scanHistory,
    setScanHistory,
    chatHistory,
    setChatHistory,
    addChatMessage,
    hasCompletedOnboarding,
    completeOnboarding,
    hasSelectedLanguage,
    selectLanguage,
    scanMode,
    setScanMode,
    chatContext,
    setChatContext,
    shoppingList,
    setShoppingList,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};