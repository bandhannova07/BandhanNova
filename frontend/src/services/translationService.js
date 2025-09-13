import api from './api';

/**
 * Translation Service
 * Handles Google Translate API integration and translation caching
 */
class TranslationService {
  constructor() {
    this.endpoints = {
      translate: '/translate',
      getTranslations: '/translations',
      saveTranslation: '/translations',
      getLanguages: '/translate/languages'
    };
    
    this.googleTranslateApiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Translate text using Google Translate API
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (default: 'en')
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    if (!text || targetLanguage === sourceLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${this.hashString(text)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use backend API for translation (which uses Google Translate API)
      const response = await api.post(this.endpoints.translate, {
        text,
        targetLanguage,
        sourceLanguage
      });

      const translatedText = response.data.translatedText;
      
      // Cache the translation
      this.saveToCache(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback to direct Google Translate API if backend fails
      if (this.googleTranslateApiKey) {
        return await this.translateWithGoogleAPI(text, targetLanguage, sourceLanguage);
      }
      
      // Return original text if all translation methods fail
      return text;
    }
  }

  /**
   * Direct Google Translate API call (fallback)
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code
   * @returns {Promise<string>} Translated text
   */
  async translateWithGoogleAPI(text, targetLanguage, sourceLanguage = 'en') {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.googleTranslateApiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Google Translate API error:', error);
      return text;
    }
  }

  /**
   * Translate multiple texts in batch
   * @param {Array<string>} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code
   * @returns {Promise<Array<string>>} Array of translated texts
   */
  async translateBatch(texts, targetLanguage, sourceLanguage = 'en') {
    if (!texts || texts.length === 0) {
      return [];
    }

    try {
      const response = await api.post(`${this.endpoints.translate}/batch`, {
        texts,
        targetLanguage,
        sourceLanguage
      });

      return response.data.translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      
      // Fallback to individual translations
      const translations = [];
      for (const text of texts) {
        const translated = await this.translateText(text, targetLanguage, sourceLanguage);
        translations.push(translated);
      }
      
      return translations;
    }
  }

  /**
   * Get cached translations for a language
   * @param {string} languageCode - Language code
   * @returns {Promise<Object>} Cached translations
   */
  async getTranslations(languageCode) {
    try {
      const response = await api.get(`${this.endpoints.getTranslations}/${languageCode}`);
      return response.data.translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  }

  /**
   * Save translation to backend cache
   * @param {string} key - Translation key
   * @param {string} text - Original text
   * @param {string} translation - Translated text
   * @param {string} languageCode - Language code
   * @returns {Promise} API response
   */
  async saveTranslation(key, text, translation, languageCode) {
    try {
      return await api.post(this.endpoints.saveTranslation, {
        key,
        text,
        translation,
        languageCode
      });
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  }

  /**
   * Get supported languages
   * @returns {Promise<Array>} Array of supported languages
   */
  async getSupportedLanguages() {
    try {
      const response = await api.get(this.endpoints.getLanguages);
      return response.data.languages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return [];
    }
  }

  /**
   * Detect language of text
   * @param {string} text - Text to analyze
   * @returns {Promise<string>} Detected language code
   */
  async detectLanguage(text) {
    if (!text || !this.googleTranslateApiKey) {
      return 'en';
    }

    try {
      const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${this.googleTranslateApiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  /**
   * Translate page content automatically
   * @param {string} targetLanguage - Target language code
   * @returns {Promise} Translation completion
   */
  async translatePageContent(targetLanguage) {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    const translations = [];
    elementsToTranslate.forEach(element => {
      const originalText = element.getAttribute('data-original') || element.textContent;
      element.setAttribute('data-original', originalText);
      translations.push({
        element,
        text: originalText
      });
    });

    // Translate all texts in batch
    const texts = translations.map(t => t.text);
    const translatedTexts = await this.translateBatch(texts, targetLanguage);

    // Apply translations to elements
    translations.forEach((translation, index) => {
      translation.element.textContent = translatedTexts[index];
    });
  }

  /**
   * Reset page content to original language
   */
  resetPageContent() {
    const elementsToReset = document.querySelectorAll('[data-original]');
    
    elementsToReset.forEach(element => {
      const originalText = element.getAttribute('data-original');
      if (originalText) {
        element.textContent = originalText;
      }
    });
  }

  /**
   * Get from local cache
   * @param {string} key - Cache key
   * @returns {string|null} Cached value
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.value;
    }
    
    // Remove expired cache
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Save to local cache
   * @param {string} key - Cache key
   * @param {string} value - Value to cache
   */
  saveToCache(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
    
    // Clear localStorage cache as well
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bandhannova-translations-')) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Generate hash for string (simple hash function)
   * @param {string} str - String to hash
   * @returns {string} Hash value
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString();
  }
}

// Create and export singleton instance
const translationService = new TranslationService();
export { translationService };
