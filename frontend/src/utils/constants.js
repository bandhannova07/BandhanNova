/**
 * Application Constants
 * Central location for all app-wide constants
 */

// App Information
export const APP_INFO = {
  name: 'BandhanNova',
  tagline: 'Innovating Tomorrow, Today',
  version: '1.0.0',
  description: 'World-class tech company offering AI tools, web apps, games, freelance services, and global community.',
  website: 'https://bandhannova.netlify.app',
  supportEmail: 'support@bandhannova.com',
  adminEmail: 'bandhannova@gmail.com',
  adminPhone: '+91 7003448284'
};

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  version: process.env.REACT_APP_API_VERSION || 'v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Authentication
export const AUTH_CONFIG = {
  tokenKey: 'token',
  refreshTokenKey: 'refreshToken',
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes before actual expiry
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
};

// Theme Configuration
export const THEME_CONFIG = {
  default: 'light',
  storageKey: 'bandhannova-theme',
  options: ['light', 'dark', 'system']
};

// Language Configuration
export const LANGUAGE_CONFIG = {
  default: 'en',
  storageKey: 'bandhannova-language',
  translationCacheKey: 'bandhannova-translations',
  supportedLanguages: {
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
  }
};

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/tech-services', label: 'Tech Services', icon: '🛠️' },
  { path: '/tech-products', label: 'Tech Products', icon: '📱' },
  { path: '/articles', label: 'Articles', icon: '📝' },
  { path: '/tech-news', label: 'Tech News', icon: '📰' },
  { path: '/freelance', label: 'Freelance House', icon: '💼' },
  { path: '/community', label: 'Community Hub', icon: '👥' },
  { path: '/about', label: 'About Us', icon: 'ℹ️' },
  { path: '/contact', label: 'Contact', icon: '📞' }
];

// AI Tools Configuration
export const AI_TOOLS_CONFIG = {
  pricingTiers: {
    free: { price: 0, label: 'Free', color: 'green' },
    basic: { price: 100, label: 'Basic', color: 'blue' },
    moderate: { price: 500, label: 'Moderate', color: 'yellow' },
    'high-level': { price: 1000, label: 'High Level', color: 'red' }
  },
  categories: [
    'text-generator',
    'image-editor', 
    'code-assistant',
    'translator',
    'analyzer',
    'other'
  ]
};

// Freelance Configuration
export const FREELANCE_CONFIG = {
  projectTypes: [
    { value: 'web-app', label: 'Web Application', basePrice: 5000 },
    { value: 'web-game', label: 'Web Game', basePrice: 3000 },
    { value: 'mobile-app', label: 'Mobile Application', basePrice: 8000 },
    { value: 'mobile-game', label: 'Mobile Game', basePrice: 6000 },
    { value: 'custom', label: 'Custom Project', basePrice: 2000 }
  ],
  complexityMultipliers: {
    basic: 1.0,
    moderate: 1.5,
    advanced: 2.5
  },
  timelineModifiers: {
    '1-week': 1.2, // Rush fee
    '2-weeks': 1.1,
    '1-month': 1.0,
    '2-months': 0.9, // Discount
    '3-months': 0.8
  }
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  'web-app': { label: 'Web Applications', icon: '🌐' },
  'web-game': { label: 'Web Games', icon: '🎮' },
  'mobile-app': { label: 'Mobile Apps', icon: '📱' },
  'mobile-game': { label: 'Mobile Games', icon: '🎯' }
};

// Article Categories
export const ARTICLE_CATEGORIES = {
  tutorial: { label: 'Tutorials', icon: '📚' },
  blog: { label: 'Blog Posts', icon: '✍️' },
  'student-guide': { label: 'Student Guides', icon: '🎓' },
  'tech-tips': { label: 'Tech Tips', icon: '💡' },
  'industry-news': { label: 'Industry News', icon: '📈' }
};

// Tech News Types
export const TECH_NEWS_TYPES = {
  breaking: { label: 'Breaking News', color: 'red', icon: '🚨' },
  update: { label: 'Updates', color: 'blue', icon: '🔄' },
  analysis: { label: 'Analysis', color: 'purple', icon: '📊' },
  announcement: { label: 'Announcements', color: 'green', icon: '📢' }
};

// Notification Types
export const NOTIFICATION_TYPES = {
  update: { label: 'Updates', color: 'blue', icon: '🔄' },
  announcement: { label: 'Announcements', color: 'green', icon: '📢' },
  payment: { label: 'Payments', color: 'yellow', icon: '💳' },
  order: { label: 'Orders', color: 'purple', icon: '📦' },
  system: { label: 'System', color: 'gray', icon: '⚙️' },
  marketing: { label: 'Marketing', color: 'pink', icon: '📈' }
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    videos: ['video/mp4', 'video/webm', 'video/ogg']
  },
  uploadEndpoint: '/upload'
};

// Social Media Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/bandhannova',
  linkedin: 'https://linkedin.com/company/bandhannova',
  twitter: 'https://twitter.com/bandhannova',
  facebook: 'https://facebook.com/bandhannova',
  instagram: 'https://instagram.com/bandhannova',
  youtube: 'https://youtube.com/@bandhannova'
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  page: 600,
  modal: 200
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Color Palette
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#0066ff',
    600: '#0052cc',
    700: '#0043a3',
    800: '#003d99',
    900: '#002e73'
  },
  secondary: {
    400: '#00ffff',
    500: '#00e6e6',
    600: '#00cccc'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your internet connection.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check your input and try again.',
  fileUploadError: 'File upload failed. Please try again.',
  translationError: 'Translation failed. Showing original content.',
  paymentError: 'Payment processing failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  register: 'Account created successfully!',
  logout: 'Successfully logged out!',
  profileUpdate: 'Profile updated successfully!',
  passwordChange: 'Password changed successfully!',
  fileUpload: 'File uploaded successfully!',
  paymentSuccess: 'Payment completed successfully!',
  orderPlaced: 'Order placed successfully!',
  settingsSaved: 'Settings saved successfully!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'bandhannova-theme',
  language: 'bandhannova-language',
  notifications: 'bandhannova-notification-settings',
  userPreferences: 'bandhannova-user-preferences',
  cache: 'bandhannova-cache'
};

// Regular Expressions
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  enablePWA: process.env.REACT_APP_ENABLE_PWA === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  debugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
};

// Default Values
export const DEFAULTS = {
  pagination: {
    page: 1,
    limit: 10,
    maxLimit: 100
  },
  debounceDelay: 300,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  requestTimeout: 30000, // 30 seconds
  retryAttempts: 3
};
