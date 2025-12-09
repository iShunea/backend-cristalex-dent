const mongoose = require('mongoose');

// Define the Job schema
const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  isInternship: { type: Boolean, required: true },
  jobTitle: { type: String, required: true },
  location: { type: String, required: true },
  metaKeywords: { type: String, required: true },
  metaDescription: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  firstSectionHeading: { type: String, required: true },
  firstSectionList: [String],
  secondSectionHeading: { type: String, required: true},
  secondSectionList: [String],
  thirdSectionHeading: { type: String, required: true},
  thirdSectionList: [String],
  fourthSectionHeading: { type: String, required: true},
  fourthSectionList: [String],
  baseUrl: { type: String, required: true },
});

// Create and export the Job model
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;