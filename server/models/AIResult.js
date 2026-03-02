const mongoose = require('mongoose');

const AIResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    },
    type: {
        type: String,
        enum: ['summary', 'quiz', 'study_plan', 'chat_response'],
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AIResult', AIResultSchema);
