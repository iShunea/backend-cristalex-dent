const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  
  title: { type: String, required: false },
  excerpt: { type: String, required: false },
  content: { type: String, required: false },
  author: { type: String, required: false },
  category: { type: String, required: false },
  imageUrl: { type: String, required: false },
  
  publishingDate: { type: Date, default: Date.now },
  label: { type: String, required: false },
  
  titleImagePath: { type: String, required: false },
  titleImageAltTextEn: { type: String, required: false },
  titleImageAltTextRo: { type: String, required: false },
  titleImageAltTextRu: { type: String, required: false },
  
  blogTitleEn: { type: String, required: false },
  blogTitleRo: { type: String, required: false },
  blogTitleRu: { type: String, required: false },
  
  blogIntroEn: { type: String, required: false },
  blogIntroRo: { type: String, required: false },
  blogIntroRu: { type: String, required: false },
  
  firstSubheadingTitleEn: { type: String, required: false },
  firstSubheadingTitleRo: { type: String, required: false },
  firstSubheadingTitleRu: { type: String, required: false },
  firstSubheadingTextEn: { type: String, required: false },
  firstSubheadingTextRo: { type: String, required: false },
  firstSubheadingTextRu: { type: String, required: false },
  
  secondSubheadingTitleEn: { type: String, required: false },
  secondSubheadingTitleRo: { type: String, required: false },
  secondSubheadingTitleRu: { type: String, required: false },
  secondSubheadingTextEn: { type: String, required: false },
  secondSubheadingTextRo: { type: String, required: false },
  secondSubheadingTextRu: { type: String, required: false },
  
  thirdSubheadingTitleEn: { type: String, required: false },
  thirdSubheadingTitleRo: { type: String, required: false },
  thirdSubheadingTitleRu: { type: String, required: false },
  thirdSubheadingTextEn: { type: String, required: false },
  thirdSubheadingTextRo: { type: String, required: false },
  thirdSubheadingTextRu: { type: String, required: false },
  
  conclusionEn: { type: String, required: false },
  conclusionRo: { type: String, required: false },
  conclusionRu: { type: String, required: false },
  
  metaDescriptionEn: { type: String, required: false },
  metaDescriptionRo: { type: String, required: false },
  metaDescriptionRu: { type: String, required: false },
  
  metaKeywordsEn: { type: String, required: false },
  metaKeywordsRo: { type: String, required: false },
  metaKeywordsRu: { type: String, required: false },
  
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

blogPostSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastDoc = await mongoose.model('BlogPost').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
