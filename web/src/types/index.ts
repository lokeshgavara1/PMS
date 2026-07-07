// ============================================================================
// CUTM-PMS TypeScript Type Definitions
// Based on SDD §5.3 Database Design
// ============================================================================

// Enums
export const SystemRole = {
  ADMIN: 'admin' as const,
  HOD: 'hod' as const,
  FACULTY: 'faculty' as const,
  PM: 'pm' as const,
  STUDENT: 'student' as const,
  GUEST: 'guest' as const,
} as const;

export const ProjectRole = {
  OWNER: 'owner' as const,
  LEAD: 'lead' as const,
  MEMBER: 'member' as const,
  VIEWER: 'viewer' as const,
} as const;

export const ProjectCategory = {
  ACADEMIC: 'academic' as const,
  RESEARCH: 'research' as const,
  ADMIN: 'admin' as const,
  INFRASTRUCTURE: 'infrastructure' as const,
} as const;

export const ProjectVisibility = {
  PRIVATE: 'private' as const,
  DEPARTMENT: 'department' as const,
  PUBLIC: 'public' as const,
} as const;

export const ProjectStatus = {
  PLANNING: 'planning' as const,
  ACTIVE: 'active' as const,
  ON_HOLD: 'on_hold' as const,
  COMPLETED: 'completed' as const,
  ARCHIVED: 'archived' as const,
} as const;

export const TaskType = {
  TASK: 'task' as const,
  BUG: 'bug' as const,
  FEATURE: 'feature' as const,
  IMPROVEMENT: 'improvement' as const,
  RESEARCH: 'research' as const,
  SUBMISSION: 'submission' as const,
} as const;

export const TaskPriority = {
  CRITICAL: 'critical' as const,
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
} as const;

export const TaskStatus = {
  BACKLOG: 'backlog' as const,
  TODO: 'todo' as const,
  IN_PROGRESS: 'in_progress' as const,
  REVIEW: 'review' as const,
  DONE: 'done' as const,
} as const;

export const SubmissionStatus = {
  SUBMITTED: 'submitted' as const,
  APPROVED: 'approved' as const,
  REVISION_REQUIRED: 'revision_required' as const,
  REJECTED: 'rejected' as const,
} as const;

export const DependencyType = {
  BLOCKS: 'blocks' as const,
  BLOCKED_BY: 'blocked_by' as const,
  RELATES_TO: 'relates_to' as const,
  DUPLICATES: 'duplicates' as const,
} as const;

export const SyncStatus = {
  PENDING: 'pending' as const,
  SYNCED: 'synced' as const,
  FAILED: 'failed' as const,
} as const;

export const NotificationType = {
  TASK_ASSIGNED: 'task_assigned' as const,
  TASK_MENTIONED: 'task_mentioned' as const,
  MILESTONE_REMINDER: 'milestone_reminder' as const,
  STATUS_CHANGED: 'status_changed' as const,
  REVIEW_REQUESTED: 'review_requested' as const,
  COMMENT: 'comment' as const,
} as const;

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Department {
  id: number;
  name: string;
  code: string;
  head_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: number;
  name: string;
  programme: string;
  start_year: number;
  end_year: number;
  department_id: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  system_role?: any;
  department_id?: number;
  batch_id?: number;
  ldap_uid: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  category: any;
  visibility: any;
  status: any;
  department_id?: number;
  owner_id: number;
  start_date: string;
  end_date: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: typeof ProjectRole[keyof typeof ProjectRole];
  joined_at: string;
  updated_at: string;
}

export interface Milestone {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  due_date: string;
  status: any;
  reviewer_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: any;
  velocity?: number;
  goal?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  sprint_id?: number;
  parent_id?: number;
  title: string;
  description?: string;
  type: any;
  priority: any;
  status: any;
  assignee_id?: number;
  reporter_id: number;
  milestone_id?: number;
  due_date?: string;
  estimate_hours?: number;
  position: number;
  is_archived: boolean;
  submission_status?: any;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  id: number;
  from_task_id: number;
  to_task_id: number;
  task_id?: number;
  depends_on_task_id?: number;
  dependency_type: any;
  created_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  parent_comment_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TimeLog {
  id: number;
  task_id: number;
  user_id: number;
  hours_logged: number;
  log_date: string;
  description?: string;
  synced_to_timesheet: boolean;
  sync_status: any;
  external_id?: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: any;
  title?: string;
  message: string;
  related_entity_id?: number;
  related_task_id?: number;
  related_project_id?: number;
  related_user_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  old_value?: any;
  new_value?: any;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  changes: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface Submission {
  id: number;
  task_id: number;
  student_id: number;
  submitted_at: string;
  status: any;
  feedback?: string;
  grade?: number;
  created_at: string;
  updated_at: string;
}

export interface Timesheet {
  id: number;
  user_id: number;
  week_start: string;
  total_hours: number;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    field?: string;
    statusCode?: number;
    details?: Record<string, any>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginResponse {
  success: boolean;
  user: User;
  tokens: AuthTokens;
  data?: any;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  type: any;
  priority: any;
  status?: any;
  assignee_id?: number;
  sprint_id?: number;
  milestone_id?: number;
  estimate_hours?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: any;
  visibility: any;
  department_id?: number;
  start_date: string;
  end_date: string;
}

export interface CreateCommentRequest {
  content: string;
  parent_comment_id?: number;
}

export interface LogTimeRequest {
  hours_logged: number;
  log_date: string;
  description?: string;
}

export interface WorkflowConfig {
  id: number;
  project_id?: number;
  name: string;
  status: string;
  status_name?: string;
  position?: number;
  color?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export type ActivityLogEntry = ActivityLog;
