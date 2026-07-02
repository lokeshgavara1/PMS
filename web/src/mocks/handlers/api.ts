import { http, HttpResponse } from 'msw';
import { fixtures } from '../fixtures';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  User,
  Project,
  Task,
  Comment,
  TimeLog,
  Notification,
  PaginatedResponse,
  LoginResponse,
  AuthTokens,
} from '../../types/index';
import { TaskStatus } from '../../types/index';

const API_BASE = '/api/v2';

// In-memory store for session data
interface SessionData {
  userId: number;
  isAuthenticated: boolean;
  tokens?: AuthTokens;
}

// Session storage (in real app this would be Redis)
let currentSession: SessionData = {
  userId: 0,
  isAuthenticated: false,
};

// Store for mutations
let store = {
  projects: [...fixtures.projects],
  tasks: [...fixtures.tasks],
  comments: [...fixtures.comments],
  timeLogs: [...fixtures.timeLogs],
  notifications: [...fixtures.notifications],
};

// Helper to validate JWT
function validateAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  // In mock mode, just check if header is present
  return !!authHeader || currentSession.isAuthenticated;
}

// Helper to send error
function sendError(statusCode: number, code: string, message: string, field?: string) {
  const response: ApiErrorResponse = {
    success: false,
    error: { code, message, field: field || null, statusCode },
  };
  return HttpResponse.json(response, { status: statusCode });
}

// Helper to send success
function sendSuccess<T>(data: T, statusCode = 200) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return HttpResponse.json(response, { status: statusCode });
}

export const handlers = [
  // ============================================================================
  // HEALTH CHECK
  // ============================================================================
  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================
  http.post(`${API_BASE}/auth/login`, async (info) => {
    const body = (await info.request.json()) as { email: string; password: string };

    // Find user by email (mock validation)
    const user = fixtures.users.find((u) => u.email === body.email);
    if (!user) {
      return sendError(401, 'AUTH_FAILED', 'Invalid email or password');
    }

    // Generate mock tokens
    const tokens: AuthTokens = {
      accessToken: `mock-jwt-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
      expiresIn: 3600,
    };

    currentSession = {
      userId: user.id,
      isAuthenticated: true,
      tokens,
    };

    const response: LoginResponse = {
      success: true,
      data: { user, tokens },
    };

    return HttpResponse.json(response);
  }),

  http.post(`${API_BASE}/auth/logout`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }
    currentSession = { userId: 0, isAuthenticated: false };
    return sendSuccess({ message: 'Logged out successfully' });
  }),

  http.post(`${API_BASE}/auth/refresh`, async (info) => {
    const body = (await info.request.json()) as { refreshToken: string };
    if (!body.refreshToken) {
      return sendError(400, 'INVALID_REQUEST', 'Refresh token required');
    }

    // Mock token refresh
    const tokens: AuthTokens = {
      accessToken: `mock-jwt-${currentSession.userId}-${Date.now()}`,
      refreshToken: `mock-refresh-${currentSession.userId}-${Date.now()}`,
      expiresIn: 3600,
    };

    return sendSuccess(tokens);
  }),

  // ============================================================================
  // CURRENT USER
  // ============================================================================
  http.get(`${API_BASE}/auth/me`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }
    const user = fixtures.users.find((u) => u.id === currentSession.userId);
    return sendSuccess(user);
  }),

  // ============================================================================
  // PROJECTS
  // ============================================================================
  http.get(`${API_BASE}/projects`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const url = new URL(info.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const projects = store.projects.filter((p) => !p.is_archived);
    const paginated: PaginatedResponse<Project> = {
      data: projects.slice(offset, offset + limit),
      pagination: {
        total: projects.length,
        page,
        limit,
        pages: Math.ceil(projects.length / limit),
      },
    };

    return sendSuccess(paginated);
  }),

  http.get(`${API_BASE}/projects/:id`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.id as string);
    const project = store.projects.find((p) => p.id === projectId);

    if (!project) {
      return sendError(404, 'PROJECT_NOT_FOUND', `Project with ID ${projectId} not found`);
    }

    return sendSuccess(project);
  }),

  http.post(`${API_BASE}/projects`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const body = await info.request.json();
    const newProject: Project = {
      id: Math.max(...store.projects.map((p) => p.id)) + 1,
      owner_id: currentSession.userId,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    store.projects.push(newProject);
    return sendSuccess(newProject, 201);
  }),

  http.patch(`${API_BASE}/projects/:id`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.id as string);
    const project = store.projects.find((p) => p.id === projectId);

    if (!project) {
      return sendError(404, 'PROJECT_NOT_FOUND', `Project with ID ${projectId} not found`);
    }

    const body = await info.request.json();
    const updated = { ...project, ...body, updated_at: new Date().toISOString() };
    Object.assign(project, updated);

    return sendSuccess(project);
  }),

  // ============================================================================
  // TASKS
  // ============================================================================
  http.get(`${API_BASE}/projects/:projectId/tasks`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.projectId as string);
    const url = new URL(info.request.url);
    const sprintId = url.searchParams.get('sprintId');

    let tasks = store.tasks.filter((t) => t.project_id === projectId && !t.is_archived);

    if (sprintId === 'backlog') {
      tasks = tasks.filter((t) => !t.sprint_id);
    } else if (sprintId && sprintId !== 'null') {
      tasks = tasks.filter((t) => t.sprint_id === parseInt(sprintId));
    }

    const paginated: PaginatedResponse<Task> = {
      data: tasks,
      pagination: {
        total: tasks.length,
        page: 1,
        limit: tasks.length,
        pages: 1,
      },
    };

    return sendSuccess(paginated);
  }),

  http.get(`${API_BASE}/tasks/:id`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.id as string);
    const task = store.tasks.find((t) => t.id === taskId);

    if (!task) {
      return sendError(404, 'TASK_NOT_FOUND', `Task with ID ${taskId} not found`);
    }

    return sendSuccess(task);
  }),

  http.post(`${API_BASE}/projects/:projectId/tasks`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.projectId as string);
    const body = await info.request.json();

    const newTask: Task = {
      id: Math.max(...store.tasks.map((t) => t.id), 0) + 1,
      project_id: projectId,
      reporter_id: currentSession.userId,
      position: store.tasks.filter((t) => t.project_id === projectId).length,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    store.tasks.push(newTask);
    return sendSuccess(newTask, 201);
  }),

  http.patch(`${API_BASE}/tasks/:id`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.id as string);
    const task = store.tasks.find((t) => t.id === taskId);

    if (!task) {
      return sendError(404, 'TASK_NOT_FOUND', `Task with ID ${taskId} not found`);
    }

    const body = await info.request.json();

    // Validate status transition
    if (body.status && !isValidStatusTransition(task.status, body.status)) {
      return sendError(
        422,
        'INVALID_STATUS',
        `Cannot transition from ${task.status} to ${body.status}`,
      );
    }

    const updated = { ...task, ...body, updated_at: new Date().toISOString() };
    Object.assign(task, updated);

    return sendSuccess(task);
  }),

  http.patch(`${API_BASE}/tasks/:id/status`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.id as string);
    const task = store.tasks.find((t) => t.id === taskId);

    if (!task) {
      return sendError(404, 'TASK_NOT_FOUND', `Task with ID ${taskId} not found`);
    }

    const body = (await info.request.json()) as { status: TaskStatus };

    if (!isValidStatusTransition(task.status, body.status)) {
      return sendError(
        422,
        'INVALID_STATUS',
        `Cannot transition from ${task.status} to ${body.status}`,
      );
    }

    task.status = body.status;
    task.updated_at = new Date().toISOString();

    return sendSuccess(task);
  }),

  // ============================================================================
  // COMMENTS
  // ============================================================================
  http.get(`${API_BASE}/tasks/:taskId/comments`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.taskId as string);
    const comments = store.comments.filter((c) => c.task_id === taskId);

    return sendSuccess(comments);
  }),

  http.post(`${API_BASE}/tasks/:taskId/comments`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.taskId as string);
    const body = await info.request.json();

    const newComment: Comment = {
      id: Math.max(...store.comments.map((c) => c.id), 0) + 1,
      task_id: taskId,
      user_id: currentSession.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    store.comments.push(newComment);
    return sendSuccess(newComment, 201);
  }),

  // ============================================================================
  // TIME LOGS
  // ============================================================================
  http.get(`${API_BASE}/tasks/:taskId/time-logs`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.taskId as string);
    const logs = store.timeLogs.filter((log) => log.task_id === taskId);

    return sendSuccess(logs);
  }),

  http.post(`${API_BASE}/tasks/:taskId/time-logs`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const taskId = parseInt(info.params.taskId as string);
    const body = await info.request.json();

    const newLog: TimeLog = {
      id: Math.max(...store.timeLogs.map((log) => log.id), 0) + 1,
      task_id: taskId,
      user_id: currentSession.userId,
      synced_to_timesheet: false,
      sync_status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    store.timeLogs.push(newLog);
    return sendSuccess(newLog, 201);
  }),

  // ============================================================================
  // SPRINTS
  // ============================================================================
  http.get(`${API_BASE}/projects/:projectId/sprints`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.projectId as string);
    const sprints = fixtures.sprints.filter((s) => s.project_id === projectId);

    return sendSuccess(sprints);
  }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  http.get(`${API_BASE}/notifications`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const notifications = store.notifications.filter((n) => n.user_id === currentSession.userId);

    return sendSuccess(notifications);
  }),

  http.get(`${API_BASE}/notifications/unread-count`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const count = store.notifications.filter(
      (n) => n.user_id === currentSession.userId && !n.is_read,
    ).length;

    return sendSuccess({ unreadCount: count });
  }),

  // ============================================================================
  // GANTT DATA
  // ============================================================================
  http.get(`${API_BASE}/projects/:projectId/gantt`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.projectId as string);
    const tasks = store.tasks.filter((t) => t.project_id === projectId && !t.is_archived);

    // Format tasks for Gantt chart
    const ganttTasks = tasks.map((task) => ({
      id: task.id,
      name: task.title,
      start: task.due_date ? new Date(task.due_date).getTime() : null,
      duration: task.estimate_hours || 8,
      type: 'task',
      progress: task.status === TaskStatus.DONE ? 100 : 50,
      assignee: task.assignee_id,
      dependencies: fixtures.taskDependencies
        .filter((dep) => dep.task_id === task.id)
        .map((dep) => dep.depends_on_task_id),
    }));

    return sendSuccess({ tasks: ganttTasks });
  }),

  // ============================================================================
  // DASHBOARD DATA
  // ============================================================================
  http.get(`${API_BASE}/projects/:projectId/dashboard`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const projectId = parseInt(info.params.projectId as string);
    const tasks = store.tasks.filter((t) => t.project_id === projectId && !t.is_archived);

    const dashboard = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === TaskStatus.DONE).length,
      overdueTasks: tasks.filter((t) => {
        if (!t.due_date) return false;
        return new Date(t.due_date) < new Date() && t.status !== TaskStatus.DONE;
      }).length,
      inProgressTasks: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    };

    return sendSuccess(dashboard);
  }),

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  http.get(`${API_BASE}/users`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    return sendSuccess({ data: fixtures.users });
  }),

  http.post(`${API_BASE}/users`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const body = await info.request.json();
    const newUser: User = {
      id: Math.max(...fixtures.users.map((u) => u.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };

    return sendSuccess(newUser, 201);
  }),

  http.put(`${API_BASE}/users/:id`, async (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const userId = parseInt(info.params.id as string);
    const body = await info.request.json();

    const user = fixtures.users.find((u) => u.id === userId);
    if (!user) {
      return sendError(404, 'USER_NOT_FOUND', `User with ID ${userId} not found`);
    }

    const updated = { ...user, ...body, updated_at: new Date().toISOString() };
    return sendSuccess(updated);
  }),

  // ============================================================================
  // TIME LOGS - ADMIN
  // ============================================================================
  http.get(`${API_BASE}/time-logs`, (info) => {
    if (!validateAuth(info.request)) {
      return sendError(401, 'UNAUTHORIZED', 'Not authenticated');
    }

    return sendSuccess({ data: store.timeLogs });
  }),
];

// Helper function to validate status transitions
function isValidStatusTransition(from: TaskStatus, to: TaskStatus): boolean {
  const validTransitions: Record<TaskStatus, TaskStatus[]> = {
    [TaskStatus.BACKLOG]: [TaskStatus.TODO],
    [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.BACKLOG],
    [TaskStatus.IN_PROGRESS]: [TaskStatus.REVIEW, TaskStatus.TODO],
    [TaskStatus.REVIEW]: [TaskStatus.DONE, TaskStatus.IN_PROGRESS],
    [TaskStatus.DONE]: [TaskStatus.BACKLOG], // Allow re-opening
  };

  return validTransitions[from]?.includes(to) ?? false;
}
