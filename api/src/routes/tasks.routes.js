const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/task.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', taskController.getProjectTasks);
router.post('/', verifyToken, taskController.createTask);
router.get('/:taskId', taskController.getTaskById);
router.patch('/:taskId', verifyToken, taskController.updateTask);
router.patch('/:taskId/status', verifyToken, taskController.updateTaskStatus);
router.delete('/:taskId', verifyToken, taskController.deleteTask);

// Comments routes
router.use('/:taskId/comments', require('./comments.routes'));

// Time logs routes
router.use('/:taskId/timelogs', require('./timelogs.routes'));

module.exports = router;
