import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiClient } from './client';
import type {
  Comment,
  TimeLog,
  Notification,
  CreateCommentRequest,
  LogTimeRequest,
} from '../types/index';

// ============================================================================
// COMMENTS
// ============================================================================

/**
 * GET /api/v2/tasks/:taskId/comments
 * Fetch all comments for a task
 */
export const useTaskComments = (taskId: number | null) => {
  return useQuery<Comment[]>(
    ['comments', taskId],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: Comment[] }>(
        `/tasks/${taskId}/comments`,
      );
      return response.data.data;
    },
    {
      enabled: !!taskId,
      staleTime: 60 * 1000, // 1 minute
    },
  );
};

/**
 * POST /api/v2/tasks/:taskId/comments
 * Create a new comment on a task
 */
export const useCreateComment = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (commentData: CreateCommentRequest) => {
      const response = await apiClient.post<{ success: boolean; data: Comment }>(
        `/tasks/${taskId}/comments`,
        commentData,
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', taskId]);
      },
    },
  );
};

// ============================================================================
// TIME LOGS
// ============================================================================

/**
 * GET /api/v2/tasks/:taskId/time-logs
 * Fetch all time logs for a task
 */
export const useTaskTimeLogs = (taskId: number | null) => {
  return useQuery<TimeLog[]>(
    ['timeLogs', taskId],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: TimeLog[] }>(
        `/tasks/${taskId}/time-logs`,
      );
      return response.data.data;
    },
    {
      enabled: !!taskId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    },
  );
};

/**
 * POST /api/v2/tasks/:taskId/time-logs
 * Log hours on a task
 */
export const useLogTime = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (logData: LogTimeRequest) => {
      const response = await apiClient.post<{ success: boolean; data: TimeLog }>(
        `/tasks/${taskId}/time-logs`,
        logData,
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['timeLogs', taskId]);
        queryClient.invalidateQueries(['task', taskId]);
      },
    },
  );
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * GET /api/v2/notifications
 * Fetch all notifications for current user
 */
export const useNotifications = () => {
  return useQuery<Notification[]>(
    ['notifications'],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: Notification[] }>(
        '/notifications',
      );
      return response.data.data;
    },
    {
      staleTime: 30 * 1000, // 30 seconds
    },
  );
};

/**
 * GET /api/v2/notifications/unread-count
 * Get count of unread notifications
 */
export const useUnreadNotificationCount = () => {
  return useQuery<{ unreadCount: number }>(
    ['notifications', 'unreadCount'],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: { unreadCount: number } }>(
        '/notifications/unread-count',
      );
      return response.data.data;
    },
    {
      staleTime: 10 * 1000, // 10 seconds - refresh frequently
      refetchInterval: 30 * 1000, // Poll every 30 seconds
    },
  );
};

// ============================================================================
// SPRINTS
// ============================================================================

/**
 * GET /api/v2/projects/:projectId/sprints
 * Fetch all sprints for a project
 */
export const useProjectSprints = (projectId: number | null) => {
  return useQuery<any[]>(
    ['sprints', projectId],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: any[] }>(
        `/projects/${projectId}/sprints`,
      );
      return response.data.data;
    },
    {
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};
