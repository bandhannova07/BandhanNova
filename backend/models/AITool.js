const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['text-generation', 'image-generation', 'code-generation', 'data-analysis', 'translation', 'summarization', 'other']
  },
  pricing: {
    type: String,
    required: true,
    enum: ['basic', 'moderate', 'high-level'],
    default: 'basic'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  features: [{
    type: String,
    required: true
  }],
  limitations: [{
    type: String
  }],
  examples: [{
    input: String,
    output: String,
    description: String
  }],
  apiEndpoint: {
    type: String,
    trim: true
  },
  parameters: [{
    name: String,
    type: String,
    required: Boolean,
    default: mongoose.Schema.Types.Mixed,
    description: String
  }],
  usage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    successfulRequests: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: 'Bot'
  },
  color: {
    type: String,
    default: '#0066ff'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
aiToolSchema.index({ category: 1, pricing: 1 });
aiToolSchema.index({ featured: 1, isActive: 1 });
aiToolSchema.index({ 'rating.average': -1 });
aiToolSchema.index({ 'usage.totalRequests': -1 });

// Virtual for formatted price
aiToolSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price}`;
});

// Static methods
aiToolSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ featured: -1, 'rating.average': -1 });
};

aiToolSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true, isActive: true }).sort({ 'rating.average': -1 }).limit(limit);
};

aiToolSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true }).sort({ 'usage.totalRequests': -1 }).limit(limit);
};

// Instance methods
aiToolSchema.methods.incrementUsage = function(responseTime, success = true) {
  this.usage.totalRequests += 1;
  if (success) {
    this.usage.successfulRequests += 1;
  }
  
  // Update average response time
  const currentAvg = this.usage.averageResponseTime;
  const totalRequests = this.usage.totalRequests;
  this.usage.averageResponseTime = ((currentAvg * (totalRequests - 1)) + responseTime) / totalRequests;
  
  return this.save();
};

aiToolSchema.methods.updateRating = function(newRating) {
  const currentAvg = this.rating.average;
  const currentCount = this.rating.count;
  
  this.rating.count += 1;
  this.rating.average = ((currentAvg * currentCount) + newRating) / this.rating.count;
  
  return this.save();
};

module.exports = mongoose.model('AITool', aiToolSchema);
