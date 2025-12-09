const express = require('express');
const router = express.Router();
const { uploadWork, updateObjectWithUploadedFiles } = require('../handleImage');
const Work = require('../schemas/work');
const path = '/images/work/'

// POST route for work
router.post('/works', uploadWork.any(), async (req, res) => {
  try {
    const workData = { ...req.body };

    updateObjectWithUploadedFiles(req, workData, path);

    const newWork = new Work(workData);
    await newWork.save();

    res.status(201).json({ message: 'Work created successfully', work: newWork });
  } catch (error) {
    res.status(500).json({ message: 'Error saving work', error });
    console.error('Error:', error);
  }
});

// GET route to retrieve all works for works page
router.get('/admin/works/list', async (req, res) => {
  try {
      // Use projection to only retrieve 'id' and 'jobTitle' fields
      const works = await Work.find({}, 'id title');

      // Use .map() to efficiently transform the result
      const returnWorks = works.map(({ id, title }) => ({
          id,
          title,
      }));

      res.status(200).json(returnWorks);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving works', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve all works page
router.get('/works', async (req, res) => {
  try {
    const works = await Work.find();
    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving works', error });
    console.error("Error: ", error);
  }
});

// GET route to retrieve all works
router.get('/works/tags', async (req, res) => {
  try {
    // Use projection to retrieve only the necessary fields
    const uniqueTags = await Work.distinct('workTags');

    res.status(200).json(uniqueTags);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving works tags', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve a single work by ID
router.get('/admin/edit/works/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const work = await Work.findOne({ id: id });

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the work', error });
    console.error("Error: ", error);
  }
});

// GET route to retrieve a single work by ID
router.get('/works/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const work = await Work.findOne({ id: id });

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the work', error });
    console.error("Error: ", error);
  }
});

// PUT route to update an work
router.put('/admin/edit/works/:id', uploadWork.any(), async (req, res) => {
const { id } = req.params;
try {
  const blogData = { ...req.body };

  updateObjectWithUploadedFiles(req, blogData, path);
  
  const updatedService = await Work.findOneAndUpdate({ id: id }, blogData, { new: true });

  if (!updatedService) {
    return res.status(404).json({ message: 'Work not found' });
  }

  res.status(200).json({ message: 'Work updated successfully', work: updatedService });
} catch (error) {
  res.status(500).json({ message: 'Error updating work', error });
  console.error('Error:', error);
}
});

module.exports = router;