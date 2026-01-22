const mongoose = require('mongoose');

const galleryMediaSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },

  // Title in 3 languages
  titleEn: { type: String, required: false },
  titleRo: { type: String, required: false },
  titleRu: { type: String, required: false },

  // Description in 3 languages
  descriptionEn: { type: String, required: false },
  descriptionRo: { type: String, required: false },
  descriptionRu: { type: String, required: false },

  // Category (whitening, orthodontics, restoration, implants, etc.)
  category: { type: String, required: false },

  // Media type: 'photo' or 'video'
  mediaType: { type: String, enum: ['photo', 'video'], default: 'photo' },

  // For photos - before/after images
  beforeImageUrl: { type: String, required: false },
  afterImageUrl: { type: String, required: false },

  // For videos - video URL and poster image
  videoUrl: { type: String, required: false },
  videoPosterUrl: { type: String, required: false },

  // SEO metadata in 3 languages
  seoDescriptionEn: { type: String, required: false },
  seoDescriptionRo: { type: String, required: false },
  seoDescriptionRu: { type: String, required: false },

  seoKeywordsEn: { type: String, required: false },
  seoKeywordsRo: { type: String, required: false },
  seoKeywordsRu: { type: String, required: false },

  // Display settings
  orderIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

galleryMediaSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('GalleryMedia').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const GalleryMedia = mongoose.model('GalleryMedia', galleryMediaSchema);
module.exports = GalleryMedia;
