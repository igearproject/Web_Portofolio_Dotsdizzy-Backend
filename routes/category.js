const express = require('express');
const controller = require('../app/controllers/categoryController');
const router = express.Router();
const verifyToken = require('../app/middlewares/verifyToken');
const adminCheck = require('../app/middlewares/adminCheck');

router.get('/', controller.getAll);
router.post('/', verifyToken, adminCheck, controller.add);
router.get('/:id', controller.getOne);
router.put('/:id', verifyToken, adminCheck, controller.update);
router.delete('/:id', verifyToken, adminCheck, controller.destroy);

module.exports = router;