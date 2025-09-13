const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String
  },
  signature: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    enum: ['INR', 'USD'],
    default: 'INR'
  },
  type: {
    type: String,
    required: true,
    enum: ['ai-tool', 'freelance', 'subscription', 'other']
  },
  itemId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  gateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal'],
    default: 'razorpay'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  refund: {
    status: {
      type: String,
      enum: ['none', 'requested', 'processing', 'completed', 'rejected'],
      default: 'none'
    },
    reason: String,
    amount: Number,
    refundId: String,
    requestedAt: Date,
    processedAt: Date
  },
  completedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
