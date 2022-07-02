const LearningCourse = require('../models/LearningCourse');

const register = async (req, res) => {
    try {
        const learningCourse = new LearningCourse({
            ...req.body,
        });
        const savedLesson = await learningCourse.save();
        res.status(200).json(savedLesson);
    } catch (err) {
        res.status(500).json(err);
    }
};
const get = async (req, res) => {
    try {
        const _learningCourse = await LearningCourse.findOne({
            courseId: req.body.courseId,
            userId: req.body.userId,
        }).exec();
        let learningCourse;
        if (req.body.courseId && req.body.userId) {
            learningCourse = _learningCourse;
        }
        res.status(200).json(learningCourse);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByUserId = async (req, res) => {
    try {
        const learningCourse = await LearningCourse.find({
            userId: req.params.id,
        })
            .populate('courseId', '_id name description image code type')
            .exec();
        res.status(200).json(learningCourse);
    } catch (err) {
        res.status(500).json(err);
    }
};
const done = async (req, res) => {
    try {
        await LearningCourse.findOneAndUpdate(
            { courseId: req.body.courseId, userId: req.body.userId },
            { $push: { listLessonId: req.body.lessonId } },
            { new: true }
        );
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    register,
    get,
    done,
    getByUserId,
};
