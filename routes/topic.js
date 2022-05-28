const router = require('express').Router();
const topicCtrl = require('../controllers/topic');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, topicCtrl.add);
router.post('/getByModel', topicCtrl.getByModel);

module.exports = router;
