const Lesson = require('../models/Lesson');
const Comment = require('../models/Comment');
const Common = require('../constants/common');

const add = async (req, res) => {
    try {
        const newLesson = new Comment({
            ...req.body,
        });
        await newLesson.save();
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getByModel = async (req, res) => {
    try {
        const lessons = await Comment.find(req.body).populate('userId', '_id fullName avatar createdAt').exec();

        res.status(200).json(lessons);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
};
