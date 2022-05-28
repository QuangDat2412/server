const Course = require('../models/Course');
const Common = require('../constants/common');

const add = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.body._id,
            {
                $set: req.body,
            },
            { new: true }
        )
            .populate('type', '_id name description ')
            .exec();
        if (course) {
            return res.status(200).json(course);
        } else {
            const newCourse = new Course({
                ...req.body,
            });
            const savedCourse = await newCourse.save();
            res.status(200).json(savedCourse);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByModel = async (req, res) => {
    try {
        const courses = await Course.find().populate('type', '_id name description ').exec();
        let _courses = courses.filter((u) => {
            const result = Common.Search(u.name, req.body.name);
            return result;
        });
        if (!(req.body.status == 0)) {
            _courses = _courses.filter((course) => {
                return course.status === parseInt(req.body.status);
            });
        }
        res.status(200).json(_courses);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByCode = async (req, res) => {
    try {
        const course = await Course.findOne({ code: req.body.code })
            .populate('type', '_id name description ')
            .populate({
                path: 'listTopics',
                populate: { path: 'listLessons', model: 'Lesson' },
            })
            .exec();
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
    getByCode,
};
