const router = require('express').Router();
const authCtrl = require('../controllers/auth');

router.post('/register', authCtrl.register);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/sendOtp/:slug', authCtrl.sendMail);
router.post('/login', authCtrl.login);
router.post('/GoogleLogin', authCtrl.googleLogin);

module.exports = router;
