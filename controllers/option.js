const TypeCourse = require('../models/TypeCourse');

const getOptions = async (req, res) => {
    try {
        let typeCourse = await TypeCourse.find();
        if (typeCourse.length === 0) {
            typeCourse = await TypeCourse.insertMany([{ name: 'Khóa học cơ bản' }, { name: 'Khóa học nâng cao' }]);
        }
        const result = { typeCourse };
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    getOptions,
};
