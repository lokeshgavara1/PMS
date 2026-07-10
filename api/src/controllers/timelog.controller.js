const { TimeLog, Task, User } = require('../models');

exports.getTaskTimeLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const timeLogs = await TimeLog.findAll({
      where: { task_id: taskId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
    });

    res.json({ success: true, data: timeLogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_TIMELOGS_ERROR', message: error.message },
    });
  }
};

exports.getUserTimesheet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start_date, end_date } = req.query;

    const where = { user_id: userId };
    if (start_date && end_date) {
      where.date = {
        [require('sequelize').Op.between]: [start_date, end_date],
      };
    }

    const timeLogs = await TimeLog.findAll({
      where,
      include: [
        { model: Task, attributes: ['id', 'title', 'project_id'] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
      order: [['date', 'DESC']],
    });

    const totalHours = timeLogs.reduce((sum, log) => sum + (log.hours || 0), 0);

    res.json({ success: true, data: { timeLogs, totalHours } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_TIMESHEET_ERROR', message: error.message },
    });
  }
};

exports.createTimeLog = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { hours, date, notes } = req.body;

    if (!hours || hours <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_HOURS', message: 'Hours must be greater than 0' },
      });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' },
      });
    }

    const timeLog = await TimeLog.create({
      task_id: taskId,
      user_id: req.user.id,
      hours,
      date: date || new Date().toISOString().split('T')[0],
      notes,
      synced_to_timesheet: false,
    });

    const logWithUser = await TimeLog.findByPk(timeLog.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({ success: true, data: logWithUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_TIMELOG_ERROR', message: error.message },
    });
  }
};

exports.updateTimeLog = async (req, res) => {
  try {
    const { timeLogId } = req.params;
    const { hours, notes } = req.body;

    const timeLog = await TimeLog.findByPk(timeLogId);
    if (!timeLog) {
      return res.status(404).json({
        success: false,
        error: { code: 'TIMELOG_NOT_FOUND', message: 'Time log not found' },
      });
    }

    if (timeLog.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Can only edit your own time logs' },
      });
    }

    await timeLog.update({ hours, notes });

    const updated = await TimeLog.findByPk(timeLogId, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_TIMELOG_ERROR', message: error.message },
    });
  }
};

exports.deleteTimeLog = async (req, res) => {
  try {
    const { timeLogId } = req.params;

    const timeLog = await TimeLog.findByPk(timeLogId);
    if (!timeLog) {
      return res.status(404).json({
        success: false,
        error: { code: 'TIMELOG_NOT_FOUND', message: 'Time log not found' },
      });
    }

    if (timeLog.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Can only delete your own time logs' },
      });
    }

    await timeLog.destroy();

    res.json({ success: true, message: 'Time log deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_TIMELOG_ERROR', message: error.message },
    });
  }
};
