const Topic = require('../models/Topic');
const Course = require('../models/Course');
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
const getByCode = async (req, res) => {
    try {
        const course = await Course.find({ code: req.body.code }).populate('type', '_id name description ').exec();
        res.status(200).json(course[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
    getByCode,
};
