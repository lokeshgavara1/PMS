const express = require('express');
const router = express.Router({ mergeParams: true });
const timelogController = require('../controllers/timelog.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', timelogController.getTaskTimeLogs);
router.post('/', verifyToken, timelogController.createTimeLog);
router.patch('/:timeLogId', verifyToken, timelogController.updateTimeLog);
router.delete('/:timeLogId', verifyToken, timelogController.deleteTimeLog);

module.exports = router;
