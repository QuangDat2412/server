const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const Common = require('../constants/common');

const add = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.body._id,
            {
                $set: req.body,
            },
            { new: true }
        );
        if (lesson) {
            return res.status(200).json(lesson);
        } else {
            const newLesson = new Lesson({
                ...req.body,
            });
            const savedLesson = await newLesson.save();
            await Topic.findByIdAndUpdate(req.body.topicId, { $push: { listLessons: savedLesson._id } }, { new: true });
            res.status(200).json(savedLesson);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const deleteLesson = async (req, res) => {
    try {
        const a = await Lesson.findByIdAndDelete(req.params.id);
        await Topic.findByIdAndUpdate(a.topicId, { $pull: { listLessons: a._id } }, { new: true });
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByModel = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate({
                path: 'topicId',
                populate: { path: 'courseId', model: 'Course' },
            })
            .exec();

        let _lessons = lessons.filter((u) => {
            const result = Common.Search(u.name, req.body.name);
            return result;
        });
        _lessons = _lessons.map((u) => {
            const _u = u._doc;
            return { ..._u, topic: _u.topicId, topicId: _u.topicId._id, course: _u.topicId.courseId, courseId: _u.topicId.courseId._id };
        });

        _lessons = _lessons.filter((l) => {
            return l.courseId == req.body.courseId;
        });
        if (!(req.body.topicId == '0')) {
            _lessons = _lessons.filter((l) => {
                return l.topicId == req.body.topicId;
            });
        }
        res.status(200).json(_lessons);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
    deleteLesson,
};
