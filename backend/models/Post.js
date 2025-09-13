const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'tech', 'projects', 'help', 'showcase'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  engagement: {
    score: {
      type: Number,
      default: 0
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'engagement.score': -1 });
postSchema.index({ likes: -1 });
postSchema.index({ isPinned: 1, createdAt: -1 });

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function() {
  return this.comments.filter(comment => comment.isActive).length;
});

// Virtual for bookmarks count
postSchema.virtual('bookmarksCount').get(function() {
  return this.bookmarks.length;
});

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  if (this.views === 0) return 0;
  const totalEngagement = this.likes.length + this.comments.length + this.shares;
  return (totalEngagement / this.views) * 100;
});

// Pre-save middleware to calculate engagement score
postSchema.pre('save', function(next) {
  // Calculate engagement score based on likes, comments, views, and recency
  const now = new Date();
  const ageInHours = (now - this.createdAt) / (1000 * 60 * 60);
  const ageDecay = Math.exp(-ageInHours / 24); // Decay over 24 hours
  
  const likesScore = this.likes.length * 2;
  const commentsScore = this.comments.length * 3;
  const viewsScore = this.views * 0.1;
  const sharesScore = this.shares * 5;
  
  this.engagement.score = (likesScore + commentsScore + viewsScore + sharesScore) * ageDecay;
  this.engagement.lastCalculated = now;
  
  next();
});

// Static methods
postSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true, moderationStatus: 'approved' })
    .populate('author', 'name avatar')
    .sort({ isPinned: -1, createdAt: -1 });
};

postSchema.statics.getTrending = function(limit = 10) {
  return this.find({ isActive: true, moderationStatus: 'approved' })
    .populate('author', 'name avatar')
    .sort({ 'engagement.score': -1 })
    .limit(limit);
};

postSchema.statics.getPopular = function(timeframe = 7, limit = 10) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);
  
  return this.find({ 
    isActive: true, 
    moderationStatus: 'approved',
    createdAt: { $gte: startDate }
  })
    .populate('author', 'name avatar')
    .sort({ likes: -1, comments: -1 })
    .limit(limit);
};

// Instance methods
postSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  return this.save();
};

postSchema.methods.addBookmark = function(userId) {
  if (!this.bookmarks.includes(userId)) {
    this.bookmarks.push(userId);
  }
  return this.save();
};

postSchema.methods.removeBookmark = function(userId) {
  this.bookmarks = this.bookmarks.filter(id => id.toString() !== userId.toString());
  return this.save();
};

postSchema.methods.addComment = function(commentData) {
  this.comments.push(commentData);
  return this.save();
};

postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

postSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

postSchema.methods.canUserEdit = function(userId) {
  return this.author.toString() === userId.toString();
};

postSchema.methods.canUserDelete = function(userId, userRole) {
  return this.author.toString() === userId.toString() || 
         ['admin', 'moderator'].includes(userRole);
};

module.exports = mongoose.model('Post', postSchema);
