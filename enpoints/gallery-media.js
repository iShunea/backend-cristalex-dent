const express = require('express');
const router = express.Router();
const multer = require('multer');
const GalleryMedia = require('../schemas/gallery-media');
const { uploadToR2 } = require('../handleImage');

const upload = multer({ storage: multer.memoryStorage() });

// GET all gallery media entries
router.get('/gallery-media', async (req, res) => {
  try {
    const { active, mediaType, category } = req.query;
    let query = {};

    if (active === 'true') {
      query.isActive = true;
    }
    if (mediaType) {
      query.mediaType = mediaType;
    }
    if (category) {
      query.category = category;
    }

    const entries = await GalleryMedia.find(query).sort({ orderIndex: 1, createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gallery media entries', error: error.message });
  }
});

// GET single gallery media entry by ID
router.get('/gallery-media/:id', async (req, res) => {
  try {
    const entry = await GalleryMedia.findOne({ id: parseInt(req.params.id) });
    if (!entry) {
      return res.status(404).json({ message: 'Gallery media entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gallery media entry', error: error.message });
  }
});

// CREATE new gallery media entry
router.post('/gallery-media', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'videoPoster', maxCount: 1 }
]), async (req, res) => {
  try {
    const entryData = { ...req.body };

    // Upload images for photo type
    if (req.files && req.files['beforeImage']) {
      entryData.beforeImageUrl = await uploadToR2(req.files['beforeImage'][0], 'gallery-media');
    }
    if (req.files && req.files['afterImage']) {
      entryData.afterImageUrl = await uploadToR2(req.files['afterImage'][0], 'gallery-media');
    }

    // Upload video and poster for video type
    if (req.files && req.files['video']) {
      entryData.videoUrl = await uploadToR2(req.files['video'][0], 'gallery-media');
    }
    if (req.files && req.files['videoPoster']) {
      entryData.videoPosterUrl = await uploadToR2(req.files['videoPoster'][0], 'gallery-media');
    }

    const newEntry = new GalleryMedia(entryData);
    await newEntry.save();
    res.status(201).json({ message: 'Gallery media entry created successfully', galleryMedia: newEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error creating gallery media entry', error: error.message });
  }
});

// UPDATE gallery media entry
router.put('/gallery-media/:id', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'videoPoster', maxCount: 1 }
]), async (req, res) => {
  try {
    const entryData = { ...req.body };

    // Upload new images if provided
    if (req.files && req.files['beforeImage']) {
      entryData.beforeImageUrl = await uploadToR2(req.files['beforeImage'][0], 'gallery-media');
    }
    if (req.files && req.files['afterImage']) {
      entryData.afterImageUrl = await uploadToR2(req.files['afterImage'][0], 'gallery-media');
    }
    if (req.files && req.files['video']) {
      entryData.videoUrl = await uploadToR2(req.files['video'][0], 'gallery-media');
    }
    if (req.files && req.files['videoPoster']) {
      entryData.videoPosterUrl = await uploadToR2(req.files['videoPoster'][0], 'gallery-media');
    }

    const updatedEntry = await GalleryMedia.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      entryData,
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Gallery media entry not found' });
    }
    res.status(200).json({ message: 'Gallery media entry updated successfully', galleryMedia: updatedEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery media entry', error: error.message });
  }
});

// DELETE gallery media entry
router.delete('/gallery-media/:id', async (req, res) => {
  try {
    const deletedEntry = await GalleryMedia.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Gallery media entry not found' });
    }
    res.status(200).json({ message: 'Gallery media entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery media entry', error: error.message });
  }
});

module.exports = router;
