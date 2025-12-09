const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  formName: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  files: [{ 
    fieldName: { type: String },
    filePath: { type: String }
  }],
  ipAddress: { type: String },
  userAgent: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  submittedAt: { type: Date, default: Date.now }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);
module.exports = FormSubmission;
