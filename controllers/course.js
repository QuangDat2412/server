const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const LearningCourse = require('../models/LearningCourse');
const Topic = require('../models/Topic');
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
        let _courses;
        const courses = await Course.find()
            .populate('type', '_id name description ')
            .populate('listTopics', '_id name description ')
            .exec(async (err, data) => {
                _courses = data.filter((u) => {
                    const result = Common.Search(u.name, req.body.name);
                    return result;
                });
                if (!(req.body.status == 0)) {
                    _courses = _courses.filter((course) => {
                        return course.status === parseInt(req.body.status);
                    });
                }

                let a = await Promise.all(
                    _courses.map(async (item) => {
                        let a = await LearningCourse.find({ courseId: item._id }).exec();
                        item._doc.count = a.length;
                        return await item;
                    })
                );
                console.log(a);
                res.status(200).json(a);
            });
    } catch (err) {
        res.status(500).json(err);
    }
};
const search = async (req, res) => {
    try {
        let _courses;
        const courses = await Course.find().exec(async (err, data) => {
            if (req.body.name === '') {
                _courses = [];
            } else {
                _courses = data.filter((u) => {
                    const result = Common.Search(u.name, req.body.name);
                    return result;
                });
            }
            res.status(200).json(_courses);
        });
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
const deleteCourse = async (req, res) => {
    try {
        const listTopics = await Lesson.find({ courseId: req.params.id }).exec();
        await Promise.all(
            listTopics.map(async (item) => {
                await Lesson.deleteMany({ topicId: item._id }).exec();
            })
        );
        Topic.deleteMany({ courseId: req.params.id }).exec();
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
    search,
    getByCode,
    deleteCourse,
};
