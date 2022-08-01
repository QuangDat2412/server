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
const makeCode = (n) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
// const addMulti = async (req, res) => {
//     try {
//         let a = [
//             '62a3b0b37112fa102125bba3',
//             '62a3babd7112fa102125bc51',
//             '62a3bae07112fa102125bc5b',
//             '62a3baf47112fa102125bc61',
//             '62a3bb177112fa102125bc67',
//             '62dbbe6d1437d5a4bc43566c',
//             '62e3e532a3f411b3b07c9867',
//             '62e3e544a3f411b3b07c9875',
//             '62e3e5fca3f411b3b07c98a3',
//             '62e3e605a3f411b3b07c98a9',
//             '62e3e60da3f411b3b07c98af',
//             '62e3e614a3f411b3b07c98b5',
//             '62e3e61ba3f411b3b07c98bb',
//             '62e3e622a3f411b3b07c98c2',
//             '62e3e654a3f411b3b07c98d0',
//             '62e3e6d7a3f411b3b07c98dc',
//             '62e3e6e2a3f411b3b07c98e2',
//             '62e3e6eaa3f411b3b07c98e9',
//             '62e3e6f4a3f411b3b07c98ee',
//             '62e3e704a3f411b3b07c98f4',
//             '62e3e70fa3f411b3b07c98fa',
//             '62e3e71ba3f411b3b07c9900',
//             '62e3e739a3f411b3b07c9908',
//             '62e3e74da3f411b3b07c9910',
//         ];
//         await Promise.all(
//             a.map(async (topic) => {
//                 await req.body.map(async (e) => {
//                     const newLesson = new Lesson({
//                         ...e,
//                         topicId: topic,
//                         code: makeCode(6),
//                     });
//                     await newLesson.save();
//                 });
//             })
//         );

//         res.status(200).json(true);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };
const addMulti = async (req, res) => {
    try {
        let les = await Lesson.find().exec();
        await Promise.all(
            les.map(async (topic) => {
                await Topic.findByIdAndUpdate(topic.topicId, { $push: { listLessons: topic._id } }, { new: true });
            })
        );
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
// const addMulti = async (req, res) => {
//     try {
//         let les = await Lesson.find().exec();
//         await Promise.all(
//             les.map(async (topic) => {
//                 await Topic.findByIdAndUpdate(topic.topicId, { listLessons: [] }, { new: true });
//             })
//         );
//         res.status(200).json(true);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };
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
    addMulti,
};
