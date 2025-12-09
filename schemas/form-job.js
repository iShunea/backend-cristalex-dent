const mongoose = require('mongoose');

const formJobSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    filePath: { type: String, required: true },
    shortMessage: { type: String }
});

const FormJob = mongoose.model('Form Job', formJobSchema);
module.exports = FormJob;
