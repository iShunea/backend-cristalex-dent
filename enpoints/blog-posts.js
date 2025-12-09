const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const BlogPost = require('../schemas/blog-post');

let r2Client = null;
let PutObjectCommand = null;

try {
  r2Client = require('../r2-client');
  const s3Sdk = require('@aws-sdk/client-s3');
  PutObjectCommand = s3Sdk.PutObjectCommand;
} catch (error) {
  console.log('R2 client not available, using local storage');
}

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'easyreservwebsiteb2b';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b';

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

const uploadToR2 = async (file, subDir) => {
  if (!r2Client || !PutObjectCommand) return null;
  
  const fileName = uuidv4() + path.extname(file.originalname);
  const key = `${subDir}/${fileName}`;
  
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await r2Client.send(command);
    return `${R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

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
