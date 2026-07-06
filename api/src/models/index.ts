import { DataTypes, Model, Sequelize } from 'sequelize';

export function initializeModels(sequelize: Sequelize) {
  // User Model
  class User extends Model {
    declare id: number;
    declare email: string;
    declare name: string;
    declare password_hash: string;
    declare system_role: 'admin' | 'hod' | 'faculty' | 'pm' | 'student' | 'guest';
    declare department_id: number;
    declare batch_id?: number;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      system_role: {
        type: DataTypes.ENUM('admin', 'hod', 'faculty', 'pm', 'student', 'guest'),
        allowNull: false,
        defaultValue: 'guest',
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['email'] },
        { fields: ['system_role'] },
        { fields: ['department_id'] },
      ],
    }
  );

  // Department Model
  class Department extends Model {
    declare id: number;
    declare name: string;
    declare code: string;
    declare hod_id?: number;
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      hod_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'departments',
      timestamps: false,
    }
  );

  // Project Model
  class Project extends Model {
    declare id: number;
    declare name: string;
    declare description?: string;
    declare owner_id: number;
    declare category: string;
    declare status: string;
    declare start_date: Date;
    declare end_date: Date;
    declare is_archived: boolean;
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('planning', 'active', 'on-hold', 'completed'),
        defaultValue: 'planning',
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
      completed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['owner_id'] },
        { fields: ['status'] },
        { fields: ['is_archived'] },
      ],
    }
  );

  // Task Model
  class Task extends Model {
    declare id: number;
    declare project_id: number;
    declare sprint_id?: number;
    declare parent_id?: number;
    declare title: string;
    declare description?: string;
    declare type: string;
    declare priority: string;
    declare status: string;
    declare assignee_id?: number;
    declare reporter_id: number;
    declare due_date?: Date;
    declare estimate_hours?: number;
    declare position: number;
    declare is_archived: boolean;
  }

  Task.init(
    {
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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'task',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      estimate_hours: {
        type: DataTypes.DECIMAL(10, 2),
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
      approval_status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      approval_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approval_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approval_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'tasks',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['project_id', 'status'] },
        { fields: ['sprint_id'] },
        { fields: ['assignee_id'] },
        { fields: ['due_date'] },
        { fields: ['approval_status'] },
        { type: 'FULLTEXT', fields: ['title', 'description'] },
      ],
    }
  );

  // Sprint Model
  class Sprint extends Model {
    declare id: number;
    declare project_id: number;
    declare name: string;
    declare start_date: Date;
    declare end_date: Date;
    declare status: string;
    declare velocity?: number;
  }

  Sprint.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
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
      status: {
        type: DataTypes.ENUM('planning', 'active', 'completed'),
        defaultValue: 'planning',
      },
      velocity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'sprints',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['project_id'] }],
    }
  );

  // Comment Model
  class Comment extends Model {
    declare id: number;
    declare task_id: number;
    declare user_id: number;
    declare content: string;
    declare parent_comment_id?: number;
  }

  Comment.init(
    {
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'comments',
      timestamps: true,
      underscored: true,
    }
  );

  // TimeLog Model
  class TimeLog extends Model {
    declare id: number;
    declare task_id: number;
    declare user_id: number;
    declare log_date: Date;
    declare hours: number;
    declare description?: string;
    declare synced_to_timesheet: boolean;
    declare external_id?: string;
    declare sync_status: string;
  }

  TimeLog.init(
    {
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
      log_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      hours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      synced_to_timesheet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      external_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sync_status: {
        type: DataTypes.ENUM('pending', 'synced', 'failed'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      tableName: 'time_logs',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['task_id', 'log_date'] },
        { fields: ['user_id', 'log_date'] },
        { fields: ['synced_to_timesheet'] },
      ],
    }
  );

  // Timesheet Model
  class Timesheet extends Model {
    declare id: number;
    declare user_id: number;
    declare project_id: number;
    declare week_start: Date;
    declare total_hours: number;
  }

  Timesheet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      week_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_hours: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'timesheets',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id', 'project_id', 'week_start'] },
        { fields: ['user_id', 'week_start'] },
      ],
    }
  );

  // Notification Model
  class Notification extends Model {
    declare id: number;
    declare user_id: number;
    declare title: string;
    declare message: string;
    declare type: string;
    declare related_entity_type?: string;
    declare related_entity_id?: number;
    declare is_read: boolean;
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      related_entity_type: {
        type: DataTypes.STRING(50),
      },
      related_entity_id: {
        type: DataTypes.INTEGER,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['user_id', 'is_read'] }],
    }
  );

  // ActivityLog Model
  class ActivityLog extends Model {
    declare id: number;
    declare project_id: number;
    declare user_id: number;
    declare action: string;
    declare entity_type: string;
    declare entity_id: number;
    declare description?: string;
  }

  ActivityLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entity_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: 'activity_log',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['project_id', 'created_at'] }],
    }
  );

  // Set up associations
  User.hasMany(Project, { foreignKey: 'owner_id' });
  Project.belongsTo(User, { foreignKey: 'owner_id' });

  Project.hasMany(Task, { foreignKey: 'project_id' });
  Task.belongsTo(Project, { foreignKey: 'project_id' });

  User.hasMany(Task, { foreignKey: 'assignee_id' });
  Task.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });

  User.hasMany(Task, { foreignKey: 'reporter_id' });
  Task.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });

  Sprint.hasMany(Task, { foreignKey: 'sprint_id' });
  Task.belongsTo(Sprint, { foreignKey: 'sprint_id' });

  User.hasMany(TimeLog, { foreignKey: 'user_id' });
  TimeLog.belongsTo(User, { foreignKey: 'user_id' });

  Task.hasMany(TimeLog, { foreignKey: 'task_id' });
  TimeLog.belongsTo(Task, { foreignKey: 'task_id' });

  Task.hasMany(Comment, { foreignKey: 'task_id' });
  Comment.belongsTo(Task, { foreignKey: 'task_id' });

  User.hasMany(Comment, { foreignKey: 'user_id' });
  Comment.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(Notification, { foreignKey: 'user_id' });
  Notification.belongsTo(User, { foreignKey: 'user_id' });

  return {
    User,
    Department,
    Project,
    Task,
    Sprint,
    Comment,
    TimeLog,
    Timesheet,
    Notification,
    ActivityLog,
  };
}
