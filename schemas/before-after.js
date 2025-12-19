const mongoose = require('mongoose');

const beforeAfterSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },

  // Service name in 3 languages
  serviceNameEn: { type: String, required: false },
  serviceNameRo: { type: String, required: false },
  serviceNameRu: { type: String, required: false },

  // SEO description in 3 languages
  seoDescriptionEn: { type: String, required: false },
  seoDescriptionRo: { type: String, required: false },
  seoDescriptionRu: { type: String, required: false },

  // Images
  beforeImageUrl: { type: String, required: false },
  afterImageUrl: { type: String, required: false },

  // Optional additional info
  orderIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

beforeAfterSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('BeforeAfter').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const BeforeAfter = mongoose.model('BeforeAfter', beforeAfterSchema);
module.exports = BeforeAfter;
