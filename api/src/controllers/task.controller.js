const { Task, User } = require('../models');

exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 20, status, priority } = req.query;
    const offset = (page - 1) * limit;

    const where = { project_id: projectId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
      ],
      offset,
      limit: parseInt(limit),
      order: [['position', 'ASC']],
    });

    res.json({
      success: true,
      data: {
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_TASKS_ERROR', message: error.message },
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_TASK_ERROR', message: error.message },
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, type, priority, status, assignee_id, due_date, estimate_hours } = req.body;

    const task = await Task.create({
      project_id: projectId,
      title,
      description,
      type,
      priority,
      status,
      assignee_id,
      reporter_id: req.user.id,
      due_date,
      estimate_hours,
    });

    const taskWithUsers = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({ success: true, data: taskWithUsers });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_TASK_ERROR', message: error.message },
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    await task.update(req.body);

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_TASK_ERROR', message: error.message },
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    await task.update({ status });

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_STATUS_ERROR', message: error.message },
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    await task.destroy();

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_TASK_ERROR', message: error.message },
    });
  }
};
