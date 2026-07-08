const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TimeLog = sequelize.define('TimeLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hours_logged: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  log_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  synced_to_timesheet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sync_status: {
    type: DataTypes.ENUM('pending', 'synced', 'failed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'time_logs',
  timestamps: true,
});

module.exports = TimeLog;
