const express = require('express');
const router = express.Router();
const { uploadBlogs, updateObjectWithUploadedFiles } = require('../handleImage');
const Offer = require('../schemas/offer');
const path = '/images/offers/';

router.post('/offers', uploadBlogs.any(), async (req, res) => {
    try {
        const offerData = { ...req.body };

        updateObjectWithUploadedFiles(req, offerData, path);

        const newOffer = new Offer(offerData);
        await newOffer.save();

        res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
    } catch (error) {
        res.status(500).json({ message: 'Error saving offer', error });
        console.error('Error:', error);
    }
});

router.get('/offers', async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = {};
        
        if (status) filter.status = status;
        if (category) filter.category = category;

        const offers = await Offer.find(filter);

        if (!offers || offers.length === 0) {
            return res.status(404).json({ message: 'No offers found' });
        }

        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving offers', error });
        console.error('Error:', error);
    }
});

router.get('/offers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const offer = await Offer.findOne({ id: id });

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the offer', error });
        console.error('Error:', error);
    }
});

router.put('/offers/:id', uploadBlogs.any(), async (req, res) => {
    const { id } = req.params;
    try {
        const offerData = { ...req.body };

        updateObjectWithUploadedFiles(req, offerData, path);

        const updatedOffer = await Offer.findOneAndUpdate({ id: id }, offerData, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating offer', error });
        console.error('Error:', error);
    }
});

router.delete('/offers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOffer = await Offer.findOneAndDelete({ id: id });

        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer', error });
        console.error('Error:', error);
    }
});

module.exports = router;
