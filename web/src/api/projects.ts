import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiClient } from './client';
import type { Project, CreateProjectRequest, PaginatedResponse } from '../types/index';

/**
 * GET /api/v2/projects
 * Fetch all projects (paginated)
 */
export const useProjects = (page = 1, limit = 10) => {
  return useQuery<PaginatedResponse<Project>>(
    ['projects', { page, limit }],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Project> }>(
        '/projects',
        {
          params: { page, limit },
        },
      );
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
};

/**
 * GET /api/v2/projects/:id
 * Fetch a single project by ID
 */
export const useProject = (projectId: number | null) => {
  return useQuery<Project>(
    ['project', projectId],
    async () => {
      const response = await apiClient.get<{ success: boolean; data: Project }>(
        `/projects/${projectId}`,
      );
      return response.data.data;
    },
    {
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000,
    },
  );
};

/**
 * POST /api/v2/projects
 * Create a new project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (projectData: CreateProjectRequest) => {
      const response = await apiClient.post<{ success: boolean; data: Project }>(
        '/projects',
        projectData,
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
      },
    },
  );
};

/**
 * PATCH /api/v2/projects/:id
 * Update an existing project
 */
export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updates: Partial<Project>) => {
      const response = await apiClient.patch<{ success: boolean; data: Project }>(
        `/projects/${projectId}`,
        updates,
      );
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId]);
        queryClient.invalidateQueries('projects');
      },
    },
  );
};

/**
 * GET /api/v2/projects/:id/dashboard
 * Fetch dashboard stats for a project
 */
export const useProjectDashboard = (projectId: number | null) => {
  return useQuery<any>(
    ['project', projectId, 'dashboard'],
    async () => {
      const response = await apiClient.get(`/projects/${projectId}/dashboard`);
      return response.data.data;
    },
    {
      enabled: !!projectId,
      staleTime: 60 * 1000, // 1 minute
    },
  );
};
