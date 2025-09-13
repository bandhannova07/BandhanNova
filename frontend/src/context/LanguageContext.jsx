import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { translationService } from '../services/translationService';

// Supported languages configuration
const SUPPORTED_LANGUAGES = {
  // Default
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  
  // Indian Languages (10)
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', rtl: false },
  or: { name: 'Oriya', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', rtl: false },
  bh: { name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', rtl: false },
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  ne: { name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', rtl: false },
  
  // Global Languages (5)
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false }
};

// Initial state
const initialState = {
  currentLanguage: 'en',
  isRTL: false,
  translations: {},
  loading: false,
  error: null,
  availableLanguages: SUPPORTED_LANGUAGES
};

// Action types
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_TRANSLATIONS: 'SET_TRANSLATIONS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Language reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      const language = action.payload;
      const languageConfig = SUPPORTED_LANGUAGES[language];
      
      return {
        ...state,
        currentLanguage: language,
        isRTL: languageConfig?.rtl || false,
        error: null
      };

    case LANGUAGE_ACTIONS.SET_TRANSLATIONS:
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.payload.language]: action.payload.translations
        },
        loading: false,
        error: null
      };

    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case LANGUAGE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case LANGUAGE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bandhannova-language') || 'en';
    if (SUPPORTED_LANGUAGES[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Update document language and direction
  useEffect(() => {
    document.documentElement.lang = state.currentLanguage;
    document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
  }, [state.currentLanguage, state.isRTL]);

  // Set language function
  const setLanguage = async (languageCode) => {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.error(`Unsupported language: ${languageCode}`);
      return;
    }

    dispatch({
      type: LANGUAGE_ACTIONS.SET_LANGUAGE,
      payload: languageCode
    });

    // Save to localStorage
    localStorage.setItem('bandhannova-language', languageCode);

    // Load translations if not English
    if (languageCode !== 'en') {
      await loadTranslations(languageCode);
    }
  };

  // Load translations for a language
  const loadTranslations = async (languageCode) => {
    // Skip if translations already loaded
    if (state.translations[languageCode]) {
      return;
    }

    try {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });

      // Try to load from cache first
      const cachedTranslations = localStorage.getItem(`bandhannova-translations-${languageCode}`);
      if (cachedTranslations) {
        const translations = JSON.parse(cachedTranslations);
        dispatch({
          type: LANGUAGE_ACTIONS.SET_TRANSLATIONS,
          payload: { language: languageCode, translations }
        });
        return;
      }

      // Load from API if not cached
      const translations = await translationService.getTranslations(languageCode);
      
      dispatch({
        type: LANGUAGE_ACTIONS.SET_TRANSLATIONS,
        payload: { language: languageCode, translations }
      });

      // Cache translations
      localStorage.setItem(
        `bandhannova-translations-${languageCode}`,
        JSON.stringify(translations)
      );

    } catch (error) {
      console.error('Error loading translations:', error);
      dispatch({
        type: LANGUAGE_ACTIONS.SET_ERROR,
        payload: 'Failed to load translations'
      });
    }
  };

  // Translate text function
  const translate = (key, defaultText = '', variables = {}) => {
    // Return default text for English
    if (state.currentLanguage === 'en') {
      return interpolateVariables(defaultText, variables);
    }

    // Get translation from cache
    const translations = state.translations[state.currentLanguage];
    if (!translations || !translations[key]) {
      return interpolateVariables(defaultText, variables);
    }

    return interpolateVariables(translations[key], variables);
  };

  // Interpolate variables in text
  const interpolateVariables = (text, variables) => {
    if (!variables || Object.keys(variables).length === 0) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  };

  // Translate content using Google Translate API
  const translateContent = async (text, targetLanguage = state.currentLanguage) => {
    if (targetLanguage === 'en' || !text) {
      return text;
    }

    try {
      const translatedText = await translationService.translateText(text, targetLanguage);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  // Get language info
  const getLanguageInfo = (languageCode = state.currentLanguage) => {
    return SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES.en;
  };

  // Get grouped languages for UI
  const getGroupedLanguages = () => {
    const indian = [];
    const global = [];
    const english = [];

    Object.entries(SUPPORTED_LANGUAGES).forEach(([code, info]) => {
      if (code === 'en') {
        english.push({ code, ...info });
      } else if (['hi', 'bn', 'ta', 'te', 'mr', 'pa', 'or', 'bh', 'ur', 'ne'].includes(code)) {
        indian.push({ code, ...info });
      } else {
        global.push({ code, ...info });
      }
    });

    return { english, indian, global };
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: LANGUAGE_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    currentLanguage: state.currentLanguage,
    isRTL: state.isRTL,
    loading: state.loading,
    error: state.error,
    availableLanguages: state.availableLanguages,
    setLanguage,
    translate,
    translateContent,
    getLanguageInfo,
    getGroupedLanguages,
    clearError,
    // Alias for easier use
    t: translate,
    lang: state.currentLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

// Export with expected name for compatibility
export const useLanguage = useLanguageContext;

export default LanguageContext;
