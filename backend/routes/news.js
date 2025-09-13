const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth, authorize, optionalAuth } = require('../middleware/auth');
const Article = require('../models/Article');
const User = require('../models/User');

/**
 * @route   GET /api/news/articles
 * @desc    Get all news articles
 * @access  Public
 */
router.get('/articles', optionalAuth, async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10, search } = req.query;
    
    const filter = { isPublished: true, isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const articles = await Article.find(filter)
      .populate('author', 'name avatar')
      .sort({ featured: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: {
        articles,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching articles'
    });
  }
});

/**
 * @route   POST /api/news/articles
 * @desc    Create a new news article (Admin only)
 * @access  Private (Admin)
 */
router.post('/articles', 
  auth,
  authorize('admin', 'editor'),
  [
    body('title').notEmpty().withMessage('Article title is required'),
    body('content').notEmpty().withMessage('Article content is required'),
    body('excerpt').notEmpty().withMessage('Article excerpt is required'),
    body('category').isIn(['technology', 'ai', 'web-development', 'mobile', 'gaming', 'startup', 'industry']).withMessage('Invalid category')
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
        content,
        excerpt,
        category,
        tags = [],
        featured = false,
        image,
        publishNow = true
      } = req.body;

      const article = new Article({
        title,
        content,
        excerpt,
        category,
        tags,
        featured,
        image,
        author: req.user.id,
        isPublished: publishNow,
        publishedAt: publishNow ? new Date() : null
      });

      await article.save();
      await article.populate('author', 'name avatar');

      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating article'
      });
    }
  }
);

/**
 * @route   GET /api/news/articles/:id
 * @desc    Get article by ID
 * @access  Public
 */
router.get('/articles/:id', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name avatar');

    if (!article || !article.isPublished || !article.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching article'
    });
  }
});

/**
 * @route   PUT /api/news/articles/:id
 * @desc    Update article (Admin/Editor only)
 * @access  Private (Admin/Editor)
 */
router.put('/articles/:id', 
  auth,
  authorize('admin', 'editor'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('excerpt').optional().notEmpty().withMessage('Excerpt cannot be empty')
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

      const article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found'
        });
      }

      // Check if user can edit (author or admin)
      if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this article'
        });
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id,
        { 
          $set: {
            ...req.body,
            updatedAt: new Date()
          }
        },
        { new: true }
      ).populate('author', 'name avatar');

      res.json({
        success: true,
        message: 'Article updated successfully',
        data: updatedArticle
      });
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating article'
      });
    }
  }
);

/**
 * @route   DELETE /api/news/articles/:id
 * @desc    Delete article (Admin only)
 * @access  Private (Admin)
 */
router.delete('/articles/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Soft delete
    article.isActive = false;
    await article.save();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting article'
    });
  }
});

/**
 * @route   GET /api/news/categories
 * @desc    Get article categories with counts
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Article.aggregate([
      { $match: { isPublished: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryMap = {
      'technology': 'Technology',
      'ai': 'Artificial Intelligence',
      'web-development': 'Web Development',
      'mobile': 'Mobile Development',
      'gaming': 'Gaming',
      'startup': 'Startup News',
      'industry': 'Industry News'
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
 * @route   GET /api/news/featured
 * @desc    Get featured articles
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.find({ 
      featured: true, 
      isPublished: true, 
      isActive: true 
    })
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured articles'
    });
  }
});

/**
 * @route   GET /api/news/trending
 * @desc    Get trending articles
 * @access  Public
 */
router.get('/trending', async (req, res) => {
  try {
    const articles = await Article.find({ 
      isPublished: true, 
      isActive: true 
    })
      .populate('author', 'name avatar')
      .sort({ views: -1, publishedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trending articles'
    });
  }
});

module.exports = router;
