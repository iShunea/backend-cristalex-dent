const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  baseUrl: { type: String, required: true },
  title: { type: String, required: true },
  metaKeywords: { type: String, required: true },
  metaDescription: { type: String, required: true },
  imageLabelSrc: { type: String, required: true },
  firstIconPath: { type: String, required: true },
  firstIconTitle: { type: String, required: true },
  firstIconDescription: { type: String, required: true },
  secondIconPath: { type: String, required: true },
  secondIconTitle: { type: String, required: true },
  secondIconDescription: { type: String, required: true },
  imageTitlePath: { type: String, required: true },
  imageTitle: { type: String, required: true },
  imageTitleDescription: { type: String, required: true },
  titleDescription: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
