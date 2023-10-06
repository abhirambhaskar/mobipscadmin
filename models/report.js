// report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    questionId: String,
    reportMessage: String,
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema, 'report');  // Using 'report' collection

module.exports = Report;
