/**
 * Validation Utilities
 * Form validation functions and schemas
 */

import { REGEX_PATTERNS, FILE_UPLOAD_CONFIG } from './constants';

// Form validation schemas
export const validationSchemas = {
  // User Registration Schema
  register: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must be 2-50 characters and contain only letters'
    },
    email: {
      required: true,
      pattern: REGEX_PATTERNS.email,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: REGEX_PATTERNS.password,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    confirmPassword: {
      required: true,
      match: 'password',
      message: 'Passwords do not match'
    },
    preferredLanguage: {
      required: true,
      message: 'Please select your preferred language'
    }
  },

  // User Login Schema
  login: {
    email: {
      required: true,
      pattern: REGEX_PATTERNS.email,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 1,
      message: 'Password is required'
    }
  },

  // Profile Update Schema
  profile: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'Name must be 2-50 characters'
    },
    email: {
      required: true,
      pattern: REGEX_PATTERNS.email,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: false,
      pattern: REGEX_PATTERNS.phone,
      message: 'Please enter a valid phone number'
    }
  },

  // Freelance Order Schema
  freelanceOrder: {
    clientName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Client name must be 2-100 characters'
    },
    clientEmail: {
      required: true,
      pattern: REGEX_PATTERNS.email,
      message: 'Please enter a valid email address'
    },
    clientPhone: {
      required: false,
      pattern: REGEX_PATTERNS.phone,
      message: 'Please enter a valid phone number'
    },
    projectType: {
      required: true,
      message: 'Please select a project type'
    },
    projectTitle: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Project title must be 5-200 characters'
    },
    projectDescription: {
      required: true,
      minLength: 50,
      maxLength: 2000,
      message: 'Project description must be 50-2000 characters'
    },
    timeline: {
      required: true,
      message: 'Please select a timeline'
    },
    complexity: {
      required: true,
      message: 'Please select project complexity'
    }
  },

  // Article Schema
  article: {
    title: {
      required: true,
      minLength: 10,
      maxLength: 200,
      message: 'Title must be 10-200 characters'
    },
    content: {
      required: true,
      minLength: 100,
      message: 'Content must be at least 100 characters'
    },
    excerpt: {
      required: true,
      minLength: 50,
      maxLength: 300,
      message: 'Excerpt must be 50-300 characters'
    },
    category: {
      required: true,
      message: 'Please select a category'
    },
    tags: {
      required: false,
      maxItems: 10,
      message: 'Maximum 10 tags allowed'
    }
  },

  // Tech News Schema
  techNews: {
    title: {
      required: true,
      minLength: 10,
      maxLength: 200,
      message: 'Title must be 10-200 characters'
    },
    content: {
      required: true,
      minLength: 100,
      message: 'Content must be at least 100 characters'
    },
    summary: {
      required: true,
      minLength: 50,
      maxLength: 500,
      message: 'Summary must be 50-500 characters'
    },
    description: {
      required: true,
      minLength: 20,
      maxLength: 300,
      message: 'Description must be 20-300 characters'
    },
    newsType: {
      required: true,
      message: 'Please select news type'
    },
    featuredImage: {
      required: true,
      message: 'Featured image is required'
    }
  },

  // Community Post Schema
  communityPost: {
    content: {
      required: true,
      minLength: 10,
      maxLength: 2000,
      message: 'Post content must be 10-2000 characters'
    }
  },

  // Contact Form Schema
  contact: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Name must be 2-100 characters'
    },
    email: {
      required: true,
      pattern: REGEX_PATTERNS.email,
      message: 'Please enter a valid email address'
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Subject must be 5-200 characters'
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      message: 'Message must be 20-1000 characters'
    }
  }
};

/**
 * Validate a single field
 * @param {any} value - Field value
 * @param {Object} rules - Validation rules
 * @param {Object} formData - Complete form data (for match validation)
 * @returns {Object} Validation result
 */
export const validateField = (value, rules, formData = {}) => {
  const errors = [];

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push(rules.message || 'This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // String validations
  if (typeof value === 'string') {
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(rules.message || `Minimum length is ${rules.minLength} characters`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(rules.message || `Maximum length is ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || 'Invalid format');
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    // Max items validation
    if (rules.maxItems && value.length > rules.maxItems) {
      errors.push(rules.message || `Maximum ${rules.maxItems} items allowed`);
    }
  }

  // Match validation (for password confirmation)
  if (rules.match && formData[rules.match] !== value) {
    errors.push(rules.message || 'Values do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate entire form
 * @param {Object} formData - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const fieldRules = schema[fieldName];
    const fieldValidation = validateField(fieldValue, fieldRules, formData);

    if (!fieldValidation.isValid) {
      errors[fieldName] = fieldValidation.errors;
      isValid = false;
    }
  });

  return {
    isValid,
    errors,
    errorCount: Object.keys(errors).length
  };
};

/**
 * File validation utilities
 */
export const fileValidation = {
  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Allowed MIME types
   * @returns {Object} Validation result
   */
  validateType: (file, allowedTypes) => {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes
   * @returns {Object} Validation result
   */
  validateSize: (file, maxSize = FILE_UPLOAD_CONFIG.maxSize) => {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const fileSizeMB = Math.round(file.size / (1024 * 1024));
      return { 
        isValid: false, 
        error: `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB` 
      };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validate image file
   * @param {File} file - Image file to validate
   * @returns {Object} Validation result
   */
  validateImage: (file) => {
    const typeValidation = fileValidation.validateType(file, FILE_UPLOAD_CONFIG.allowedTypes.images);
    if (!typeValidation.isValid) return typeValidation;

    const sizeValidation = fileValidation.validateSize(file);
    if (!sizeValidation.isValid) return sizeValidation;

    return { isValid: true, error: null };
  },

  /**
   * Validate document file
   * @param {File} file - Document file to validate
   * @returns {Object} Validation result
   */
  validateDocument: (file) => {
    const typeValidation = fileValidation.validateType(file, FILE_UPLOAD_CONFIG.allowedTypes.documents);
    if (!typeValidation.isValid) return typeValidation;

    const sizeValidation = fileValidation.validateSize(file);
    if (!sizeValidation.isValid) return sizeValidation;

    return { isValid: true, error: null };
  }
};

/**
 * Real-time validation hook helper
 * @param {Object} formData - Current form data
 * @param {Object} schema - Validation schema
 * @param {Array} fieldsToValidate - Specific fields to validate (optional)
 * @returns {Object} Validation state
 */
export const useFormValidation = (formData, schema, fieldsToValidate = null) => {
  const fieldsToCheck = fieldsToValidate || Object.keys(schema);
  const errors = {};
  let isValid = true;

  fieldsToCheck.forEach(fieldName => {
    if (schema[fieldName]) {
      const fieldValue = formData[fieldName];
      const fieldRules = schema[fieldName];
      const fieldValidation = validateField(fieldValue, fieldRules, formData);

      if (!fieldValidation.isValid) {
        errors[fieldName] = fieldValidation.errors[0]; // Show only first error
        isValid = false;
      }
    }
  });

  return {
    isValid,
    errors,
    hasErrors: Object.keys(errors).length > 0,
    getFieldError: (fieldName) => errors[fieldName] || null,
    isFieldValid: (fieldName) => !errors[fieldName]
  };
};

/**
 * Custom validation rules
 */
export const customValidations = {
  /**
   * Validate Indian phone number
   * @param {string} phone - Phone number
   * @returns {boolean} Is valid
   */
  indianPhone: (phone) => {
    const indianPhoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return indianPhoneRegex.test(phone);
  },

  /**
   * Validate strong password
   * @param {string} password - Password
   * @returns {Object} Validation result with strength
   */
  strongPassword: (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strength = Math.round((passedChecks / 5) * 100);

    return {
      isValid: passedChecks >= 4,
      strength,
      checks,
      message: passedChecks >= 4 ? 'Strong password' : 'Password needs improvement'
    };
  },

  /**
   * Validate URL slug
   * @param {string} slug - URL slug
   * @returns {boolean} Is valid slug
   */
  urlSlug: (slug) => {
    return REGEX_PATTERNS.slug.test(slug);
  },

  /**
   * Validate age (18+)
   * @param {Date|string} birthDate - Birth date
   * @returns {boolean} Is 18 or older
   */
  minimumAge: (birthDate, minimumAge = 18) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minimumAge;
    }
    
    return age >= minimumAge;
  },

  /**
   * Validate credit card number (basic Luhn algorithm)
   * @param {string} cardNumber - Credit card number
   * @returns {boolean} Is valid card number
   */
  creditCard: (cardNumber) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
};

/**
 * Sanitization utilities
 */
export const sanitization = {
  /**
   * Sanitize HTML content
   * @param {string} html - HTML content
   * @returns {string} Sanitized HTML
   */
  sanitizeHtml: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Sanitize user input
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  /**
   * Sanitize filename
   * @param {string} filename - Original filename
   * @returns {string} Safe filename
   */
  sanitizeFilename: (filename) => {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  }
};
