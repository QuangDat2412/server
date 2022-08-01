const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        courseId: { type: mongoose.Schema.ObjectId, ref: 'Course' },
        text: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
