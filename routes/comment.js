const router = require('express').Router();
const commentCtrl = require('../controllers/comment');
const { verifyToken } = require('../verifyToken');

router.post('/add', verifyToken, commentCtrl.add);
router.post('/getByModel', verifyToken, commentCtrl.getByModel);

module.exports = router;
