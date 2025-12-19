const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ServiceNew = require('../schemas/service-new');

const uploadDir = path.join(__dirname, '../images/services');
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

const serviceUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'firstIconPath', maxCount: 1 },
  { name: 'secondIconPath', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

router.get('/services', async (req, res) => {
  try {
    const services = await ServiceNew.find().sort({ orderIndex: 1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services', error: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    let service;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      service = await ServiceNew.findById(paramId);
    } else {
      service = await ServiceNew.findOne({ id: parseInt(paramId) });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving service', error: error.message });
  }
});

router.post('/services', serviceUpload, async (req, res) => {
  try {
    const serviceData = { ...req.body };

    if (req.body.features) {
      serviceData.features = typeof req.body.features === 'string'
        ? JSON.parse(req.body.features)
        : req.body.features;
    }

    // Handle multiple image fields
    if (req.files) {
      if (req.files['heroImage']) {
        serviceData.heroImage = '/images/services/' + req.files['heroImage'][0].filename;
      }
      if (req.files['firstIconPath']) {
        serviceData.firstIconPath = '/images/services/' + req.files['firstIconPath'][0].filename;
      }
      if (req.files['secondIconPath']) {
        serviceData.secondIconPath = '/images/services/' + req.files['secondIconPath'][0].filename;
      }
      if (req.files['image']) {
        serviceData.imageUrl = '/images/services/' + req.files['image'][0].filename;
      }
    }

    const newService = new ServiceNew(serviceData);
    await newService.save();
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

router.put('/services/:id', serviceUpload, async (req, res) => {
  try {
    const paramId = req.params.id;
    const serviceData = { ...req.body };

    if (req.body.features) {
      serviceData.features = typeof req.body.features === 'string'
        ? JSON.parse(req.body.features)
        : req.body.features;
    }

    // Handle multiple image fields
    if (req.files) {
      if (req.files['heroImage']) {
        serviceData.heroImage = '/images/services/' + req.files['heroImage'][0].filename;
      }
      if (req.files['firstIconPath']) {
        serviceData.firstIconPath = '/images/services/' + req.files['firstIconPath'][0].filename;
      }
      if (req.files['secondIconPath']) {
        serviceData.secondIconPath = '/images/services/' + req.files['secondIconPath'][0].filename;
      }
      if (req.files['image']) {
        serviceData.imageUrl = '/images/services/' + req.files['image'][0].filename;
      }
    }

    let updatedService;
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedService = await ServiceNew.findByIdAndUpdate(paramId, serviceData, { new: true });
    } else {
      updatedService = await ServiceNew.findOneAndUpdate(
        { id: parseInt(paramId) },
        serviceData,
        { new: true }
      );
    }

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    let deletedService;

    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      deletedService = await ServiceNew.findByIdAndDelete(paramId);
    } else {
      deletedService = await ServiceNew.findOneAndDelete({ id: parseInt(paramId) });
    }

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = router;
