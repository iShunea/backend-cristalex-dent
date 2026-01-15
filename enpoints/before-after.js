const express = require('express');
const router = express.Router();
const multer = require('multer');
const BeforeAfter = require('../schemas/before-after');
const { uploadToR2 } = require('../handleImage');

const upload = multer({ storage: multer.memoryStorage() });

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
      entryData.beforeImageUrl = await uploadToR2(req.files['beforeImage'][0], 'before-after');
    }
    if (req.files['afterImage']) {
      entryData.afterImageUrl = await uploadToR2(req.files['afterImage'][0], 'before-after');
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
      entryData.beforeImageUrl = await uploadToR2(req.files['beforeImage'][0], 'before-after');
    }
    if (req.files && req.files['afterImage']) {
      entryData.afterImageUrl = await uploadToR2(req.files['afterImage'][0], 'before-after');
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
