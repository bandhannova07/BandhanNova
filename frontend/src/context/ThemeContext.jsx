import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  theme: 'light', // 'light', 'dark', 'system'
  isDark: false,
  systemPreference: 'light'
};

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_SYSTEM_PREFERENCE: 'SET_SYSTEM_PREFERENCE',
  TOGGLE_THEME: 'TOGGLE_THEME'
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      const newTheme = action.payload;
      let isDark = false;
      
      if (newTheme === 'dark') {
        isDark = true;
      } else if (newTheme === 'system') {
        isDark = state.systemPreference === 'dark';
      }
      
      return {
        ...state,
        theme: newTheme,
        isDark
      };

    case THEME_ACTIONS.SET_SYSTEM_PREFERENCE:
      const systemPref = action.payload;
      return {
        ...state,
        systemPreference: systemPref,
        isDark: state.theme === 'system' ? systemPref === 'dark' : state.isDark
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const toggledTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: toggledTheme,
        isDark: toggledTheme === 'dark'
      };

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('bandhannova-theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_SYSTEM_PREFERENCE,
        payload: e.matches ? 'dark' : 'light'
      });
    };

    // Set initial system preference
    dispatch({
      type: THEME_ACTIONS.SET_SYSTEM_PREFERENCE,
      payload: mediaQuery.matches ? 'dark' : 'light'
    });

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', state.isDark ? '#0f172a' : '#0066ff');
    }
  }, [state.isDark]);

  // Set theme function
  const setTheme = (theme) => {
    // Validate theme
    if (!['light', 'dark', 'system'].includes(theme)) {
      theme = 'light';
    }

    dispatch({
      type: THEME_ACTIONS.SET_THEME,
      payload: theme
    });

    // Save to localStorage
    localStorage.setItem('bandhannova-theme', theme);
  };

  // Toggle theme function
  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
    
    // Save to localStorage
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('bandhannova-theme', newTheme);
  };

  // Get theme display name
  const getThemeDisplayName = (theme) => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };

  // Get available themes
  const availableThemes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ];

  // Context value
  const value = {
    theme: state.theme,
    isDark: state.isDark,
    systemPreference: state.systemPreference,
    setTheme,
    toggleTheme,
    getThemeDisplayName,
    availableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Export with expected name for compatibility
export const useTheme = useThemeContext;

export default ThemeContext;
