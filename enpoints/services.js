const express = require('express');
const router = express.Router();
const { uploadServices, updateObjectWithUploadedFiles } = require('../handleImage');
const Service = require('../schemas/service');
const path = '/images/services/';

// POST route for services
router.post('/services', uploadServices.any(), async (req, res) => {
  try {
    const servicesData = { ...req.body };

    updateObjectWithUploadedFiles(req, servicesData, path);

    const newService = new Service(servicesData);
    await newService.save();

    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Error saving service', error });
    console.error('Error:', error);
  }
});

// GET route to retrieve all services page
router.get('/services', async (req, res) => {
    try {
      const services = await Service.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving services', error });
      console.error("Error: ", error);
    }
  }
);

// GET route to retrieve a single service by ID
router.get('/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findOne({ id: id });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the service', error });
    console.error("Error: ", error);
  }
}
);

// GET route to retrieve all services except the one ID is passed
router.get('/services/other/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find all services except the one with the given id
    const services = await Service.find({ id: { $ne: id } });

    if (!services || services.length === 0) {
      services = [];
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services', error });
    console.error("Error: ", error);
  }
});

  
// GET route to retrieve all services for services page
router.get('/admin/services/list', async (req, res) => {
  try {
      // Use projection to only retrieve 'id' and 'jobTitle' fields
      const services = await Service.find({}, 'id title');

      // Use .map() to efficiently transform the result
      const returnServices = services.map(({ id, title }) => ({
          id,
          title,
      }));

      res.status(200).json(returnServices);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving services', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve a single service by ID
router.get('/admin/edit/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findOne({ id: id });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the service', error });
    console.error("Error: ", error);
  }
}
);

// PUT route to update an service
router.put('/admin/edit/services/:id', uploadServices.any(), async (req, res) => {
  const { id } = req.params;
  try {
    const serviceData = { ...req.body };

    updateObjectWithUploadedFiles(req, serviceData, path);
    
    const updatedService = await Service.findOneAndUpdate({ id: id }, serviceData, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
    console.error('Error:', error);
  }
});

module.exports = router;