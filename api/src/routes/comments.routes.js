const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', commentController.getTaskComments);
router.post('/', verifyToken, commentController.createComment);
router.patch('/:commentId', verifyToken, commentController.updateComment);
router.delete('/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;
