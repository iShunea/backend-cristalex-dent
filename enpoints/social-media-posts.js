const express = require('express');
const router = express.Router();
const SocialMediaPost = require('../schemas/social-media-post');

router.get('/social-media-posts', async (req, res) => {
  try {
    const socialMediaPosts = await SocialMediaPost.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json(socialMediaPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving social media posts', error: error.message });
  }
});

router.get('/social-media-posts/all', async (req, res) => {
  try {
    const socialMediaPosts = await SocialMediaPost.find().sort({ displayOrder: 1 });
    res.status(200).json(socialMediaPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving social media posts', error: error.message });
  }
});

router.get('/social-media-posts/:id', async (req, res) => {
  try {
    const socialMediaPost = await SocialMediaPost.findOne({ id: parseInt(req.params.id) });
    if (!socialMediaPost) {
      return res.status(404).json({ message: 'Social media post not found' });
    }
    res.status(200).json(socialMediaPost);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving social media post', error: error.message });
  }
});

router.post('/social-media-posts', async (req, res) => {
  try {
    const newSocialMediaPost = new SocialMediaPost(req.body);
    await newSocialMediaPost.save();
    res.status(201).json({ message: 'Social media post created successfully', socialMediaPost: newSocialMediaPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating social media post', error: error.message });
  }
});

router.put('/social-media-posts/:id', async (req, res) => {
  try {
    const updatedSocialMediaPost = await SocialMediaPost.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!updatedSocialMediaPost) {
      return res.status(404).json({ message: 'Social media post not found' });
    }
    res.status(200).json({ message: 'Social media post updated successfully', socialMediaPost: updatedSocialMediaPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating social media post', error: error.message });
  }
});

router.delete('/social-media-posts/:id', async (req, res) => {
  try {
    const deletedSocialMediaPost = await SocialMediaPost.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedSocialMediaPost) {
      return res.status(404).json({ message: 'Social media post not found' });
    }
    res.status(200).json({ message: 'Social media post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting social media post', error: error.message });
  }
});

module.exports = router;
