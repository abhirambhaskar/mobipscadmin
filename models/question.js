// question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema, 'quiz');

module.exports = Question;
