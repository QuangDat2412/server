const router = require('express').Router();
const lcCtrl = require('../controllers/learningCourse');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/register', lcCtrl.register);
router.get('/get/:id', lcCtrl.getByUserId);
router.post('/getOne', lcCtrl.get);
router.post('/done', lcCtrl.done);

module.exports = router;
