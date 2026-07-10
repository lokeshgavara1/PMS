const express = require('express');
const router = express.Router({ mergeParams: true });
const sprintController = require('../controllers/sprint.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', sprintController.getProjectSprints);
router.post('/', verifyToken, sprintController.createSprint);
router.patch('/:sprintId', verifyToken, sprintController.updateSprint);
router.delete('/:sprintId', verifyToken, sprintController.deleteSprint);

module.exports = router;
