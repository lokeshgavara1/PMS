const { Comment, User, Task } = require('../models');

exports.getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.findAll({
      where: { task_id: taskId },
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'ASC']],
    });

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_COMMENTS_ERROR', message: error.message },
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_BODY', message: 'Comment body is required' },
      });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    const comment = await Comment.create({
      task_id: taskId,
      author_id: req.user.id,
      body,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({ success: true, data: commentWithUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_COMMENT_ERROR', message: error.message },
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' },
      });
    }

    if (comment.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Can only edit your own comments' },
      });
    }

    await comment.update({ body });

    const updated = await Comment.findByPk(commentId, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_COMMENT_ERROR', message: error.message },
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' },
      });
    }

    if (comment.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Can only delete your own comments' },
      });
    }

    await comment.destroy();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_COMMENT_ERROR', message: error.message },
    });
  }
};
