const express = require('express');
const router = express.Router();
const { protect: auth, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics (Admin only)
 * @access  Private (Admin)
 */
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    // Mock analytics data - replace with actual database queries
    const analytics = {
      users: {
        total: 1250,
        active: 890,
        new: 45,
        growth: 12.5
      },
      projects: {
        total: 340,
        active: 120,
        completed: 180,
        pending: 40
      },
      revenue: {
        total: 125000,
        monthly: 15000,
        growth: 8.3
      },
      aiTools: {
        usage: 2500,
        popular: 'Text Generator',
        revenue: 45000
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

module.exports = router;
