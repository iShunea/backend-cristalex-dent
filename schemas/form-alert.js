const mongoose = require('mongoose');

const formAlertSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    filePath: { type: String, required: true },
    shortMessage: { type: String },
    errorType: { type: String, required: true }
});

const FormAlert = mongoose.model('Form Alert', formAlertSchema);
module.exports = FormAlert;
