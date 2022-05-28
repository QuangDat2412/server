const router = require('express').Router();
const courseCtrl = require('../controllers/course');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, courseCtrl.add);
router.post('/getByModel', courseCtrl.getByModel);
router.post('/getByCode', courseCtrl.getByCode);

module.exports = router;
