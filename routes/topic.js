const router = require('express').Router();
const topicCtrl = require('../controllers/topic');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.post('/add', verifyTokenAndAdmin, topicCtrl.add);
router.post('/getByModel', topicCtrl.getByModel);
router.delete('/:id', verifyTokenAndAdmin, topicCtrl.deleteTopic);

module.exports = router;
