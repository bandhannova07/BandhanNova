/**
 * Helper Utility Functions
 * Common utility functions used throughout the application
 */

import { REGEX_PATTERNS, ANIMATION_DURATIONS, BREAKPOINTS } from './constants';

// String Utilities
export const stringUtils = {
  /**
   * Capitalize first letter of a string
   * @param {string} str - Input string
   * @returns {string} Capitalized string
   */
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert string to title case
   * @param {string} str - Input string
   * @returns {string} Title case string
   */
  toTitleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Generate slug from string
   * @param {string} str - Input string
   * @returns {string} URL-friendly slug
   */
  slugify: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  },

  /**
   * Truncate string with ellipsis
   * @param {string} str - Input string
   * @param {number} length - Maximum length
   * @returns {string} Truncated string
   */
  truncate: (str, length = 100) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  },

  /**
   * Extract initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  },

  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  randomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Number Utilities
export const numberUtils = {
  /**
   * Format number with commas
   * @param {number} num - Input number
   * @returns {string} Formatted number
   */
  formatWithCommas: (num) => {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  },

  /**
   * Format currency (Indian Rupees)
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency symbol
   * @returns {string} Formatted currency
   */
  formatCurrency: (amount, currency = '₹') => {
    if (typeof amount !== 'number') return `${currency}0`;
    return `${currency}${amount.toLocaleString('en-IN')}`;
  },

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Generate random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomInRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Clamp number between min and max
   * @param {number} num - Input number
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped number
   */
  clamp: (num, min, max) => {
    return Math.min(Math.max(num, min), max);
  }
};

// Date Utilities
export const dateUtils = {
  /**
   * Format date for display
   * @param {Date|string} date - Input date
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted date
   */
  formatDate: (date, locale = 'en-IN') => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Format date and time
   * @param {Date|string} date - Input date
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted date and time
   */
  formatDateTime: (date, locale = 'en-IN') => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Input date
   * @returns {string} Relative time
   */
  getRelativeTime: (date) => {
    if (!date) return '';
    const now = new Date();
    const dateObj = new Date(date);
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },

  /**
   * Check if date is today
   * @param {Date|string} date - Input date
   * @returns {boolean} Is today
   */
  isToday: (date) => {
    if (!date) return false;
    const today = new Date();
    const dateObj = new Date(date);
    return dateObj.toDateString() === today.toDateString();
  },

  /**
   * Add days to date
   * @param {Date|string} date - Input date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

// Validation Utilities
export const validationUtils = {
  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail: (email) => {
    if (!email) return false;
    return REGEX_PATTERNS.email.test(email);
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone to validate
   * @returns {boolean} Is valid phone
   */
  isValidPhone: (phone) => {
    if (!phone) return false;
    return REGEX_PATTERNS.phone.test(phone);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with strength score
   */
  validatePassword: (password) => {
    if (!password) return { isValid: false, strength: 0, message: 'Password is required' };

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    const strength = Object.values(checks).filter(Boolean).length;
    const isValid = strength >= 4;

    let message = '';
    if (!checks.length) message = 'Password must be at least 8 characters long';
    else if (!checks.lowercase) message = 'Password must contain lowercase letters';
    else if (!checks.uppercase) message = 'Password must contain uppercase letters';
    else if (!checks.number) message = 'Password must contain numbers';
    else if (!checks.special) message = 'Password must contain special characters';
    else message = 'Strong password';

    return { isValid, strength, message, checks };
  },

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  isValidUrl: (url) => {
    if (!url) return false;
    return REGEX_PATTERNS.url.test(url);
  },

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Allowed MIME types
   * @returns {boolean} Is valid file type
   */
  isValidFileType: (file, allowedTypes) => {
    if (!file || !allowedTypes) return false;
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean} Is valid file size
   */
  isValidFileSize: (file, maxSize) => {
    if (!file || !maxSize) return false;
    return file.size <= maxSize;
  }
};

// DOM Utilities
export const domUtils = {
  /**
   * Smooth scroll to element
   * @param {string} elementId - Element ID to scroll to
   * @param {number} offset - Offset from top
   */
  scrollToElement: (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Is in viewport
   */
  isInViewport: (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  },

  /**
   * Get current breakpoint
   * @returns {string} Current breakpoint
   */
  getCurrentBreakpoint: () => {
    const width = window.innerWidth;
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    if (width >= BREAKPOINTS.xs) return 'xs';
    return 'base';
  },

  /**
   * Check if device is mobile
   * @returns {boolean} Is mobile device
   */
  isMobile: () => {
    return window.innerWidth < BREAKPOINTS.md;
  },

  /**
   * Check if device is tablet
   * @returns {boolean} Is tablet device
   */
  isTablet: () => {
    return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
  },

  /**
   * Check if device is desktop
   * @returns {boolean} Is desktop device
   */
  isDesktop: () => {
    return window.innerWidth >= BREAKPOINTS.lg;
  }
};

// Array Utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Input array
   * @param {string} key - Key to compare for objects
   * @returns {Array} Array without duplicates
   */
  removeDuplicates: (arr, key = null) => {
    if (!Array.isArray(arr)) return [];
    if (key) {
      return arr.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
      );
    }
    return [...new Set(arr)];
  },

  /**
   * Shuffle array
   * @param {Array} arr - Input array
   * @returns {Array} Shuffled array
   */
  shuffle: (arr) => {
    if (!Array.isArray(arr)) return [];
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Group array by key
   * @param {Array} arr - Input array
   * @param {string} key - Key to group by
   * @returns {Object} Grouped object
   */
  groupBy: (arr, key) => {
    if (!Array.isArray(arr)) return {};
    return arr.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} arr - Input array
   * @param {number} size - Chunk size
   * @returns {Array} Array of chunks
   */
  chunk: (arr, size) => {
    if (!Array.isArray(arr) || size <= 0) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

// Async Utilities
export const asyncUtils = {
  /**
   * Delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Throttled function
   */
  throttle: (func, delay = 300) => {
    let timeoutId;
    let lastExecTime = 0;
    return (...args) => {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(null, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(null, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  },

  /**
   * Retry async function
   * @param {Function} func - Async function to retry
   * @param {number} retries - Number of retries
   * @param {number} delay - Delay between retries
   * @returns {Promise} Promise that resolves or rejects
   */
  retry: async (func, retries = 3, delay = 1000) => {
    try {
      return await func();
    } catch (error) {
      if (retries > 0) {
        await asyncUtils.delay(delay);
        return asyncUtils.retry(func, retries - 1, delay);
      }
      throw error;
    }
  }
};

// Color Utilities
export const colorUtils = {
  /**
   * Generate random hex color
   * @returns {string} Random hex color
   */
  randomHex: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  },

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {Object} RGB values
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Get contrast color (black or white)
   * @param {string} hex - Background hex color
   * @returns {string} Contrast color
   */
  getContrastColor: (hex) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return '#000000';
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
};

// Local Storage Utilities
export const storageUtils = {
  /**
   * Set item in localStorage with expiry
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   */
  setWithExpiry: (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Get item from localStorage with expiry check
   * @param {string} key - Storage key
   * @returns {any} Stored value or null
   */
  getWithExpiry: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  },

  /**
   * Clear expired items from localStorage
   */
  clearExpired: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      storageUtils.getWithExpiry(key); // This will remove expired items
    });
  }
};
