const express = require('express');
const email = require('../app/controllers/email');
const router = express.Router();
const verifyToken = require('../app/middlewares/verifyToken');
const adminCheck = require('../app/middlewares/adminCheck');

router.get('/', verifyToken, adminCheck, email.getAll);
router.post('/', verifyToken, adminCheck, email.add);
router.post('/send',  email.send);
router.put('/:id', verifyToken, adminCheck, email.update);
router.get('/:id', verifyToken, adminCheck, email.getOne);
router.delete('/:id', verifyToken, adminCheck, email.destroy);

module.exports = router;