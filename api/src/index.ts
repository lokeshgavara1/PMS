import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import sequelize from './config/database';
import redisClient from './config/redis';
import { initializeModels } from './models';
import { MockLdapProvider } from './providers/MockLdapProvider';
import dotenv from 'dotenv';

const jwtSign = (jwt as any).sign;

dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 5000;

// Initialize models
const models = initializeModels(sequelize);
const authProvider = new MockLdapProvider();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware
interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string; system_role: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
  }
};

// ============= ROUTES =============

// Health Check
app.get('/api/v2/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/v2/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_FAILED', message: 'Invalid email or password' },
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_FAILED', message: 'Invalid email or password' },
      });
    }

    const accessToken = jwtSign(
      { id: user.id, email: user.email, name: user.name, system_role: user.system_role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    const refreshToken = jwtSign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, system_role: user.system_role },
        tokens: { accessToken, refreshToken, expiresIn: 3600 },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/auth/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

app.post('/api/v2/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret') as any;
    const user = await models.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'User not found' } });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, system_role: user.system_role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '1h' } as any
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' } as any
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      },
    });
  } catch (err: any) {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: err.message } });
  }
});

app.get('/api/v2/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await models.User.findByPk(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        system_role: user.system_role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Projects Routes
app.get('/api/v2/projects', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await models.Project.findAndCountAll({
      where: { is_archived: false },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/projects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Project not found' },
      });
    }
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/projects', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.create({
      ...req.body,
      owner_id: req.user?.id,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/projects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    await project.update(req.body);
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

// Tasks Routes
app.get('/api/v2/projects/:projectId/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprintId = req.query.sprintId;
    const where: any = { project_id: req.params.projectId, is_archived: false };

    if (sprintId === 'backlog') {
      where.sprint_id = null;
    } else if (sprintId) {
      where.sprint_id = parseInt(sprintId as string);
    }

    const tasks = await models.Task.findAll({
      where,
      include: [{ model: models.User, as: 'assignee' }],
    });

    res.json({
      success: true,
      data: {
        data: tasks,
        pagination: { total: tasks.length, page: 1, limit: tasks.length, pages: 1 },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/tasks/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/projects/:projectId/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.create({
      ...req.body,
      project_id: req.params.projectId,
      reporter_id: req.user?.id,
    });
    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/tasks/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    await task.update(req.body);

    // Log activity
    await models.ActivityLog.create({
      project_id: task.project_id,
      user_id: req.user?.id,
      action: 'updated',
      entity_type: 'task',
      entity_id: task.id,
    });

    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/tasks/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    await task.update({ status: req.body.status });

    // Broadcast via Socket.io (will implement later)
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

// Time Logs Routes
app.get('/api/v2/tasks/:taskId/timelog', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const timeLogs = await models.TimeLog.findAll({
      where: { task_id: req.params.taskId },
      order: [['log_date', 'DESC']],
    });
    res.json({ success: true, data: { data: timeLogs } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/tasks/:taskId/timelog', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const timeLog = await models.TimeLog.create({
      task_id: req.params.taskId,
      user_id: req.user?.id,
      ...req.body,
    });
    res.status(201).json({ success: true, data: timeLog });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.get('/api/v2/time-logs', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const timeLogs = await models.TimeLog.findAll({
      order: [['log_date', 'DESC']],
      limit: 100,
    });
    res.json({ success: true, data: { data: timeLogs } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Notifications Routes
app.get('/api/v2/notifications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await models.Notification.findAll({
      where: { user_id: req.user?.id },
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: { data: notifications } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/notifications/unread-count', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const unreadCount = await models.Notification.count({
      where: { user_id: req.user?.id, is_read: false },
    });
    res.json({ success: true, data: { unreadCount } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/notifications/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await models.Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }
    await notification.update({ is_read: true });
    res.json({ success: true, data: notification });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Comments Routes
app.post('/api/v2/tasks/:taskId/comments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await models.Comment.create({
      task_id: req.params.taskId,
      user_id: req.user?.id,
      ...req.body,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.get('/api/v2/tasks/:taskId/comments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const comments = await models.Comment.findAll({
      where: { task_id: req.params.taskId },
      include: [{ model: models.User }],
      order: [['created_at', 'ASC']],
    });
    res.json({ success: true, data: { data: comments } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= USERS ROUTES =============
app.get('/api/v2/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { count, rows } = await models.User.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      attributes: { exclude: ['password_hash'] },
    });
    res.json({
      success: true,
      data: {
        data: rows,
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await models.User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await models.User.create({
      ...req.body,
      password_hash: hashedPassword,
    });
    res.status(201).json({ success: true, data: { ...user.toJSON(), password_hash: undefined } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await models.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    await user.update(updateData);
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.delete('/api/v2/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await models.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    await user.destroy();
    res.json({ success: true, data: { message: 'User deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= DEPARTMENTS ROUTES =============
app.get('/api/v2/departments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const departments = await models.Department.findAll();
    res.json({ success: true, data: { data: departments } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/departments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const dept = await models.Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Department not found' } });
    res.json({ success: true, data: dept });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/departments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const dept = await models.Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/departments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const dept = await models.Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Department not found' } });
    await dept.update(req.body);
    res.json({ success: true, data: dept });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

// ============= PROJECTS - COMPLETE CRUD =============
app.post('/api/v2/projects', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.create({
      ...req.body,
      owner_id: req.user?.id,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/projects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    await project.update(req.body);
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.delete('/api/v2/projects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await models.Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    await project.destroy();
    res.json({ success: true, data: { message: 'Project deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= TASKS - COMPLETE CRUD =============
app.post('/api/v2/projects/:projectId/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.create({
      ...req.body,
      project_id: req.params.projectId,
      reporter_id: req.user?.id,
    });
    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.get('/api/v2/tasks/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id, {
      include: [
        { model: models.User, as: 'assignee' },
        { model: models.User, as: 'reporter' },
        { model: models.Project },
      ],
    });
    if (!task) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/tasks/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    await task.update(req.body);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.delete('/api/v2/tasks/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    await task.destroy();
    res.json({ success: true, data: { message: 'Task deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= SPRINTS ROUTES =============
app.get('/api/v2/sprints', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprints = await models.Sprint.findAll({
      include: [{ model: models.Project }],
    });
    res.json({ success: true, data: { data: sprints } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.get('/api/v2/projects/:projectId/sprints', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprints = await models.Sprint.findAll({
      where: { project_id: req.params.projectId },
    });
    res.json({ success: true, data: { data: sprints } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/projects/:projectId/sprints', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await models.Sprint.create({
      ...req.body,
      project_id: req.params.projectId,
    });
    res.status(201).json({ success: true, data: sprint });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.patch('/api/v2/sprints/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await models.Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Sprint not found' } });
    await sprint.update(req.body);
    res.json({ success: true, data: sprint });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

app.delete('/api/v2/sprints/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await models.Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Sprint not found' } });
    await sprint.destroy();
    res.json({ success: true, data: { message: 'Sprint deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= SEARCH & FILTER =============
app.get('/api/v2/tasks/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { q, status, priority, assignee_id } = req.query;
    const where: any = {};

    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee_id) where.assignee_id = assignee_id;

    const tasks = await models.Task.findAll({ where });
    res.json({ success: true, data: { data: tasks } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= STATISTICS & ANALYTICS =============
app.get('/api/v2/projects/:projectId/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const totalTasks = await models.Task.count({ where: { project_id: projectId } });
    const completedTasks = await models.Task.count({ where: { project_id: projectId, status: 'done' } });
    const inProgressTasks = await models.Task.count({ where: { project_id: projectId, status: 'in_progress' } });
    const totalHours = await models.Task.sum('estimate_hours', { where: { project_id: projectId } });

    res.json({
      success: true,
      data: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        in_progress_tasks: inProgressTasks,
        completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        total_estimated_hours: totalHours || 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ============= ACTIVITY LOG =============
app.get('/api/v2/activity-log', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { count, rows } = await models.ActivityLog.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
      include: [{ model: models.User }, { model: models.Project }],
    });
    res.json({
      success: true,
      data: {
        data: rows,
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v2/activity-log', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const log = await models.ActivityLog.create({
      ...req.body,
      user_id: req.user?.id,
    });
    res.status(201).json({ success: true, data: log });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
});

// Initialize database and start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`✅ API server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

start();
