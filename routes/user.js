const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');
const userCtrl = require('../controllers/user');
const router = require('express').Router();

router.put('update/:id', verifyTokenAndAdmin, userCtrl.updateUser);
router.delete('/:id', verifyTokenAndAdmin, userCtrl.deleteUser);
router.get('/find/:id', verifyTokenAndAdmin, userCtrl.getUserById);
router.post('/getAll', verifyTokenAndAdmin, userCtrl.getAllUser);
router.post('/addUser', verifyTokenAndAuthorization, userCtrl.newUser);

module.exports = router;
