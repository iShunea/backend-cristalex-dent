const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BlogPost = require('../schemas/blog-post');
const { uploadToR2 } = require('../handleImage');

let r2Client = null;
try {
  r2Client = require('../r2-client');
} catch (error) {
  console.log('R2 client not available, using local storage');
}

const uploadDir = path.join(__dirname, '../images/blog-posts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = r2Client
  ? multer({ storage: multer.memoryStorage() })
  : multer({ storage: localStorage });

router.get('/blog-posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ publishingDate: -1 });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog posts', error: error.message });
  }
});

router.get('/blog-posts/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ id: parseInt(req.params.id) });
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog post', error: error.message });
  }
});

router.post('/blog-posts', upload.single('image'), async (req, res) => {
  try {
    const blogPostData = { ...req.body };
    
    if (req.file) {
      let imagePath;
      if (r2Client) {
        imagePath = await uploadToR2(req.file, 'blog-posts');
      } else {
        imagePath = '/images/blog-posts/' + req.file.filename;
      }
      if (imagePath) {
        blogPostData.titleImagePath = imagePath;
        blogPostData.imageUrl = imagePath;
      }
    }
    
    if (blogPostData.publishingDate) {
      blogPostData.publishingDate = new Date(blogPostData.publishingDate);
    }
    
    const newBlogPost = new BlogPost(blogPostData);
    await newBlogPost.save();
    res.status(201).json({ message: 'Blog post created successfully', blogPost: newBlogPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
});

router.put('/blog-posts/:id', upload.single('image'), async (req, res) => {
  try {
    const blogPostData = { ...req.body };
    
    if (req.file) {
      let imagePath;
      if (r2Client) {
        imagePath = await uploadToR2(req.file, 'blog-posts');
      } else {
        imagePath = '/images/blog-posts/' + req.file.filename;
      }
      if (imagePath) {
        blogPostData.titleImagePath = imagePath;
        blogPostData.imageUrl = imagePath;
      }
    }
    
    if (blogPostData.publishingDate) {
      blogPostData.publishingDate = new Date(blogPostData.publishingDate);
    }
    
    const updatedBlogPost = await BlogPost.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      blogPostData,
      { new: true }
    );
    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post updated successfully', blogPost: updatedBlogPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
});

router.delete('/blog-posts/:id', async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
});

module.exports = router;
