const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * @route   GET /api/freelance/projects
 * @desc    Get all freelance projects
 * @access  Public
 */
router.get('/projects', async (req, res) => {
  try {
    const { category, status, minBudget, maxBudget, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseInt(minBudget);
      if (maxBudget) filter.budget.$lte = parseInt(maxBudget);
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

/**
 * @route   POST /api/freelance/projects
 * @desc    Create a new freelance project
 * @access  Private
 */
router.post('/projects', 
  auth,
  [
    body('title').notEmpty().withMessage('Project title is required'),
    body('description').notEmpty().withMessage('Project description is required'),
    body('category').isIn(['web-app', 'mobile-app', 'game', 'ai-tool', 'other']).withMessage('Invalid category'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('timeline').notEmpty().withMessage('Timeline is required'),
    body('requirements').isArray().withMessage('Requirements must be an array')
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      category,
      budget,
      timeline,
      requirements,
      skills,
      priority
    } = req.body;

    const project = new Project({
      title,
      description,
      category,
      budget,
      timeline,
      requirements,
      skills: skills || [],
      priority: priority || 'medium',
      client: req.user.id,
      status: 'open'
    });

    await project.save();
    await project.populate('client', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

/**
 * @route   GET /api/freelance/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email avatar')
      .populate('assignedTo', 'name email avatar skills');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

/**
 * @route   PUT /api/freelance/projects/:id
 * @desc    Update project
 * @access  Private (Client only)
 */
router.put('/projects/:id', 
  auth,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('budget').optional().isNumeric().withMessage('Budget must be a number'),
    body('status').optional().isIn(['open', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status')
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('client', 'name email avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

/**
 * @route   POST /api/freelance/projects/:id/apply
 * @desc    Apply for a project
 * @access  Private
 */
router.post('/projects/:id/apply', 
  auth,
  [
    body('proposal').notEmpty().withMessage('Proposal is required'),
    body('estimatedBudget').isNumeric().withMessage('Estimated budget must be a number'),
    body('estimatedTimeline').notEmpty().withMessage('Estimated timeline is required')
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Project is not accepting applications'
      });
    }

    // Check if user already applied
    const existingApplication = project.applications.find(
      app => app.freelancer.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this project'
      });
    }

    const { proposal, estimatedBudget, estimatedTimeline } = req.body;

    project.applications.push({
      freelancer: req.user.id,
      proposal,
      estimatedBudget,
      estimatedTimeline,
      appliedAt: new Date()
    });

    await project.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying for project'
    });
  }
});

/**
 * @route   GET /api/freelance/categories
 * @desc    Get project categories with counts
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryMap = {
      'web-app': 'Web Applications',
      'mobile-app': 'Mobile Applications',
      'game': 'Games',
      'ai-tool': 'AI Tools',
      'other': 'Other'
    };

    const formattedCategories = categories.map(cat => ({
      id: cat._id,
      name: categoryMap[cat._id] || cat._id,
      count: cat.count
    }));

    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

/**
 * @route   GET /api/freelance/my-projects
 * @desc    Get user's projects (as client)
 * @access  Private
 */
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id })
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

/**
 * @route   GET /api/freelance/my-applications
 * @desc    Get user's project applications (as freelancer)
 * @access  Private
 */
router.get('/my-applications', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      'applications.freelancer': req.user.id
    }).populate('client', 'name email avatar');

    const applications = projects.map(project => {
      const application = project.applications.find(
        app => app.freelancer.toString() === req.user.id
      );
      return {
        project: {
          _id: project._id,
          title: project.title,
          description: project.description,
          budget: project.budget,
          status: project.status,
          client: project.client
        },
        application
      };
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

module.exports = router;
