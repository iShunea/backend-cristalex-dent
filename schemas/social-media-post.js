const mongoose = require('mongoose');

const socialMediaPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  platform: { type: String, required: true, enum: ['instagram', 'tiktok'] },
  videoUrl: { type: String, required: true },
  imageUrl: { type: String, required: false },
  thumbnailUrl: { type: String, required: false },
  titleRo: { type: String, required: true },
  titleRu: { type: String, required: true },
  titleEn: { type: String, required: true },
  descriptionRo: { type: String, default: null },
  descriptionRu: { type: String, default: null },
  descriptionEn: { type: String, default: null },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

socialMediaPostSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('SocialMediaPost').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const SocialMediaPost = mongoose.model('SocialMediaPost', socialMediaPostSchema);
module.exports = SocialMediaPost;
