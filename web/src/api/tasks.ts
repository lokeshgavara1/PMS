import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiClient } from './client';
import type { Task, CreateTaskRequest, UpdateTaskStatusRequest, PaginatedResponse } from '../types/index';
import { TaskStatus } from '../types/index';

/**
 * GET /api/v2/tasks
 * Fetch all tasks (fetches from fixture data)
 */
export const useTasks = () => {
  return useQuery<Task[]>(
    ['all-tasks'],
    async () => {
      // Fetch projects first
      const projectsRes = await apiClient.get<{ success: boolean; data: PaginatedResponse<any> }>(
        `/projects`,
      );
      const projects = projectsRes.data.data.data || [];

      const allTasks: Task[] = [];

      // Fetch tasks for each project
      for (const project of projects) {
        const tasksRes = await apiClient.get<{ success: boolean; data: PaginatedResponse<Task> }>(
          `/projects/${project.id}/tasks`,
        );
        allTasks.push(...(tasksRes.data.data.data || []));
      }

      return allTasks;
    },
    {
      staleTime: 2 * 60 * 1000,
    },
  );
};

/**
 * GET /api/v2/projects/:projectId/tasks
 * Fetch tasks for a project (optionally filtered by sprint)
 */
export const useProjectTasks = (projectId: number | null, sprintId?: string) => {
  return useQuery<PaginatedResponse<Task>>(
    ['tasks', { projectId, sprintId }],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Task> }>(
        `/projects/${projectId}/tasks`,
        {
          params: sprintId ? { sprintId } : {},
        },
      );
      return response.data.data;
    },
    {
      enabled: !!projectId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    },
  );
};

/**
 * GET /api/v2/tasks/:id
 * Fetch a single task by ID
 */
export const useTask = (taskId: number | null) => {
  return useQuery<Task>(
    ['task', taskId],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: Task }>(`/tasks/${taskId}`);
      return response.data.data;
    },
    {
      enabled: !!taskId,
      staleTime: 2 * 60 * 1000,
    },
  );
};

/**
 * POST /api/v2/projects/:projectId/tasks
 * Create a new task
 */
export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (taskData: CreateTaskRequest) => {
      const response = await apiClient.post<{ success: boolean; data: Task }>(
        `/projects/${projectId}/tasks`,
        taskData,
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', { projectId }]);
      },
    },
  );
};

/**
 * PATCH /api/v2/tasks/:id
 * Update an existing task
 */
export const useUpdateTask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updates: Partial<Task>) => {
      const response = await apiClient.patch<{ success: boolean; data: Task }>(
        `/tasks/${taskId}`,
        updates,
      );
      return response.data.data;
    },
    {
      onSuccess: (_data) => {
        queryClient.invalidateQueries(['task', taskId]);
        queryClient.invalidateQueries('tasks');
      },
    },
  );
};

/**
 * PATCH /api/v2/tasks/:id/status
 * Update task status with validation
 */
export const useUpdateTaskStatus = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newStatus: TaskStatus) => {
      const response = await apiClient.patch<{ success: boolean; data: Task }>(
        `/tasks/${taskId}/status`,
        { status: newStatus },
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['task', taskId]);
        queryClient.invalidateQueries('tasks');
      },
    },
  );
};

/**
 * GET /api/v2/projects/:projectId/gantt
 * Fetch Gantt chart data for a project
 */
export const useGanttData = (projectId: number | null) => {
  return useQuery<any>(
    ['gantt', projectId],
    async () => {
      const response = await apiClient.get(`/projects/${projectId}/gantt`);
      return response.data.data;
    },
    {
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000,
    },
  );
};
