const router = require('express').Router();
const lessonCtrl = require('../controllers/lesson');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, lessonCtrl.add);
router.post('/adds', verifyTokenAndAdmin, lessonCtrl.addMulti);
router.post('/getByModel', verifyTokenAndAdmin, lessonCtrl.getByModel);
router.delete('/:id', verifyTokenAndAdmin, lessonCtrl.deleteLesson);

module.exports = router;
