const router = require('express').Router();
const optionCtrl = require('../controllers/option');
const { verifyTokenAndAdmin } = require('../verifyToken');

router.get('/', optionCtrl.getOptions);

module.exports = router;
