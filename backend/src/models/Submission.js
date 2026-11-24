const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },
    // Dynamic payload submitted by user matching the form fields
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    metadata: {
      ipAddress: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      submittedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// High concurrency & scalable query indexing:
// Compound index on (formId, createdAt DESC) for high performance paginated queries
submissionSchema.index({ formId: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
