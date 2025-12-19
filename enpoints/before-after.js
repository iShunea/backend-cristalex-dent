const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BeforeAfter = require('../schemas/before-after');

const uploadDir = path.join(__dirname, '../images/before-after');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all before/after entries
router.get('/before-after', async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};

    if (active === 'true') {
      query.isActive = true;
    }

    const entries = await BeforeAfter.find(query).sort({ orderIndex: 1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving before/after entries', error: error.message });
  }
});

// GET single before/after entry by ID
router.get('/before-after/:id', async (req, res) => {
  try {
    const entry = await BeforeAfter.findOne({ id: parseInt(req.params.id) });
    if (!entry) {
      return res.status(404).json({ message: 'Before/After entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving before/after entry', error: error.message });
  }
});

// CREATE new before/after entry
router.post('/before-after', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const entryData = { ...req.body };

    if (req.files['beforeImage']) {
      entryData.beforeImageUrl = '/images/before-after/' + req.files['beforeImage'][0].filename;
    }
    if (req.files['afterImage']) {
      entryData.afterImageUrl = '/images/before-after/' + req.files['afterImage'][0].filename;
    }

    const newEntry = new BeforeAfter(entryData);
    await newEntry.save();
    res.status(201).json({ message: 'Before/After entry created successfully', beforeAfter: newEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error creating before/after entry', error: error.message });
  }
});

// UPDATE before/after entry
router.put('/before-after/:id', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const entryData = { ...req.body };

    if (req.files && req.files['beforeImage']) {
      entryData.beforeImageUrl = '/images/before-after/' + req.files['beforeImage'][0].filename;
    }
    if (req.files && req.files['afterImage']) {
      entryData.afterImageUrl = '/images/before-after/' + req.files['afterImage'][0].filename;
    }

    const updatedEntry = await BeforeAfter.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      entryData,
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Before/After entry not found' });
    }
    res.status(200).json({ message: 'Before/After entry updated successfully', beforeAfter: updatedEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating before/after entry', error: error.message });
  }
});

// DELETE before/after entry
router.delete('/before-after/:id', async (req, res) => {
  try {
    const deletedEntry = await BeforeAfter.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Before/After entry not found' });
    }
    res.status(200).json({ message: 'Before/After entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting before/after entry', error: error.message });
  }
});

module.exports = router;
