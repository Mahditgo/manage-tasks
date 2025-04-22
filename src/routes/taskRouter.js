const express = require('express');
const upload = require('../middlewares/upload');
const protectAccessToken = require('./../middlewares/auth.middleware');
const isAdmin = require('./../middlewares/admin.middleware');

const router = express.Router();

const taskController = require('../controllers/task.controller');

// CRUD routes
router.post('/',   protectAccessToken,    upload.single('attachment'), taskController.createTask);
router.get('/',   isAdmin,  protectAccessToken, taskController.getAllTasks);
router.get('/mytasks', protectAccessToken, taskController.getTaskById);
router.put('/:id', protectAccessToken, taskController.updateTask);
router.delete('/:id', protectAccessToken, taskController.deleteTask);


module.exports = router;