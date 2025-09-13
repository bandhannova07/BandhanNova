import axios from 'axios';
import Cookies from 'js-cookie';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    config.headers['X-Request-Time'] = Date.now();
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          Cookies.remove('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - Show access denied message
          console.error('Access denied:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 429:
          // Rate limit exceeded
          console.error('Rate limit exceeded. Please try again later.');
          break;
          
        case 500:
          // Server error
          console.error('Server error. Please try again later.');
          break;
          
        default:
          console.error('API Error:', data.message || 'An unexpected error occurred');
      }
      
      // Enhance error object with user-friendly message
      error.userMessage = data.message || getDefaultErrorMessage(status);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      error.userMessage = 'Network error. Please check your internet connection.';
    } else {
      // Other error
      console.error('Error:', error.message);
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

// Get default error message based on status code
const getDefaultErrorMessage = (status) => {
  switch (status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Please log in to continue.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 429: return 'Too many requests. Please try again later.';
    case 500: return 'Server error. Please try again later.';
    default: return 'An unexpected error occurred. Please try again.';
  }
};

// API helper methods
export const apiHelpers = {
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  // Remove auth token
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Upload file with progress
  uploadFile: (url, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  // Download file
  downloadFile: (url, filename) => {
    return api.get(url, {
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  },
  
  // Get with cache control
  getWithCache: (url, cacheTime = 5 * 60 * 1000) => { // 5 minutes default
    const cacheKey = `api_cache_${url}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTime) {
        return Promise.resolve({ data });
      }
    }
    
    return api.get(url).then((response) => {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
      return response;
    });
  },
  
  // Clear cache
  clearCache: (pattern = null) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('api_cache_')) {
        if (!pattern || key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    });
  }
};

// Export configured axios instance
export default api;
