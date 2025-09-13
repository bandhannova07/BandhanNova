/**
 * User Model
 * MongoDB schema for user data with comprehensive fields
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Social Links
  socialLinks: {
    website: String,
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  
  // Account Settings
  role: {
    type: String,
    enum: ['user', 'freelancer', 'admin', 'superadmin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'pa', 'or', 'bh', 'ur', 'ne', 'es', 'fr', 'de', 'zh', 'ja'],
    default: 'en'
  },
  
  // User Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      },
      projectUpdates: {
        type: Boolean,
        default: true
      },
      communityPosts: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Professional Information (for freelancers)
  professional: {
    title: String,
    skills: [String],
    experience: {
      type: Number, // years
      default: 0
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    portfolio: [{
      title: String,
      description: String,
      image: String,
      url: String,
      technologies: [String],
      completedAt: Date
    }],
    reviews: [{
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    totalEarnings: {
      type: Number,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    }
  },
  
  // Activity Tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Security
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Two-Factor Authentication
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  // Subscription & Payments
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date,
    paymentMethod: String
  },
  
  // AI Tools Usage
  aiUsage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    monthlyRequests: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    },
    favoriteTools: [String]
  },
  
  // Community Activity
  community: {
    posts: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    reputation: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      description: String,
      icon: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'professional.skills': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full name with title
userSchema.virtual('fullName').get(function() {
  if (this.professional && this.professional.title) {
    return `${this.name} - ${this.professional.title}`;
  }
  return this.name;
});

// Virtual for average rating
userSchema.virtual('averageRating').get(function() {
  if (!this.professional || !this.professional.reviews || this.professional.reviews.length === 0) {
    return 0;
  }
  
  const totalRating = this.professional.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / this.professional.reviews.length) * 10) / 10;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let completed = 0;
  const total = 10;
  
  if (this.name) completed++;
  if (this.email) completed++;
  if (this.avatar) completed++;
  if (this.bio) completed++;
  if (this.phone) completed++;
  if (this.dateOfBirth) completed++;
  if (this.address && this.address.city) completed++;
  if (this.socialLinks && Object.keys(this.socialLinks).length > 0) completed++;
  if (this.professional && this.professional.skills && this.professional.skills.length > 0) completed++;
  if (this.isVerified) completed++;
  
  return Math.round((completed / total) * 100);
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Update login count
  if (this.isModified('lastLogin')) {
    this.loginCount += 1;
  }
  
  // Reset monthly AI usage if needed
  if (this.aiUsage && this.aiUsage.lastResetDate) {
    const now = new Date();
    const lastReset = new Date(this.aiUsage.lastResetDate);
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      this.aiUsage.monthlyRequests = 0;
      this.aiUsage.lastResetDate = now;
    }
  }
  
  next();
});

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Instance method to check if user can use AI tools
userSchema.methods.canUseAITools = function() {
  const limits = {
    free: 10,
    basic: 100,
    premium: 500,
    enterprise: -1 // unlimited
  };
  
  const userLimit = limits[this.subscription.plan];
  
  if (userLimit === -1) return true; // unlimited
  
  return this.aiUsage.monthlyRequests < userLimit;
};

// Instance method to increment AI usage
userSchema.methods.incrementAIUsage = function() {
  this.aiUsage.totalRequests += 1;
  this.aiUsage.monthlyRequests += 1;
  return this.save();
};

// Static method to get user statistics
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
        },
        freelancers: {
          $sum: { $cond: [{ $eq: ['$role', 'freelancer'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    freelancers: 0
  };
};

module.exports = mongoose.model('User', userSchema);
