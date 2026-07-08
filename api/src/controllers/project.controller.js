const { Project, User, ProjectMember } = require('../models');

exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Project.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
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
      error: { code: 'GET_PROJECTS_ERROR', message: error.message },
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: ProjectMember, include: [{ model: User, attributes: ['id', 'name', 'email'] }] },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_PROJECT_ERROR', message: error.message },
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, category, visibility, start_date, end_date } = req.body;

    const project = await Project.create({
      name,
      description,
      category,
      visibility,
      start_date,
      end_date,
      owner_id: req.user.id,
    });

    // Add owner as project member
    await ProjectMember.create({
      project_id: project.id,
      user_id: req.user.id,
      role: 'owner',
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_PROJECT_ERROR', message: error.message },
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
      });
    }

    if (project.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only project owner can update' },
      });
    }

    await project.update(req.body);

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_PROJECT_ERROR', message: error.message },
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' },
      });
    }

    if (project.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only project owner can delete' },
      });
    }

    await project.destroy();

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_PROJECT_ERROR', message: error.message },
    });
  }
};
