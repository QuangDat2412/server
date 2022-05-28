const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, default: '' },
        type: { type: mongoose.Schema.ObjectId, ref: 'TypeCourse' },
        status: { type: Number, default: 1 },
        listTopics: [{ type: mongoose.Schema.ObjectId, ref: 'Topic' }],
        image: { type: String, default: '' },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
