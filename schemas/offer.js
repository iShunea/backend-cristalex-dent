const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  features: [{ type: String }],
  imagePath: { type: String },
  category: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  validUntil: { type: Date },
  ctaLabel: { type: String, default: 'Get Started' },
  ctaLink: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

offerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
