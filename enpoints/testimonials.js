const express = require('express');
const router = express.Router();
const Testimonial = require('../schemas/testimonial');

router.get('/testimonials', async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};
    
    if (active === 'true') {
      query.isActive = true;
    }
    
    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonials', error: error.message });
  }
});

router.get('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ id: parseInt(req.params.id) });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonial', error: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial created successfully', testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial updated successfully', testimonial: updatedTestimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial', error: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
});

module.exports = router;
