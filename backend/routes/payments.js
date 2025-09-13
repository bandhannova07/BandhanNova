const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');

/**
 * @route   POST /api/payments/create-order
 * @desc    Create payment order
 * @access  Private
 */
router.post('/create-order', 
  auth,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isIn(['INR', 'USD']).withMessage('Invalid currency'),
    body('type').isIn(['ai-tool', 'freelance', 'subscription']).withMessage('Invalid payment type'),
    body('itemId').notEmpty().withMessage('Item ID is required')
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

      const { amount, currency = 'INR', type, itemId, description } = req.body;

      // Create payment record
      const payment = new Payment({
        user: req.user.id,
        amount,
        currency,
        type,
        itemId,
        description,
        status: 'pending',
        orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      await payment.save();

      // Mock payment gateway integration
      const paymentOrder = {
        orderId: payment.orderId,
        amount: amount * 100, // Convert to paise for Razorpay
        currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
        name: 'BandhanNova',
        description: description || 'Payment for BandhanNova services',
        prefill: {
          name: req.user.name,
          email: req.user.email,
          contact: req.user.phone || ''
        },
        theme: {
          color: '#0066ff'
        }
      };

      res.json({
        success: true,
        message: 'Payment order created successfully',
        data: {
          payment: payment,
          paymentOrder: paymentOrder
        }
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating payment order'
      });
    }
  }
);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment
 * @access  Private
 */
router.post('/verify', 
  auth,
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('paymentId').notEmpty().withMessage('Payment ID is required'),
    body('signature').notEmpty().withMessage('Signature is required')
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

      const { orderId, paymentId, signature } = req.body;

      // Find payment record
      const payment = await Payment.findOne({ orderId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Mock signature verification (in production, use actual Razorpay verification)
      const isValidSignature = true; // Replace with actual verification

      if (isValidSignature) {
        payment.status = 'completed';
        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.completedAt = new Date();
        await payment.save();

        // Process the payment based on type
        await processPaymentSuccess(payment);

        res.json({
          success: true,
          message: 'Payment verified successfully',
          data: payment
        });
      } else {
        payment.status = 'failed';
        await payment.save();

        res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while verifying payment'
      });
    }
  }
);

/**
 * @route   GET /api/payments/history
 * @desc    Get user payment history
 * @access  Private
 */
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        payments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history'
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment'
    });
  }
});

/**
 * @route   POST /api/payments/refund/:id
 * @desc    Request refund
 * @access  Private
 */
router.post('/refund/:id', 
  auth,
  [
    body('reason').notEmpty().withMessage('Refund reason is required')
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

      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      if (payment.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to refund this payment'
        });
      }

      if (payment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Only completed payments can be refunded'
        });
      }

      const { reason } = req.body;

      payment.refund = {
        status: 'requested',
        reason,
        requestedAt: new Date()
      };

      await payment.save();

      res.json({
        success: true,
        message: 'Refund request submitted successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error requesting refund:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while requesting refund'
      });
    }
  }
);

// Helper function to process successful payments
async function processPaymentSuccess(payment) {
  try {
    switch (payment.type) {
      case 'ai-tool':
        // Grant access to AI tool
        await grantAIToolAccess(payment.user, payment.itemId);
        break;
      
      case 'freelance':
        // Process freelance payment
        await processFreelancePayment(payment);
        break;
      
      case 'subscription':
        // Activate subscription
        await activateSubscription(payment.user, payment.itemId);
        break;
      
      default:
        console.log('Unknown payment type:', payment.type);
    }
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

async function grantAIToolAccess(userId, toolId) {
  // Implementation for granting AI tool access
  console.log(`Granted AI tool access: User ${userId}, Tool ${toolId}`);
}

async function processFreelancePayment(payment) {
  // Implementation for freelance payment processing
  console.log(`Processed freelance payment: ${payment._id}`);
}

async function activateSubscription(userId, planId) {
  // Implementation for subscription activation
  console.log(`Activated subscription: User ${userId}, Plan ${planId}`);
}

module.exports = router;
