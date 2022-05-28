const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, default: '' },
        description: { type: String, default: '' },
        topicId: { type: mongoose.Schema.ObjectId, ref: 'Topic' },
        image: { type: String, default: '' },
        url: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
