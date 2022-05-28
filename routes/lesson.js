const router = require('express').Router();
const lessonCtrl = require('../controllers/lesson');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, lessonCtrl.add);

module.exports = router;
