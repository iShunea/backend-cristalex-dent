const express = require('express');
const router = express.Router();
const CustomForm = require('../schemas/custom-form');
const FormSubmission = require('../schemas/form-submission');
const { uploadFiles } = require('../handleFiles');
const { sendContactFormNotification } = require('../emailService');

router.post('/custom-forms', async (req, res) => {
    try {
        const formData = { ...req.body };
        
        if (formData.fields && typeof formData.fields === 'string') {
            formData.fields = JSON.parse(formData.fields);
        }

        const newForm = new CustomForm(formData);
        await newForm.save();

        res.status(201).json({ message: 'Form created successfully', form: newForm });
    } catch (error) {
        res.status(500).json({ message: 'Error creating form', error: error.message });
        console.error('Error:', error);
    }
});

router.get('/custom-forms', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        
        if (status) filter.status = status;

        const forms = await CustomForm.find(filter);

        if (!forms || forms.length === 0) {
            return res.status(404).json({ message: 'No forms found' });
        }

        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving forms', error });
        console.error('Error:', error);
    }
});

router.get('/custom-forms/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const form = await CustomForm.findOne({ id: id });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the form', error });
        console.error('Error:', error);
    }
});

router.put('/custom-forms/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const formData = { ...req.body };
        
        if (formData.fields && typeof formData.fields === 'string') {
            formData.fields = JSON.parse(formData.fields);
        }

        const updatedForm = await CustomForm.findOneAndUpdate({ id: id }, formData, { new: true });

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form updated successfully', form: updatedForm });
    } catch (error) {
        res.status(500).json({ message: 'Error updating form', error: error.message });
        console.error('Error:', error);
    }
});

router.delete('/custom-forms/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedForm = await CustomForm.findOneAndDelete({ id: id });

        if (!deletedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting form', error });
        console.error('Error:', error);
    }
});

router.post('/custom-forms/:id/submit', uploadFiles, async (req, res) => {
    const { id } = req.params;

    try {
        const form = await CustomForm.findOne({ id: id, status: 'active' });

        if (!form) {
            return res.status(404).json({ message: 'Form not found or inactive' });
        }

        const submissionData = {
            formId: form.id,
            formName: form.name,
            data: { ...req.body },
            files: req.file ? [{ fieldName: req.file.fieldname, filePath: req.file.path }] : [],
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        };

        const submission = new FormSubmission(submissionData);
        await submission.save();

        sendContactFormNotification(form.name, req.body, submission._id)
            .then(result => {
                if (result.success) {
                    console.log('✅ Email notification sent for submission:', submission._id);
                } else {
                    console.warn('⚠️ Email notification failed:', result.message);
                }
            })
            .catch(err => {
                console.error('❌ Email notification error:', err);
            });

        res.status(200).json({ 
            message: form.successMessage || 'Thank you! We will contact you soon.',
            submissionId: submission._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting form', error: error.message });
        console.error('Error:', error);
    }
});

router.get('/custom-forms/:id/submissions', async (req, res) => {
    const { id } = req.params;

    try {
        const submissions = await FormSubmission.find({ formId: id }).sort({ submittedAt: -1 });

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: 'No submissions found' });
        }

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submissions', error });
        console.error('Error:', error);
    }
});

module.exports = router;
