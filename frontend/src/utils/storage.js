/**
 * Storage Utilities
 * LocalStorage and SessionStorage management with encryption and expiry
 */

import { STORAGE_KEYS } from './constants';

/**
 * Enhanced localStorage wrapper with expiry and encryption
 */
class StorageManager {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.prefix = 'bandhannova_';
  }

  /**
   * Set item with optional expiry and encryption
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   * @param {boolean} encrypt - Whether to encrypt the value
   */
  setItem(key, value, ttl = null, encrypt = false) {
    try {
      const prefixedKey = this.prefix + key;
      let processedValue = value;

      // Encrypt if requested
      if (encrypt) {
        processedValue = this.encrypt(JSON.stringify(value));
      }

      const item = {
        value: processedValue,
        timestamp: Date.now(),
        ttl: ttl,
        encrypted: encrypt
      };

      this.storage.setItem(prefixedKey, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  /**
   * Get item with expiry check and decryption
   * @param {string} key - Storage key
   * @returns {any} Stored value or null
   */
  getItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      const itemStr = this.storage.getItem(prefixedKey);
      
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      // Check expiry
      if (item.ttl && (now - item.timestamp) > item.ttl) {
        this.removeItem(key);
        return null;
      }

      // Decrypt if encrypted
      if (item.encrypted) {
        const decrypted = this.decrypt(item.value);
        return JSON.parse(decrypted);
      }

      return item.value;
    } catch (error) {
      console.error('Storage getItem error:', error);
      this.removeItem(key); // Remove corrupted item
      return null;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      this.storage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    try {
      const keys = Object.keys(this.storage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get all keys with prefix
   * @returns {Array} Array of keys
   */
  keys() {
    try {
      const keys = Object.keys(this.storage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   * @returns {number} Size in bytes
   */
  getSize() {
    try {
      let total = 0;
      const keys = Object.keys(this.storage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          total += this.storage.getItem(key).length;
        }
      });
      return total;
    } catch (error) {
      console.error('Storage getSize error:', error);
      return 0;
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} Is available
   */
  isAvailable() {
    try {
      const testKey = this.prefix + 'test';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean expired items
   */
  cleanExpired() {
    try {
      const keys = this.keys();
      keys.forEach(key => {
        this.getItem(key); // This will remove expired items
      });
    } catch (error) {
      console.error('Storage cleanExpired error:', error);
    }
  }

  /**
   * Simple encryption (Base64 + simple cipher)
   * Note: This is not secure encryption, just obfuscation
   * @param {string} text - Text to encrypt
   * @returns {string} Encrypted text
   */
  encrypt(text) {
    try {
      // Simple Caesar cipher + Base64
      const shifted = text.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) + 3)
      ).join('');
      return btoa(shifted);
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  }

  /**
   * Simple decryption
   * @param {string} encryptedText - Encrypted text
   * @returns {string} Decrypted text
   */
  decrypt(encryptedText) {
    try {
      const decoded = atob(encryptedText);
      return decoded.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) - 3)
      ).join('');
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText;
    }
  }
}

// Create storage instances
export const localStorage = new StorageManager(window.localStorage);
export const sessionStorage = new StorageManager(window.sessionStorage);

/**
 * Specific storage utilities for app data
 */
export const appStorage = {
  // User preferences
  setUserPreferences: (preferences) => {
    return localStorage.setItem(STORAGE_KEYS.userPreferences, preferences, null, true);
  },

  getUserPreferences: () => {
    return localStorage.getItem(STORAGE_KEYS.userPreferences) || {};
  },

  // Theme storage
  setTheme: (theme) => {
    return localStorage.setItem(STORAGE_KEYS.theme, theme);
  },

  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  },

  // Language storage
  setLanguage: (language) => {
    return localStorage.setItem(STORAGE_KEYS.language, language);
  },

  getLanguage: () => {
    return localStorage.getItem(STORAGE_KEYS.language) || 'en';
  },

  // Notification settings
  setNotificationSettings: (settings) => {
    return localStorage.setItem(STORAGE_KEYS.notifications, settings, null, true);
  },

  getNotificationSettings: () => {
    return localStorage.getItem(STORAGE_KEYS.notifications) || {
      email: true,
      push: true,
      updates: true,
      marketing: false
    };
  },

  // Cache management
  setCache: (key, data, ttl = 5 * 60 * 1000) => { // 5 minutes default
    return localStorage.setItem(`${STORAGE_KEYS.cache}_${key}`, data, ttl);
  },

  getCache: (key) => {
    return localStorage.getItem(`${STORAGE_KEYS.cache}_${key}`);
  },

  clearCache: () => {
    const keys = localStorage.keys();
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.cache)) {
        localStorage.removeItem(key);
      }
    });
  },

  // Translation cache
  setTranslationCache: (language, translations) => {
    const key = `translations_${language}`;
    const ttl = 24 * 60 * 60 * 1000; // 24 hours
    return localStorage.setItem(key, translations, ttl);
  },

  getTranslationCache: (language) => {
    const key = `translations_${language}`;
    return localStorage.getItem(key);
  },

  // Form data backup (for unsaved changes)
  backupFormData: (formId, data) => {
    const key = `form_backup_${formId}`;
    const ttl = 60 * 60 * 1000; // 1 hour
    return sessionStorage.setItem(key, data, ttl);
  },

  getFormBackup: (formId) => {
    const key = `form_backup_${formId}`;
    return sessionStorage.getItem(key);
  },

  clearFormBackup: (formId) => {
    const key = `form_backup_${formId}`;
    return sessionStorage.removeItem(key);
  },

  // Recent searches
  addRecentSearch: (query, type = 'general') => {
    const key = `recent_searches_${type}`;
    const existing = localStorage.getItem(key) || [];
    const updated = [query, ...existing.filter(item => item !== query)].slice(0, 10);
    return localStorage.setItem(key, updated);
  },

  getRecentSearches: (type = 'general') => {
    const key = `recent_searches_${type}`;
    return localStorage.getItem(key) || [];
  },

  clearRecentSearches: (type = 'general') => {
    const key = `recent_searches_${type}`;
    return localStorage.removeItem(key);
  },

  // Viewed items tracking
  addViewedItem: (itemId, itemType) => {
    const key = `viewed_${itemType}`;
    const existing = localStorage.getItem(key) || [];
    const updated = [itemId, ...existing.filter(id => id !== itemId)].slice(0, 50);
    return localStorage.setItem(key, updated);
  },

  getViewedItems: (itemType) => {
    const key = `viewed_${itemType}`;
    return localStorage.getItem(key) || [];
  },

  // Favorites
  addFavorite: (itemId, itemType) => {
    const key = `favorites_${itemType}`;
    const existing = localStorage.getItem(key) || [];
    if (!existing.includes(itemId)) {
      existing.push(itemId);
      return localStorage.setItem(key, existing);
    }
    return true;
  },

  removeFavorite: (itemId, itemType) => {
    const key = `favorites_${itemType}`;
    const existing = localStorage.getItem(key) || [];
    const updated = existing.filter(id => id !== itemId);
    return localStorage.setItem(key, updated);
  },

  getFavorites: (itemType) => {
    const key = `favorites_${itemType}`;
    return localStorage.getItem(key) || [];
  },

  isFavorite: (itemId, itemType) => {
    const favorites = appStorage.getFavorites(itemType);
    return favorites.includes(itemId);
  }
};

/**
 * Storage quota management
 */
export const storageQuota = {
  /**
   * Check storage quota usage
   * @returns {Promise<Object>} Quota information
   */
  checkQuota: async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage,
          usagePercentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      }
      return null;
    } catch (error) {
      console.error('Storage quota check error:', error);
      return null;
    }
  },

  /**
   * Check if storage is nearly full
   * @param {number} threshold - Threshold percentage (default 80%)
   * @returns {Promise<boolean>} Is nearly full
   */
  isNearlyFull: async (threshold = 80) => {
    const quota = await storageQuota.checkQuota();
    return quota ? quota.usagePercentage >= threshold : false;
  },

  /**
   * Clean up storage when nearly full
   */
  cleanup: async () => {
    try {
      // Clean expired items
      localStorage.cleanExpired();
      sessionStorage.cleanExpired();

      // Clear old cache
      appStorage.clearCache();

      // Clear old form backups
      const sessionKeys = sessionStorage.keys();
      sessionKeys.forEach(key => {
        if (key.startsWith('form_backup_')) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('Storage cleanup completed');
    } catch (error) {
      console.error('Storage cleanup error:', error);
    }
  }
};

/**
 * Storage event listeners
 */
export const storageEvents = {
  /**
   * Listen for storage changes
   * @param {Function} callback - Callback function
   */
  onStorageChange: (callback) => {
    const handler = (event) => {
      if (event.key && event.key.startsWith('bandhannova_')) {
        const key = event.key.replace('bandhannova_', '');
        callback({
          key,
          oldValue: event.oldValue,
          newValue: event.newValue,
          storageArea: event.storageArea
        });
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  /**
   * Sync data across tabs
   * @param {string} key - Storage key to sync
   * @param {any} value - Value to sync
   */
  syncAcrossTabs: (key, value) => {
    localStorage.setItem(key, value);
    
    // Dispatch custom event for same-tab synchronization
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key, value }
    }));
  },

  /**
   * Listen for cross-tab sync events
   * @param {Function} callback - Callback function
   */
  onCrossTabSync: (callback) => {
    const handler = (event) => {
      callback(event.detail);
    };

    window.addEventListener('localStorageChange', handler);
    return () => window.removeEventListener('localStorageChange', handler);
  }
};

// Initialize storage cleanup on app start
if (typeof window !== 'undefined') {
  // Clean expired items on app start
  setTimeout(() => {
    localStorage.cleanExpired();
    sessionStorage.cleanExpired();
  }, 1000);

  // Set up periodic cleanup
  setInterval(() => {
    localStorage.cleanExpired();
  }, 10 * 60 * 1000); // Every 10 minutes
}
