const express = require('express');
const controller = require('../app/controllers/userController');
const verifyToken = require('../app/middlewares/verifyToken');
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/email-verification/:id/:token', controller.emailVerification);
router.delete('/logout', verifyToken, controller.logout);
router.put('/:id', verifyToken, controller.update);
router.post('/:id/change-password', verifyToken, controller.changePassword);
// router.get('/', controller.getAll);
// router.get('/:id', controller.getOne);
// router.delete('/:id', controller.destroy);

module.exports = router;