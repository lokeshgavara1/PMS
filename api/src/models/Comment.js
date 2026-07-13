const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true,
});

module.exports = Comment;
