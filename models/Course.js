const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        name: { type: String, default: '' },
        code: { type: String, default: '' },
        // type: { type: mongoose.Schema.ObjectId, ref: 'TypeCourse' },
        type: { type: String, default: '' },
        status: { type: Number, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
