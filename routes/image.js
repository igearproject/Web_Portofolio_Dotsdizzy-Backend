const express = require('express');
const controller = require('../app/controllers/imageController');
const upload =require('../config/multer');
const router = express.Router();
const verifyToken = require('../app/middlewares/verifyToken');
const adminCheck = require('../app/middlewares/adminCheck');

router.post('/', verifyToken, adminCheck, upload.single("image"),controller.add);
router.get('/', verifyToken, adminCheck, controller.getAll);
router.get('/:id', verifyToken, adminCheck, controller.getOne);
router.put('/:id', verifyToken, adminCheck, controller.update);
router.delete('/:id', verifyToken, adminCheck, controller.destroy);

module.exports = router;