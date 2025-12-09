const express = require('express');
const router = express.Router();
const EmailNotification = require('../schemas/email-notification');
const { uploadNone } = require('../handleImage');
const { uploadFiles, updateFilesPath } = require('../handleFiles');
const FormJob = require('../schemas/form-job');
const FormCall = require('../schemas/form-call');
const FormAlert = require('../schemas/form-alert');

// POST route for form
// Totul se incepe cu /forms

router.post('/forms/email-notification', uploadNone, async (req, res) => {
  try {
    const formData = { ...req.body };

    if (!isValidEmail(formData.email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    const email = new EmailNotification(formData);
    await email.save();

    res.status(200).json({ message: 'Email was successfully registered', email });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user email', error });
    console.error('Error:', error);
  }
})

router.post('/forms/job', uploadFiles, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }

    const formData = { ...req.body, filePath: req.file.path };

    updateFilesPath(formData);

    if (!formData) {
      return res.status(400).json({ message: 'No form data provided' });
    }

    if (!isValidEmail(formData.email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    
    if (!isValidFullName(formData.fullName)) {
      return res.status(400).json({ message: 'Invalid full name' });
    }

    if (!isValidMessage(formData.shortMessage)) {
      return res.status(400).json({ error: 'Invalid message format.' });
    }

    if (!isValidPhoneNumber(formData.phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const formJob = new FormJob(formData);
    await formJob.save();

    res.status(200).json({ message: 'Form job is saved successfully!'});
  } catch (error) {
    res.status(500).json({ message: 'Error saving form job', error });
    console.error('Error:', error);
  }
})

router.post('/forms/call', uploadFiles, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }

    const formData = { ...req.body, filePath: req.file.path };

    updateFilesPath(formData);

    if (!formData) {
      return res.status(400).json({ message: 'No form data provided' });
    }

    if (!isValidEmail(formData.email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    
    if (!isValidFullName(formData.fullName)) {
      return res.status(400).json({ message: 'Invalid full name' });
    }

    if (!isValidMessage(formData.shortMessage)) {
      return res.status(400).json({ error: 'Invalid message format.' });
    }

    if (!isValidMessage(formData.projectType)) {
      return res.status(400).json({ error: 'Invalid message of project type format.' });
    }

    if (!isValidPhoneNumber(formData.phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const formCall = new FormCall(formData);
    await formCall.save();

    res.status(200).json({ message: 'Form call is saved successfully!'});
  } catch (error) {
    res.status(500).json({ message: 'Error saving form call', error });
    console.error('Error:', error);
  }
})

router.post('/forms/alert', uploadFiles, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }

    const formData = { ...req.body, filePath: req.file.path };

    updateFilesPath(formData);

    if (!formData) {
      return res.status(400).json({ message: 'No form data provided' });
    }

    if (!isValidEmail(formData.email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    
    if (!isValidFullName(formData.fullName)) {
      return res.status(400).json({ message: 'Invalid full name' });
    }

    if (!isValidMessage(formData.shortMessage)) {
      return res.status(400).json({ error: 'Invalid message format.' });
    }

    if (!isValidMessage(formData.errorType)) {
      return res.status(400).json({ error: 'Invalid message of error type format.' });
    }

    const formAlert = new FormAlert(formData);
    await formAlert.save();

    res.status(200).json({ message: 'Form alert is saved successfully!'});
  } catch (error) {
    res.status(500).json({ message: 'Error saving form alert', error });
    console.error('Error:', error);
  }
})

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

function isValidFullName(fullName) {
  const regex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
  return regex.test(fullName);
};


function isValidMessage(message) {
  const shortMessageRegex = /^[a-zA-Z0-9 .,!?'-]{1,255}$/;
  return shortMessageRegex.test(message);
}

function isValidPhoneNumber(phone) {
  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
}


module.exports = router;