const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        courseId: { type: mongoose.Schema.ObjectId, ref: 'Course' },
        listLessons: [{ type: mongoose.Schema.ObjectId, ref: 'Lesson' }],
        description: { type: String, default: '' },
        image: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Topic', TopicSchema);
