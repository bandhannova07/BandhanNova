const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth, optionalAuth } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

/**
 * @route   GET /api/community/posts
 * @desc    Get all community posts
 * @access  Public
 */
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort = 'latest' } = req.query;
    
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likes: -1, createdAt: -1 };
        break;
      case 'trending':
        sortOption = { 'engagement.score': -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts'
    });
  }
});

/**
 * @route   POST /api/community/posts
 * @desc    Create a new community post
 * @access  Private
 */
router.post('/posts', 
  auth,
  [
    body('content').notEmpty().withMessage('Post content is required'),
    body('category').optional().isIn(['general', 'tech', 'projects', 'help', 'showcase']).withMessage('Invalid category')
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

      const { content, category = 'general', tags = [] } = req.body;

      const post = new Post({
        content,
        category,
        tags,
        author: req.user.id
      });

      await post.save();
      await post.populate('author', 'name avatar');

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating post'
      });
    }
  }
);

/**
 * @route   GET /api/community/posts/:id
 * @desc    Get post by ID
 * @access  Public
 */
router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post'
    });
  }
});

/**
 * @route   POST /api/community/posts/:id/like
 * @desc    Like/unlike a post
 * @access  Private
 */
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likesCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking post'
    });
  }
});

/**
 * @route   POST /api/community/posts/:id/comments
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/posts/:id/comments', 
  auth,
  [
    body('content').notEmpty().withMessage('Comment content is required')
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

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const { content } = req.body;

      post.comments.push({
        content,
        author: req.user.id,
        createdAt: new Date()
      });

      await post.save();
      await post.populate('comments.author', 'name avatar');

      const newComment = post.comments[post.comments.length - 1];

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while adding comment'
      });
    }
  }
);

/**
 * @route   GET /api/community/categories
 * @desc    Get post categories with counts
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryMap = {
      'general': 'General Discussion',
      'tech': 'Technology',
      'projects': 'Projects',
      'help': 'Help & Support',
      'showcase': 'Showcase'
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
 * @route   GET /api/community/trending
 * @desc    Get trending posts
 * @access  Public
 */
router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find({ isActive: true })
      .populate('author', 'name avatar')
      .sort({ 'engagement.score': -1, likes: -1 })
      .limit(5);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trending posts'
    });
  }
});

module.exports = router;
