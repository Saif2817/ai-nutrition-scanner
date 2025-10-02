import { UserProfile } from '../types';

/**
 * Calculates the age based on a birth date string (YYYY-MM-DD).
 * @param birthDateString The date of birth.
 * @returns The calculated age in years.
 */
export const calculateAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// FIX: Add a simple translation map and formatter to provide an English message
// This avoids needing the i18n context in components rendered before it's available.
const messages: { [key: string]: string } = {
    "profile.validation.dob_required": "Date of birth is required.",
    "profile.validation.dob_invalid": "Please enter a valid date.",
    "profile.validation.dob_future": "Date of birth cannot be in the future.",
    "profile.validation.dob_too_old": "Please enter a valid date of birth.",
    "profile.validation.dob_too_young": "You must be at least {minAge} years old to use the app.",
    "profile.basic_info.age_message": "You are {age} years old."
};

const formatMessage = (key: string, params?: Record<string, any>): string => {
    let message = messages[key] || key;
    if (params) {
        for (const pKey in params) {
            message = message.replace(`{${pKey}}`, params[pKey]);
        }
    }
    return message;
};

/**
 * Validates the date of birth string.
 * @param dob The date of birth string to validate.
 * @returns An object containing the validation status, calculated age, a localization message key, and optional parameters for the message.
 */
// FIX: Add a `message` property to the return type for use in components without i18n context.
export const validateDateOfBirth = (dob: string): { isValid: boolean; age: number | null; messageKey: string; messageParams?: Record<string, any>; message: string; } => {
    if (!dob) {
        const messageKey = "profile.validation.dob_required";
        return { isValid: false, age: null, messageKey, message: formatMessage(messageKey) };
    }

    const selectedDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    // Check if the date is a valid date object
    if (isNaN(selectedDate.getTime())) {
        const messageKey = "profile.validation.dob_invalid";
        return { isValid: false, age: null, messageKey, message: formatMessage(messageKey) };
    }

    if (selectedDate > today) {
        const messageKey = "profile.validation.dob_future";
        return { isValid: false, age: null, messageKey, message: formatMessage(messageKey) };
    }
    
    if (selectedDate < new Date('1935-01-01')) {
        const messageKey = "profile.validation.dob_too_old";
        return { isValid: false, age: null, messageKey, message: formatMessage(messageKey) };
    }

    const age = calculateAge(dob);
    const minimumAge = 14;

    if (age < minimumAge) {
        const messageKey = "profile.validation.dob_too_young";
        const messageParams = { minAge: minimumAge };
        return { isValid: false, age, messageKey, messageParams, message: formatMessage(messageKey, messageParams) };
    }

    const messageKey = "profile.basic_info.age_message";
    const messageParams = { age: age };
    return { isValid: true, age, messageKey, messageParams, message: formatMessage(messageKey, messageParams) };
};

export const calculateBmi = (weightKg?: number, heightCm?: number): { bmi: number | null, category: string } => {
  if (!weightKg || !heightCm || heightCm < 100) {
    return { bmi: null, category: 'N/A' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  
  if (bmi < 18.5) return { bmi, category: 'Underweight' };
  if (bmi < 25) return { bmi, category: 'Healthy Weight' };
  if (bmi < 30) return { bmi, category: 'Overweight' };
  return { bmi, category: 'Obesity' };
};

export const getHealthyWeightRange = (heightCm?: number): { lower: number, upper: number } | null => {
    if (!heightCm || heightCm < 100) return null;
    const heightM = heightCm / 100;
    const lower = Math.round(18.5 * (heightM * heightM));
    const upper = Math.round(24.9 * (heightM * heightM));
    return { lower, upper };
}

export const getOptimalHealthyWeight = (heightCm?: number): number | null => {
    if (!heightCm || heightCm < 100) return null;
    const heightM = heightCm / 100;
    // Using the midpoint of the healthy BMI range (18.5 - 24.9) -> ~21.7
    const optimalBmi = 21.7;
    const optimalWeight = Math.round(optimalBmi * (heightM * heightM));
    return optimalWeight;
};

export const cmToFtIn = (cm: number): string => {
    if (!cm) return `0' 0"`;
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    if (inches === 12) {
      return `${feet + 1}' 0"`;
    }
    return `${feet}' ${inches}"`;
};

export const kgToLbs = (kg: number): number => {
    if (!kg) return 0;
    return parseFloat((kg * 2.20462).toFixed(1));
};

export const lbsToKg = (lbs: number): number => {
    if (!lbs) return 0;
    return parseFloat((lbs / 2.20462).toFixed(1));
};
