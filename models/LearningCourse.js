const mongoose = require('mongoose');

const LearningCourseSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.ObjectId, ref: 'Course' },
        userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        listLessonId: [{ type: mongoose.Schema.ObjectId, ref: 'Lesson' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('LearningCourse', LearningCourseSchema);
