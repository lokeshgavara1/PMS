const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('task_assigned', 'comment', 'milestone', 'sprint', 'general'),
    defaultValue: 'general',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  related_entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  related_entity_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'Notifications',
  timestamps: true,
  underscored: true,
});

module.exports = Notification;
