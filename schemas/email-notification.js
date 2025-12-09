const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
})

const EmailNotification = mongoose.model('Email Notification', emailNotificationSchema);
module.exports = EmailNotification;