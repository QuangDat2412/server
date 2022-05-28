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
module.exports = {
    add,
};
