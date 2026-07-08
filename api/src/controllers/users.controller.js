const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USERS_ERROR',
        message: error.message,
      },
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: error.message,
      },
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { system_role } = req.body;

    if (!system_role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ROLE',
          message: 'system_role is required',
        },
      });
    }

    const validRoles = ['admin', 'hod', 'faculty', 'pm', 'student', 'guest'];
    if (!validRoles.includes(system_role)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        },
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    await user.update({ system_role });

    res.json({
      success: true,
      message: `User role updated to ${system_role}`,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        system_role: user.system_role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: error.message,
      },
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_USER_ERROR',
        message: error.message,
      },
    });
  }
};
