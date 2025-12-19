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
    const paramId = req.params.id;
    let testimonial;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      testimonial = await Testimonial.findById(paramId);
    } else {
      testimonial = await Testimonial.findOne({ id: parseInt(paramId) });
    }

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
    const paramId = req.params.id;
    let updatedTestimonial;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedTestimonial = await Testimonial.findByIdAndUpdate(paramId, req.body, { new: true });
    } else {
      updatedTestimonial = await Testimonial.findOneAndUpdate(
        { id: parseInt(paramId) },
        req.body,
        { new: true }
      );
    }

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
    const paramId = req.params.id;
    let deletedTestimonial;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      deletedTestimonial = await Testimonial.findByIdAndDelete(paramId);
    } else {
      deletedTestimonial = await Testimonial.findOneAndDelete({ id: parseInt(paramId) });
    }

    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
});

module.exports = router;
