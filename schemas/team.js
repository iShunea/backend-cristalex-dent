const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, required: true },
  linkedin: { type: String, required: true },
  twitter: { type: String, required: true }
});

const teamSchema = new mongoose.Schema({
  id: { type: Number },
  fullName: { type: String, required: true },
  metaKeywords: { type: String, required: true },
  metaDescription: { type: String, required: true },
  job: { type: String, required: true },
  imageSrc: { type: String, required: true },
  socialMedia: { type: socialMediaSchema, required: true }
});

teamSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
