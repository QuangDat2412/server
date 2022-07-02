const router = require('express').Router();
const courseCtrl = require('../controllers/course');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, courseCtrl.add);
router.post('/getByModel', courseCtrl.getByModel);
router.post('/search', courseCtrl.search);
router.post('/getByCode', courseCtrl.getByCode);
router.delete('/:id', verifyTokenAndAdmin, courseCtrl.deleteCourse);

module.exports = router;
