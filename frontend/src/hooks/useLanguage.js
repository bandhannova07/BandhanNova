import { useLanguageContext } from '../context/LanguageContext';

/**
 * Custom hook for language management
 * Provides easy access to language state and methods
 */
export const useLanguage = () => {
  const context = useLanguageContext();
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return {
    // Language state
    currentLanguage: context.currentLanguage,
    isRTL: context.isRTL,
    loading: context.loading,
    error: context.error,
    availableLanguages: context.availableLanguages,
    
    // Language methods
    setLanguage: context.setLanguage,
    translate: context.translate,
    translateContent: context.translateContent,
    getLanguageInfo: context.getLanguageInfo,
    getGroupedLanguages: context.getGroupedLanguages,
    clearError: context.clearError,
    
    // Aliases for easier use
    t: context.t,
    lang: context.lang,
    
    // Helper methods
    isEnglish: () => context.currentLanguage === 'en',
    isIndianLanguage: () => ['hi', 'bn', 'ta', 'te', 'mr', 'pa', 'or', 'bh', 'ur', 'ne'].includes(context.currentLanguage),
    isGlobalLanguage: () => ['es', 'fr', 'de', 'zh', 'ja'].includes(context.currentLanguage),
    
    // Get current language display info
    getCurrentLanguageInfo: () => context.getLanguageInfo(),
    getCurrentLanguageName: () => context.getLanguageInfo().name,
    getCurrentLanguageNativeName: () => context.getLanguageInfo().nativeName,
    getCurrentLanguageFlag: () => context.getLanguageInfo().flag,
    
    // Direction helpers
    isLeftToRight: () => !context.isRTL,
    isRightToLeft: () => context.isRTL,
    getDirection: () => context.isRTL ? 'rtl' : 'ltr',
    
    // CSS class helpers
    getDirectionClass: () => context.isRTL ? 'rtl' : 'ltr',
    getTextAlignClass: () => context.isRTL ? 'text-right' : 'text-left',
    getFlexDirectionClass: () => context.isRTL ? 'flex-row-reverse' : 'flex-row'
  };
};
