const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('academic', 'research', 'admin', 'infrastructure'),
    defaultValue: 'academic',
  },
  visibility: {
    type: DataTypes.ENUM('private', 'department', 'public'),
    defaultValue: 'private',
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'archived'),
    defaultValue: 'planning',
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

module.exports = Project;
