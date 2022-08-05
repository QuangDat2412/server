const TypeCourse = require('../models/TypeCourse');
const Common = require('../constants/common');

const add = async (req, res) => {
    try {
        const typeCourse = await TypeCourse.findByIdAndUpdate(
            req.body._id,
            {
                $set: req.body,
            },
            { new: true }
        );
        if (typeCourse) {
            return res.status(200).json(typeCourse);
        } else {
            const newTypeCourse = new TypeCourse({
                ...req.body,
            });
            const savedTypeCourse = await newTypeCourse.save();
            res.status(200).json(savedTypeCourse);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const getByModel = async (req, res) => {
    try {
        const typeCourse = await TypeCourse.find().exec();
        let _typeCourse = typeCourse.filter((u) => {
            const result = Common.Search(u.name, req.body.name);
            return result;
        });
        res.status(200).json(_typeCourse);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    add,
    getByModel,
};
