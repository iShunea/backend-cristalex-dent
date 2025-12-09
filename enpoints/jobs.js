const express = require('express');
const router = express.Router();
const Job = require('../schemas/job');
const { uploadNone } = require('../handleImage');

// POST route to add a job
router.post('/jobs', uploadNone, async (req, res) => {
  try {
    const jobData = { ...req.body };  // Initialize job data with text fields

    console.log("jobData:", jobData);
    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error saving job', error });
    console.error('Error:', error);
  }
});

// GET route to retrieve all jobs
router.get('/jobs', async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving jobs', error });
      console.error("Error: ", error);
    }
  }
);

// GET route to retrieve all jobs
router.get('/jobs/list', async (req, res) => {
  try {
      // Use projection to retrieve only the necessary fields
      const jobs = await Job.find({}, 'id jobTitle date location type isInternship baseUrl');

      // Use .map() to transform the data efficiently
      const returnJobs = jobs.map(({ id, jobTitle, date, location, type, isInternship, baseUrl }) => ({
          id,
          jobTitle,
          date,
          country: `${location} · ${type}`,
          isInternship,
          baseUrl
      }));

      res.status(200).json(returnJobs);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving jobs', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve a single job by ID
router.get('/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findOne({ id: id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the job', error });
    console.error("Error: ", error);
  }
}
);

// GET route to retrieve all jobs for services page
router.get('/admin/jobs/list', async (req, res) => {
  try {
      // Use projection to only retrieve 'id' and 'jobTitle' fields
      const jobs = await Job.find({}, 'id jobTitle');

      // Use .map() to efficiently transform the result
      const returnJobs = jobs.map(({ id, jobTitle }) => ({
          id,
          jobTitle,
      }));

      res.status(200).json(returnJobs);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving jobs', error });
      console.error("Error: ", error);
  }
});

// GET route to retrieve a single job by ID
router.get('/admin/edit/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findOne({ id: id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the job', error });
    console.error("Error: ", error);
  }
}
);

// PUT route to update an job
router.put('/admin/edit/jobs/:id', uploadNone, async (req, res) => {
  // const path = '/images/jobs/';
  const { id } = req.params;
  try {
    const blogData = { ...req.body };

    const updatedService = await Job.findOneAndUpdate({ id: id }, blogData, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job updated successfully', job: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
    console.error('Error:', error);
  }
});

module.exports = router;