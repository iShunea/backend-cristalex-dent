const mongoose = require('mongoose');

// Define the sub-schema for project columns (firstColumnProjects, secondColumnProjects, etc.)
const ProjectSchema = new mongoose.Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true }
}, { _id: false });

// Define the sub-schema for review
const ReviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
    position: { type: String, required: true },
    imageSrc: { type: String, required: true }
}, { _id: false });

// Main Schema
const WorkSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    metaKeywords: { type: String, required: true },
    metaDescription: { type: String, required: true },
    titleImagePath: { type: String, required: true },
    imageLabelSrc: { type: String, required: true },
    workTags: { type: [String], required: true }, // Array of strings
    baseUrl: { type: String, required: true },
    title: { type: String, required: true },
    titleParagraph: { type: String, required: true },
    visitWebsiteLink: { type: String, required: true },
    callToActionTitle: { type: String, required: true },
    callToActionParagraph: { type: String, required: true },
    
    // Arrays for project columns
    firstColumnProjects: { type: [ProjectSchema], required: true },
    secondColumnProjects: { type: [ProjectSchema], required: true },
    thirdColumnProjects: { type: [ProjectSchema], required: true },
    fourthColumnProjects: { type: [ProjectSchema], required: true },

    // Review section
    review: { type: ReviewSchema, required: true }
});

// Model creation
const Work = mongoose.model('Work', WorkSchema);

module.exports = Work;
