const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'  // If you want to allow anonymous feedback
    },
    message: String,
}, { timestamps: true });  // The timestamps option will automatically create `createdAt` and `updatedAt` fields

const Feedback = mongoose.model('Feedback', feedbackSchema, 'feedback');  // Using 'feedback' collection

module.exports = Feedback;
