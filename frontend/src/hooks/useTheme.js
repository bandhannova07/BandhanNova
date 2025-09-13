import { useThemeContext } from '../context/ThemeContext';

/**
 * Custom hook for theme management
 * Provides easy access to theme state and methods
 */
export const useTheme = () => {
  const context = useThemeContext();
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return {
    // Theme state
    theme: context.theme,
    isDark: context.isDark,
    systemPreference: context.systemPreference,
    
    // Theme methods
    setTheme: context.setTheme,
    toggleTheme: context.toggleTheme,
    getThemeDisplayName: context.getThemeDisplayName,
    availableThemes: context.availableThemes,
    
    // Helper methods
    isLight: () => !context.isDark,
    isDarkMode: () => context.isDark,
    isSystemTheme: () => context.theme === 'system',
    getThemeIcon: () => {
      switch (context.theme) {
        case 'light': return '☀️';
        case 'dark': return '🌙';
        case 'system': return '💻';
        default: return '☀️';
      }
    },
    
    // CSS class helpers
    getThemeClass: () => context.isDark ? 'dark' : 'light',
    getBgClass: () => context.isDark ? 'bg-slate-900' : 'bg-white',
    getTextClass: () => context.isDark ? 'text-white' : 'text-gray-900',
    getCardClass: () => context.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
  };
};
