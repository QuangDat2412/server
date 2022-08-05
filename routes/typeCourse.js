const router = require('express').Router();
const typeCourseCtrl = require('../controllers/typeCourse');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, typeCourseCtrl.add);
router.post('/getByModel', typeCourseCtrl.getByModel);

module.exports = router;
