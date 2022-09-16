const express = require('express');
const controller = require('../app/controllers/projectController');
const router = express.Router();
const verifyToken = require('../app/middlewares/verifyToken');
const adminCheck = require('../app/middlewares/adminCheck');


router.get('/', verifyToken, adminCheck, controller.getAll);
router.post('/', verifyToken, adminCheck, controller.add);
router.get('/published', controller.getAllPublish);
router.get('/published/:url', controller.getOnePublish);
router.get('/:id', verifyToken, adminCheck, controller.getOne);
router.put('/:id', verifyToken, adminCheck, controller.update);
router.delete('/:id', verifyToken, adminCheck, controller.destroy);

module.exports = router;