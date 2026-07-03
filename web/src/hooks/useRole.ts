import { useCurrentUser } from '../api';

export type SystemRole = 'admin' | 'hod' | 'faculty' | 'pm' | 'student' | 'guest';

interface RolePermissions {
  canCreateUser: boolean;
  canEditUser: boolean;
  canDeleteUser: boolean;
  canAccessAdmin: boolean;
  canAccessReports: boolean;
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;
  canApproveSubmission: boolean;
  canViewAllUsers: boolean;
  canExportData: boolean;
}

const rolePermissions: Record<SystemRole, RolePermissions> = {
  admin: {
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: true,
    canAccessAdmin: true,
    canAccessReports: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canAssignTask: true,
    canApproveSubmission: true,
    canViewAllUsers: true,
    canExportData: true,
  },
  hod: {
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: false,
    canAccessAdmin: true,
    canAccessReports: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canAssignTask: true,
    canApproveSubmission: true,
    canViewAllUsers: true,
    canExportData: true,
  },
  faculty: {
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canAccessAdmin: false,
    canAccessReports: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canAssignTask: true,
    canApproveSubmission: true,
    canViewAllUsers: false,
    canExportData: false,
  },
  pm: {
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canAccessAdmin: false,
    canAccessReports: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canAssignTask: true,
    canApproveSubmission: false,
    canViewAllUsers: false,
    canExportData: true,
  },
  student: {
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canAccessAdmin: false,
    canAccessReports: false,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canCreateTask: false,
    canEditTask: false,
    canDeleteTask: false,
    canAssignTask: false,
    canApproveSubmission: false,
    canViewAllUsers: false,
    canExportData: false,
  },
  guest: {
    canCreateUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canAccessAdmin: false,
    canAccessReports: false,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canCreateTask: false,
    canEditTask: false,
    canDeleteTask: false,
    canAssignTask: false,
    canApproveSubmission: false,
    canViewAllUsers: false,
    canExportData: false,
  },
};

export function useRole() {
  const { data: user } = useCurrentUser();
  const role: SystemRole = (user?.system_role as SystemRole) || 'guest';

  return {
    role,
    user,
    permissions: rolePermissions[role],
    hasRole: (requiredRoles: SystemRole[]) => requiredRoles.includes(role),
    can: (permission: keyof RolePermissions) => rolePermissions[role][permission],
  };
}
