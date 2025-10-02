import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';

// Define the shape of the context
interface LocaleContextType {
  language: string;
  // FIX: Update t function to accept an optional params object for interpolation.
  t: (key: string, params?: Record<string, any>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// A simple in-memory cache for loaded translation files
const translationsCache: { [key: string]: any } = {};

// Helper function to get nested values from a translation object
// FIX: Update getNestedTranslation to handle interpolation.
const getNestedTranslation = (translations: any, key: string, params?: Record<string, any>): string => {
  // If translations haven't loaded yet, return the key itself as a fallback
  if (!translations) return key;
  let value = key.split('.').reduce((obj, k) => obj && obj[k], translations);
  
  if (value) {
    if (params) {
      for (const pKey in params) {
        value = value.replace(`{${pKey}}`, params[pKey]);
      }
    }
    return value;
  }

  // If a language key is missing, fallback to the language name itself
  if (key.startsWith('languages.')) {
    return key.split('.')[1];
  }
  
  return key;
};

export const LocaleProvider: React.FC<{ children: ReactNode; language: string }> = ({ children, language }) => {
  const [currentTranslations, setCurrentTranslations] = useState<any | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      const langKey = language || 'English';
      const langCodeMap: { [key: string]: string } = {
          'English': 'en',
          'Hindi': 'hi',
          'Tamil': 'ta',
          'Malayalam': 'ml',
      };
      const langCode = langCodeMap[langKey] || 'en';

      // Use cached version if available
      if (translationsCache[langCode]) {
        setCurrentTranslations(translationsCache[langCode]);
        return;
      }
      
      try {
        const response = await fetch(`/i18n/locales/${langCode}.json`);
        if (!response.ok) {
            throw new Error(`Network response was not ok for ${langCode}.json`);
        }
        const data = await response.json();
        translationsCache[langCode] = data; // Cache the newly fetched data
        setCurrentTranslations(data);
      } catch (error) {
        console.error(`Failed to load translations for ${langCode}:`, error);
        // Attempt to fallback to English if the primary language fails
        try {
            if (!translationsCache['en']) {
                const enResponse = await fetch('/i18n/locales/en.json');
                const enData = await enResponse.json();
                translationsCache['en'] = enData;
                setCurrentTranslations(enData);
            } else {
                setCurrentTranslations(translationsCache['en']);
            }
        } catch (fallbackError) {
             console.error(`Failed to load fallback English translations:`, fallbackError);
             setCurrentTranslations({}); // Set to empty object to prevent errors
        }
      }
    };

    loadTranslations();
    
    // Set text direction to default LTR
    document.documentElement.dir = 'ltr';

  }, [language]);

  // useCallback ensures the 't' function reference is stable unless translations change
  // FIX: Pass params to getNestedTranslation.
  const t = useCallback((key: string, params?: Record<string, any>): string => {
    return getNestedTranslation(currentTranslations, key, params);
  }, [currentTranslations]);

  const value = useMemo(() => ({
    language,
    t,
  }), [language, t]);
  
  // Render children immediately. They will show keys until translations load, then re-render.
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
