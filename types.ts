export enum View {
  Home = 'Home',
  Scan = 'Scan',
  Analysis = 'Analysis',
  History = 'History',
  Profile = 'Profile',
  Chat = 'Chat',
  Auth = 'Auth',
  ProfileSetup = 'ProfileSetup',
  Onboarding = 'Onboarding',
  LanguageSelection = 'LanguageSelection',
  Shopping = 'Shopping',
  Dietician = 'Dietician',
}

export enum NutrientRiskLevel {
    Low = 'LOW',
    Medium = 'MEDIUM',
    High = 'HIGH',
    Info = 'INFO'
}

export enum InteractionSeverity {
    Low = 'Low',
    Moderate = 'Moderate',
    High = 'High'
}

// Interfaces
export interface NutrientFact {
    name: string;
    value: string;
    dailyValue?: string;
    riskLevel?: NutrientRiskLevel;
}

export interface NutritionData {
    productName: string;
    nutritionFacts: NutrientFact[];
    ingredients: string[];
    allergens: string[];
}

export interface DietaryCompliance {
    preference: string;
    compliant: boolean;
    reason: string;
}

export interface GPTAnalysis {
    summary: string;
    positivePoints: string[];
    negativePoints: string[];
    dietaryCompliance: DietaryCompliance[];
    drugNutrientInteractions: {
        medication: string;
        interactingIngredient: string;
        severity: InteractionSeverity;
        explanation: string;
    }[];
    recallInfo: {
        isRecalled: boolean;
        reason?: string;
        officialSource?: string;
    };
    glycemicImpact?: {
        level: 'Low' | 'Medium' | 'High';
        reasoning: string;
    };
    contextualNotes?: {
        title: string;
        note: string;
    }[];
    mealPairingSuggestions?: string[];
    timeOfDayRecommendation?: string;
    smarterSwaps?: string[];
    personalizedScore?: {
        score: number;
        rationale: string;
    };
    portioningGuidance?: {
        title: string;
        guidance: string;
    };
    flaggedIngredients?: {
        ingredient: string;
        flag: 'positive' | 'negative' | 'neutral';
        reason: string;
    }[];
}

export interface PlateFoodItem {
    name: string;
    quantity: string;
    calories: number;
    confidenceScore: number;
    macros: {
        proteinGrams: number;
        carbohydratesGrams: number;
        fatGrams: number;
    };
}

export interface PlateAnalysis {
    summary: string;
    totalCalories: number;
    totalMacros: {
        proteinGrams: number;
        carbohydratesGrams: number;
        fatGrams: number;
    };
    foodItems: PlateFoodItem[];
    personalizedFeedback: {
        positivePoints: string[];
        negativePoints: string[];
        portioningGuidance: string;
        healthierSwaps: string[];
        dietaryCompliance: DietaryCompliance[];
    };
    mealScore: number;
    scoreRationale: string;
    scoreColor: 'red' | 'yellow' | 'green';
    mealCategory: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Unknown';
}


export type ScanResult = {
  id: string;
  date: string;
  imageUrl: string;
} & ({
  scanType: 'label';
  nutritionData: NutritionData;
  gptAnalysis: GPTAnalysis;
  plateAnalysis?: never;
} | {
  scanType: 'plate';
  plateAnalysis: PlateAnalysis;
  nutritionData?: never;
  gptAnalysis?: never;
});

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

export interface Medication {
    id: string;
    genericName: string;
    brandNames: string[];
    formulation: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Cream';
    activeIngredients: string[];
    commonDosages: string[];
    associatedConditions: string[];
    regionCode: 'IN';
    notes?: string;
}

export interface UserProfile {
    id: string;
    phone: string;
    email?: string;
    name: string;
    avatarUrl: string;
    dob: string;
    gender: string;
    language: string;
    heightCm?: number;
    currentWeightKg?: number;
    targetWeightKg?: number;
    location: {
        state: string;
        city: string;
    };
    dietaryPreferences: string[];
    allergies: string[];
    intolerances: string[];
    healthConditions: string[];
    medications: string[];
    healthGoals: string[];
    isProfileComplete: boolean;

    // Advanced fields
    healthConditionsDetails?: {
        diabetesType?: 'Type 1' | 'Type 2' | 'Gestational';
        pcosPhenotype?: 'NIH' | 'Rotterdam' | 'Androgen Excess';
        thyroidDisorder?: 'Hypothyroidism' | 'Hyperothyroidism';
        fattyLiverStage?: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Cirrhosis';
        hypertensionSeverity?: 'Pre-hypertension' | 'Stage 1' | 'Stage 2';
        heartDiseaseType?: 'Previous MI' | 'Congestive Heart Failure (CHF)' | 'Angina';
        highCholesterolFocus?: 'High LDL' | 'Low HDL' | 'High Triglycerides';
        ckdStage?: 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Stage 5/Dialysis';
        ibsType?: 'IBS-D' | 'IBS-C' | 'IBS-M';
    };
    otherConditions?: string[];

    activityLevel: string;
    smoking: boolean | null;
    alcohol: string;
    sleepHours: number;
    sleepTracking: string;
    sleepQuality: string;
    stressLevel: string;

    mealFrequency: string;
    mealTiming: string;
    mainMeal: string;
    cookingSkills: string;
    cookingTime: string;

    waterIntakeLiters?: number;
    primaryBeverages?: string[];
    socialEatingFrequency: string;
    emotionalEating: string;
    motivation: string;
    socialSupport: boolean | null;
    mindfulEating: boolean | null;
    lifeStage: string;
    lifeEvents?: string[];

    neckCircumferenceCm?: number;
    waistCircumferenceCm?: number;
    hipCircumferenceCm?: number;
    culturalCuisinePref: string;
    preferredMealFrequency?: number;
    dislikedFoods?: string[];
    currentSupplements?: string[];
    labValues?: string;
}

export interface ShoppingListItem {
    id: string;
    name: string;
    quantity: string;
    category: string;
    purchased: boolean;
    price?: number;
}

export interface StorePrice {
    storeName: string;
    price: number;
    inStock: boolean;
}

export interface ShoppingSuggestion {
    alternative: string;
    reason: string;
}

export interface MealIngredient {
    name: string;
    weightGrams: number;
    notes?: {
        type: 'alert' | 'info' | 'interaction';
        text: string;
    }[];
}

export interface MealItem {
    name: string;
    ingredients: MealIngredient[];
    macros: {
        calories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    };
    recipe: string;
    glycemicInfo: {
        index?: number;
        load: number;
        explanation: string;
    };
}

export interface DailyPlan {
    day: string;
    meals: Record<string, MealItem>;
    dailyTotals: {
        calories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    };
}

export interface NutritionalJustification {
    parameter: string;
    target: string;
    planAchieves: string;
    justification: string;
}

export interface ConditionAdjustment {
    condition: string;
    adjustment: string;
    conflictFlag: boolean;
}

export interface MealPlan {
    id: string;
    startDate: string;
    planSummary: string;
    dailyPlans: DailyPlan[];
    nutritionalJustificationTable: NutritionalJustification[];
    conditionSpecificAdjustments: ConditionAdjustment[];
}

export interface MealSwapSuggestion {
    swapName: string;
    recalculatedMeal: MealItem;
}