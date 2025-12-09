const mongoose = require('mongoose');

const customFormSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fields: [{
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'file'], required: true },
    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }],
    validation: { type: String }
  }],
  submitButtonText: { type: String, default: 'Submit' },
  successMessage: { type: String, default: 'Thank you! We will contact you soon.' },
  notificationEmail: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

customFormSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CustomForm = mongoose.model('CustomForm', customFormSchema);
module.exports = CustomForm;
