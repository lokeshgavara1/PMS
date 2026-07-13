const { Milestone, Project, User } = require('../models');

exports.getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.findAll({
      where: { project_id: projectId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] }],
      order: [['due_date', 'ASC']],
    });

    res.json({ success: true, data: milestones });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_MILESTONES_ERROR', message: error.message },
    });
  }
};

exports.createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, due_date, reviewer_id } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
      });
    }

    const milestone = await Milestone.create({
      project_id: projectId,
      name,
      description,
      due_date,
      reviewer_id,
      status: 'open',
    });

    const milestoneWithUser = await Milestone.findByPk(milestone.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({ success: true, data: milestoneWithUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_MILESTONE_ERROR', message: error.message },
    });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;

    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: { code: 'MILESTONE_NOT_FOUND', message: 'Milestone not found' },
      });
    }

    await milestone.update({ status });

    const updated = await Milestone.findByPk(milestoneId, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] }],
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_MILESTONE_ERROR', message: error.message },
    });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: { code: 'MILESTONE_NOT_FOUND', message: 'Milestone not found' },
      });
    }

    await milestone.destroy();

    res.json({ success: true, message: 'Milestone deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_MILESTONE_ERROR', message: error.message },
    });
  }
};
