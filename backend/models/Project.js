const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  idea: {
    type: String,
    required: true,
    maxlength: 2000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prd: {
    version: {
      type: Number,
      default: 1
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    generatedAt: {
      type: Date,
      default: null
    }
  },
  implementationPlan: {
    version: {
      type: Number,
      default: 1
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    generatedAt: {
      type: Date,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['draft', 'prd_generated', 'plan_generated', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for faster user queries
projectSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);