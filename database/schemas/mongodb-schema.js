// BandhanNova MongoDB Database Schema Design
// This file defines the complete database structure for the BandhanNova platform

const mongoose = require('mongoose');

// User Schema - Core user management
const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: function() { return !this.googleId; } },
  
  // Google OAuth
  googleId: { type: String, sparse: true },
  avatar: { type: String, default: '' },
  
  // User Preferences
  preferredLanguage: { 
    type: String, 
    default: 'en',
    enum: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'pa', 'or', 'bh', 'ur', 'ne', 'es', 'fr', 'de', 'zh', 'ja']
  },
  theme: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  
  // Subscription & Payments
  subscription: {
    type: { type: String, default: 'free', enum: ['free', 'basic', 'premium'] },
    expiresAt: Date,
    paymentHistory: [{
      amount: Number,
      currency: { type: String, default: 'INR' },
      paymentId: String,
      date: { type: Date, default: Date.now },
      service: String
    }]
  },
  
  // Activity Tracking
  lastLogin: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  
  // Notifications
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    updates: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Article Schema - Blog posts and tutorials
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  
  // Multilingual Support
  translations: [{
    language: String,
    title: String,
    content: String,
    excerpt: String
  }],
  
  // Categorization
  category: { 
    type: String, 
    required: true,
    enum: ['tutorial', 'blog', 'student-guide', 'tech-tips', 'industry-news']
  },
  tags: [String],
  
  // Media
  featuredImage: String,
  images: [String],
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  
  // Engagement
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false }
  }],
  
  // Publishing
  status: { type: String, default: 'draft', enum: ['draft', 'published', 'archived'] },
  publishedAt: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Tech News Schema
const techNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  
  // News Specific
  newsType: { type: String, enum: ['breaking', 'update', 'analysis', 'announcement'], default: 'update' },
  source: String,
  sourceUrl: String,
  
  // Media
  featuredImage: { type: String, required: true },
  description: { type: String, required: true },
  
  // Multilingual Support
  translations: [{
    language: String,
    title: String,
    content: String,
    summary: String
  }],
  
  // Engagement
  views: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  
  // Publishing
  status: { type: String, default: 'published', enum: ['draft', 'published', 'archived'] },
  publishedAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Tech Products Schema - Web Apps, Games, Mobile Apps
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  
  // Product Details
  category: { 
    type: String, 
    required: true,
    enum: ['web-app', 'web-game', 'mobile-app', 'mobile-game']
  },
  subcategory: String,
  
  // Pricing
  pricing: {
    type: { type: String, enum: ['free', 'paid', 'freemium'], default: 'free' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  
  // Media & Assets
  icon: String,
  screenshots: [String],
  demoUrl: String,
  downloadUrl: String,
  
  // App Store Information (for mobile apps)
  playStoreUrl: String,
  appStoreUrl: String,
  
  // Technical Details
  technologies: [String],
  features: [String],
  requirements: {
    system: String,
    browser: String,
    device: String
  },
  
  // Engagement & Analytics
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Status
  status: { type: String, default: 'active', enum: ['active', 'maintenance', 'deprecated'] },
  version: { type: String, default: '1.0.0' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// AI Tools Schema
const aiToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  
  // Tool Configuration
  category: { 
    type: String, 
    required: true,
    enum: ['text-generator', 'image-editor', 'code-assistant', 'translator', 'analyzer', 'other']
  },
  
  // Pricing Tiers
  pricing: {
    tier: { 
      type: String, 
      enum: ['free', 'basic', 'moderate', 'high-level'], 
      default: 'free' 
    },
    price: { type: Number, default: 0 }, // ₹100, ₹500, ₹1000
    currency: { type: String, default: 'INR' },
    usageLimit: { type: Number, default: -1 } // -1 for unlimited
  },
  
  // Tool Metadata
  apiEndpoint: String,
  parameters: [{
    name: String,
    type: String,
    required: Boolean,
    description: String
  }],
  
  // Usage Analytics
  totalUsage: { type: Number, default: 0 },
  monthlyUsage: { type: Number, default: 0 },
  userUsage: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 },
    lastUsed: { type: Date, default: Date.now }
  }],
  
  // Status
  isActive: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Freelance Orders Schema
const freelanceOrderSchema = new mongoose.Schema({
  // Client Information
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: String,
  
  // Project Details
  projectType: { 
    type: String, 
    required: true,
    enum: ['web-app', 'web-game', 'mobile-app', 'mobile-game', 'custom']
  },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  
  // Requirements
  features: [String],
  technologies: [String],
  timeline: { type: String, required: true }, // "1 week", "1 month", etc.
  budget: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  
  // Pricing Calculation
  complexity: { type: String, enum: ['basic', 'moderate', 'advanced'], required: true },
  basePrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  
  // Order Status
  status: { 
    type: String, 
    default: 'inquiry',
    enum: ['inquiry', 'quoted', 'accepted', 'in-progress', 'completed', 'cancelled']
  },
  
  // Communication
  messages: [{
    from: { type: String, enum: ['client', 'admin'] },
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  
  // Files & Attachments
  attachments: [String],
  deliverables: [String],
  
  // Timeline
  inquiryDate: { type: Date, default: Date.now },
  quotedDate: Date,
  acceptedDate: Date,
  completedDate: Date
}, {
  timestamps: true
});

// Community Posts Schema
const communityPostSchema = new mongoose.Schema({
  // Author
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Content
  content: { type: String, required: true, maxlength: 2000 },
  
  // Multilingual Support
  originalLanguage: { type: String, default: 'en' },
  translations: [{
    language: String,
    content: String,
    translatedAt: { type: Date, default: Date.now }
  }],
  
  // Engagement
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Comments
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  }],
  
  // Moderation
  isApproved: { type: Boolean, default: true },
  flagCount: { type: Number, default: 0 },
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Visibility
  isGlobal: { type: Boolean, default: true },
  visibility: { type: String, default: 'public', enum: ['public', 'private', 'hidden'] }
}, {
  timestamps: true
});

// Payment Transactions Schema
const paymentSchema = new mongoose.Schema({
  // User & Order
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: String, // Can be freelance order, AI tool purchase, etc.
  
  // Payment Details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: 'google-pay' },
  
  // Transaction Info
  transactionId: { type: String, required: true, unique: true },
  paymentGatewayResponse: Object,
  
  // Service Details
  serviceType: { 
    type: String, 
    required: true,
    enum: ['ai-tool', 'freelance-project', 'subscription', 'product-purchase']
  },
  serviceId: String,
  serviceName: String,
  
  // Status
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled']
  },
  
  // Timestamps
  initiatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  refundedAt: Date
}, {
  timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  // Recipients
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isGlobal: { type: Boolean, default: false }, // For admin updates to all users
  
  // Content
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['update', 'announcement', 'payment', 'order', 'system', 'marketing']
  },
  
  // Media
  image: String,
  actionUrl: String,
  
  // Delivery Status
  sentAt: { type: Date, default: Date.now },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  
  // Sender
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = {
  userSchema,
  articleSchema,
  techNewsSchema,
  productSchema,
  aiToolSchema,
  freelanceOrderSchema,
  communityPostSchema,
  paymentSchema,
  notificationSchema
};
