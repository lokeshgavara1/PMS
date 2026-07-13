const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  system_role: {
    type: DataTypes.ENUM('admin', 'hod', 'faculty', 'pm', 'student', 'guest'),
    defaultValue: 'student',
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  batch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ldap_uid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;
