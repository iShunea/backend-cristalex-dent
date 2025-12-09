const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

testimonialSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('Testimonial').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
