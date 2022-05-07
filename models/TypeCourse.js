const mongoose = require('mongoose');

const TypeCourseSchema = new mongoose.Schema(
    {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        status: { type: Number, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TypeCourse', TypeCourseSchema);
