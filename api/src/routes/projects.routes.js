const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', projectController.getAllProjects);
router.post('/', verifyToken, projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', verifyToken, projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);

// Task routes
router.use('/:projectId/tasks', require('./tasks.routes'));

// Milestone routes
router.use('/:projectId/milestones', require('./milestones.routes'));

// Sprint routes
router.use('/:projectId/sprints', require('./sprints.routes'));

module.exports = router;
