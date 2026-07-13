const sequelize = require('../config/sequelize');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');
const Milestone = require('./Milestone');
const Sprint = require('./Sprint');
const Comment = require('./Comment');
const TimeLog = require('./TimeLog');
const Notification = require('./Notification');

// Define associations
User.hasMany(Project, { foreignKey: 'owner_id' });
Project.belongsTo(User, { foreignKey: 'owner_id' });

Project.hasMany(Task, { foreignKey: 'project_id' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(ProjectMember, { foreignKey: 'project_id' });
ProjectMember.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(ProjectMember, { foreignKey: 'user_id' });
ProjectMember.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Milestone, { foreignKey: 'project_id' });
Milestone.belongsTo(Project, { foreignKey: 'project_id' });

Project.hasMany(Sprint, { foreignKey: 'project_id' });
Sprint.belongsTo(Project, { foreignKey: 'project_id' });

Task.hasMany(Comment, { foreignKey: 'task_id' });
Comment.belongsTo(Task, { foreignKey: 'task_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Task.hasMany(TimeLog, { foreignKey: 'task_id' });
TimeLog.belongsTo(Task, { foreignKey: 'task_id' });

User.hasMany(TimeLog, { foreignKey: 'user_id' });
TimeLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Milestone.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });
User.hasMany(Milestone, { foreignKey: 'reviewer_id' });

Task.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
User.hasMany(Task, { foreignKey: 'assignee_id' });
User.hasMany(Task, { foreignKey: 'reporter_id' });

Task.belongsTo(Sprint, { foreignKey: 'sprint_id' });
Sprint.hasMany(Task, { foreignKey: 'sprint_id' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  ProjectMember,
  Milestone,
  Sprint,
  Comment,
  TimeLog,
  Notification,
};
