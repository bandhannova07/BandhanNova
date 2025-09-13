const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const AITool = require('../models/AITool');
const User = require('../models/User');

/**
 * @route   GET /api/ai-tools
 * @desc    Get all AI tools
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, pricing, page = 1, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (pricing) filter.pricing = pricing;

    const tools = await AITool.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AITool.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tools,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI tools'
    });
  }
});

/**
 * @route   GET /api/ai-tools/:id
 * @desc    Get AI tool by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const tool = await AITool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'AI tool not found'
      });
    }

    res.json({
      success: true,
      data: tool
    });
  } catch (error) {
    console.error('Error fetching AI tool:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching AI tool'
    });
  }
});

/**
 * @route   POST /api/ai-tools/:id/use
 * @desc    Use an AI tool (requires authentication)
 * @access  Private
 */
router.post('/:id/use', 
  auth,
  [
    body('input').notEmpty().withMessage('Input is required'),
    body('parameters').optional().isObject().withMessage('Parameters must be an object')
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

      const tool = await AITool.findById(req.params.id);

      if (!tool) {
        return res.status(404).json({
          success: false,
          message: 'AI tool not found'
        });
      }

      if (!tool.isActive) {
        return res.status(400).json({
          success: false,
          message: 'AI tool is currently unavailable'
        });
      }

      const { input, parameters = {} } = req.body;

      // Mock AI processing - replace with actual AI service integration
      const result = await processAIRequest(tool, input, parameters);

      // Log usage
      await logToolUsage(req.user.id, tool._id, input, result);

      res.json({
        success: true,
        data: {
          result,
          usage: {
            toolId: tool._id,
            toolName: tool.name,
            timestamp: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Error using AI tool:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while processing AI request'
      });
    }
  }
);

/**
 * @route   GET /api/ai-tools/categories
 * @desc    Get AI tool categories
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await AITool.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
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
 * @route   GET /api/ai-tools/featured
 * @desc    Get featured AI tools
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const tools = await AITool.find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    console.error('Error fetching featured tools:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured tools'
    });
  }
});

// Mock AI processing function
async function processAIRequest(tool, input, parameters) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock responses based on tool category
  switch (tool.category) {
    case 'text-generation':
      return {
        output: `Generated text based on: "${input}". This is a mock response from ${tool.name}.`,
        confidence: 0.95,
        tokens_used: Math.floor(Math.random() * 100) + 50
      };
    
    case 'image-generation':
      return {
        output: `https://via.placeholder.com/512x512?text=${encodeURIComponent(input)}`,
        style: parameters.style || 'default',
        resolution: parameters.resolution || '512x512'
      };
    
    case 'code-generation':
      return {
        output: `// Generated code for: ${input}\nfunction generatedFunction() {\n  // Implementation here\n  return "Hello World";\n}`,
        language: parameters.language || 'javascript',
        complexity: 'medium'
      };
    
    case 'data-analysis':
      return {
        output: {
          summary: `Analysis of: ${input}`,
          insights: ['Insight 1', 'Insight 2', 'Insight 3'],
          recommendations: ['Recommendation 1', 'Recommendation 2']
        },
        accuracy: 0.92
      };
    
    default:
      return {
        output: `Processed: ${input}`,
        status: 'completed'
      };
  }
}

// Log tool usage
async function logToolUsage(userId, toolId, input, result) {
  try {
    // In a real implementation, you would save this to a Usage model
    console.log('Tool usage logged:', {
      userId,
      toolId,
      timestamp: new Date(),
      inputLength: input.length,
      success: true
    });
  } catch (error) {
    console.error('Error logging tool usage:', error);
  }
}

module.exports = router;
