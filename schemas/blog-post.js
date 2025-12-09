const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
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
