const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: String,
    required: true,
    maxlength: 2000
  },
  estimatedBudget: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedTimeline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'approved'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['web-app', 'mobile-app', 'game', 'ai-tool', 'other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  timeline: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  requirements: [{
    type: String,
    required: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    default: 'draft'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applications: [applicationSchema],
  milestones: [milestoneSchema],
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
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'invited-only'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  remote: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  actualStartDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  rating: {
    clientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    freelancerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    clientReview: String,
    freelancerReview: String
  },
  payment: {
    method: {
      type: String,
      enum: ['milestone', 'hourly', 'fixed'],
      default: 'fixed'
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending'
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  communication: {
    lastMessage: {
      type: Date
    },
    messageCount: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ budget: 1 });
projectSchema.index({ featured: 1, status: 1 });

// Virtual for application count
projectSchema.virtual('totalApplications').get(function() {
  return this.applications.length;
});

// Virtual for pending applications
projectSchema.virtual('pendingApplications').get(function() {
  return this.applications.filter(app => app.status === 'pending').length;
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Pre-save middleware
projectSchema.pre('save', function(next) {
  // Update applications count
  this.applicationsCount = this.applications.length;
  
  // Set end date based on timeline if not set
  if (!this.endDate && this.startDate && this.timeline) {
    const timelineMatch = this.timeline.match(/(\d+)\s*(day|week|month)s?/i);
    if (timelineMatch) {
      const amount = parseInt(timelineMatch[1]);
      const unit = timelineMatch[2].toLowerCase();
      const startDate = new Date(this.startDate);
      
      switch (unit) {
        case 'day':
          this.endDate = new Date(startDate.setDate(startDate.getDate() + amount));
          break;
        case 'week':
          this.endDate = new Date(startDate.setDate(startDate.getDate() + (amount * 7)));
          break;
        case 'month':
          this.endDate = new Date(startDate.setMonth(startDate.getMonth() + amount));
          break;
      }
    }
  }
  
  next();
});

// Static methods
projectSchema.statics.getProjectsByCategory = function(category) {
  return this.find({ category, status: 'open', isActive: true })
    .populate('client', 'name avatar')
    .sort({ createdAt: -1 });
};

projectSchema.statics.getFeaturedProjects = function(limit = 10) {
  return this.find({ featured: true, status: 'open', isActive: true })
    .populate('client', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

projectSchema.statics.getProjectStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' }
      }
    }
  ]);
};

// Instance methods
projectSchema.methods.addApplication = function(freelancerId, applicationData) {
  // Check if user already applied
  const existingApp = this.applications.find(
    app => app.freelancer.toString() === freelancerId.toString()
  );
  
  if (existingApp) {
    throw new Error('User has already applied for this project');
  }
  
  this.applications.push({
    freelancer: freelancerId,
    ...applicationData
  });
  
  return this.save();
};

projectSchema.methods.acceptApplication = function(applicationId) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Reject all other applications
  this.applications.forEach(app => {
    if (app._id.toString() !== applicationId.toString()) {
      app.status = 'rejected';
      app.respondedAt = new Date();
    }
  });
  
  // Accept the selected application
  application.status = 'accepted';
  application.respondedAt = new Date();
  
  // Assign freelancer to project
  this.assignedTo = application.freelancer;
  this.status = 'in-progress';
  this.startDate = new Date();
  
  return this.save();
};

projectSchema.methods.canUserApply = function(userId) {
  // Check if user is the client
  if (this.client.toString() === userId.toString()) {
    return false;
  }
  
  // Check if project is open
  if (this.status !== 'open') {
    return false;
  }
  
  // Check if user already applied
  const existingApp = this.applications.find(
    app => app.freelancer.toString() === userId.toString()
  );
  
  return !existingApp;
};

module.exports = mongoose.model('Project', projectSchema);
