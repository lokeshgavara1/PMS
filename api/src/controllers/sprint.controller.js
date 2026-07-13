const { Sprint, Project, Task } = require('../models');
const { Op } = require('sequelize');

exports.getProjectSprints = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sprints = await Sprint.findAll({
      where: { project_id: projectId },
      order: [['start_date', 'DESC']],
    });

    res.json({ success: true, data: sprints });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_SPRINTS_ERROR', message: error.message },
    });
  }
};

exports.createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, start_date, end_date } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
      });
    }

    const sprint = await Sprint.create({
      project_id: projectId,
      name,
      description,
      start_date,
      end_date,
      status: 'active',
    });

    res.status(201).json({ success: true, data: sprint });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_SPRINT_ERROR', message: error.message },
    });
  }
};

exports.updateSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { status, name, description, end_date } = req.body;

    const sprint = await Sprint.findByPk(sprintId);
    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: { code: 'SPRINT_NOT_FOUND', message: 'Sprint not found' },
      });
    }

    await sprint.update({ status, name, description, end_date });

    // If closing sprint, move incomplete tasks to backlog
    if (status === 'closed') {
      await Task.update(
        { sprint_id: null },
        { where: { sprint_id: sprintId, status: { [Op.ne]: 'done' } } }
      );
    }

    const updated = await Sprint.findByPk(sprintId);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_SPRINT_ERROR', message: error.message },
    });
  }
};

exports.deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await Sprint.findByPk(sprintId);
    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: { code: 'SPRINT_NOT_FOUND', message: 'Sprint not found' },
      });
    }

    // Move tasks back to backlog
    await Task.update({ sprint_id: null }, { where: { sprint_id: sprintId } });

    await sprint.destroy();

    res.json({ success: true, message: 'Sprint deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_SPRINT_ERROR', message: error.message },
    });
  }
};
