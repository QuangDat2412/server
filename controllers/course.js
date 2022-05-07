const Course = require('../models/Course');

const add = async (req, res) => {
    const newCourse = new Course({
        ...req.body,
    });
    try {
        await newCourse.save((err, course) => {
            if (err) {
                return res.status(400).json(err);
            } else {
                if (course) {
                    return res.status(200).json(course);
                }
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByModel = async (req, res) => {
    try {
        const result = await Course.find();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    add,
    getByModel,
};
