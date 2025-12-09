const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create the storage configuration for 'files' directory
const createMulterStorage = () => {
    const dir = './files'; // Use 'files' as the upload directory

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir); // Set destination to 'files' directory
        },
        filename: (req, file, cb) => {
            // Create a unique filename using UUID and original file extension
            const uniqueName = uuidv4() + path.extname(file.originalname);
            cb(null, uniqueName);
            console.log(`File saved: ${uniqueName}`);
        }
    });
};

// File filter for PDFs and DOCX files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file if type matches
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false); // Reject file
    }
};

// Multer instance with storage and file filter
const uploadFiles = multer({ 
    storage: createMulterStorage(),
    fileFilter: fileFilter
}).single('filePath'); // Specify the field here

const updateFilesPath = (formData) => {
    if (formData.filePath) {
        formData.filePath = '/' + formData.filePath.replace(/\\/g, '/');
    }
}

// Exporting the configured multer instance
module.exports = { uploadFiles, updateFilesPath };
