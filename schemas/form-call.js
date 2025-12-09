const mongoose = require('mongoose');

const formCallSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    filePath: { type: String, required: true },
    shortMessage: { type: String },
    projectType: { type: String, required: true }
});

const FormCall = mongoose.model('Form Call', formCallSchema);
module.exports = FormCall;
