const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sprint_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('task', 'bug', 'feature', 'improvement', 'research', 'submission'),
    defaultValue: 'task',
  },
  priority: {
    type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('backlog', 'todo', 'in_progress', 'review', 'done'),
    defaultValue: 'backlog',
  },
  assignee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reporter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  milestone_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estimate_hours: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  submission_status: {
    type: DataTypes.ENUM('submitted', 'approved', 'revision_required', 'rejected'),
    allowNull: true,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
