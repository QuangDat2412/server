const Topic = require('../models/Topic');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Common = require('../constants/common');

const add = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndUpdate(
            req.body._id,
            {
                $set: req.body,
            },
            { new: true }
        );
        if (topic) {
            return res.status(200).json(topic);
        } else {
            const newTopic = new Topic({
                ...req.body,
            });
            const savedTopic = await newTopic.save();
            await Course.findByIdAndUpdate(req.body.courseId, { $push: { listTopics: savedTopic._id } }, { new: true });
            res.status(200).json(savedTopic);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByModel = async (req, res) => {
    try {
        const topic = await Topic.find().populate('courseId', '_id name ').exec();
        let _topic = topic.filter((u) => {
            const result = Common.Search(u.name, req.body.name);
            return result;
        });
        _topic = _topic.map((u) => {
            const _u = u._doc;
            return { ..._u, course: _u.courseId, courseId: _u.courseId._id };
        });

        if (!(req.body.courseId == '0')) {
            _topic = _topic.filter((course) => {
                return course.courseId._id == req.body.courseId;
            });
        }
        res.status(200).json(_topic);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteTopic = async (req, res) => {
    try {
        await Lesson.deleteMany({ topicId: req.params.id }).exec();
        const topic = await Topic.findByIdAndDelete(req.params.id);
        await Course.findByIdAndUpdate(topic.courseId, { $pull: { listTopics: topic._id } });
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
    deleteTopic,
};
