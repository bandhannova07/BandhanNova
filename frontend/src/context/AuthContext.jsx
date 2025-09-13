import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import Cookies from 'js-cookie';

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER: 'LOAD_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user,
        loading: false
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  // Load user from token
  const loadUser = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        // Set token in axios headers
        authService.setAuthToken(token);
        
        // Verify token and get user data
        const response = await authService.verifyToken();
        
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER,
          payload: {
            user: response.data.user,
            token: token
          }
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER,
          payload: { user: null, token: null }
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear invalid token
      Cookies.remove('token');
      authService.removeAuthToken();
      
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER,
        payload: { user: null, token: null }
      });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(credentials);
      const { user, token } = response.data;

      // Store token in cookie (7 days expiry)
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      // Set token in axios headers
      authService.setAuthToken(token);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authService.register(userData);
      const { user, token } = response.data;

      // Store token in cookie
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      // Set token in axios headers
      authService.setAuthToken(token);

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Google OAuth login
  const loginWithGoogle = async (googleToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.googleLogin(googleToken);
      const { user, token } = response.data;

      // Store token in cookie
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      // Set token in axios headers
      authService.setAuthToken(token);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from cookie
    Cookies.remove('token');
    
    // Remove token from axios headers
    authService.removeAuthToken();

    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data.user
      });

      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    clearError,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export with expected name for compatibility
export const useAuth = useAuthContext;

export default AuthContext;
