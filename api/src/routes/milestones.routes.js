const express = require('express');
const router = express.Router({ mergeParams: true });
const milestoneController = require('../controllers/milestone.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', milestoneController.getProjectMilestones);
router.post('/', verifyToken, milestoneController.createMilestone);
router.patch('/:milestoneId', verifyToken, milestoneController.updateMilestone);
router.delete('/:milestoneId', verifyToken, milestoneController.deleteMilestone);

module.exports = router;
