// ============================================================================
// CUTM-PMS TypeScript Type Definitions
// Based on SDD §5.3 Database Design
// ============================================================================

// Enums
export const SystemRole = {  ADMIN: 'admin' as const,  HOD: 'hod' as const,  FACULTY: 'faculty' as const,  PM: 'pm' as const,  STUDENT: 'student' as const,  GUEST: 'guest' as const,
} as const

export const ProjectRole = {  OWNER: 'owner' as const,  LEAD: 'lead' as const,  MEMBER: 'member' as const,  VIEWER: 'viewer' as const,
} as const

export const ProjectCategory = {  ACADEMIC: 'academic' as const,  RESEARCH: 'research' as const,  ADMIN: 'admin' as const,  INFRASTRUCTURE: 'infrastructure' as const,
} as const

export const ProjectVisibility = {  PRIVATE: 'private' as const,  DEPARTMENT: 'department' as const,  PUBLIC: 'public' as const,
} as const

export const ProjectStatus = {  PLANNING: 'planning' as const,  ACTIVE: 'active' as const,  ON_HOLD: 'on_hold' as const,  COMPLETED: 'completed' as const,  ARCHIVED: 'archived' as const,
} as const

export const TaskType = {  TASK: 'task' as const,  BUG: 'bug' as const,  FEATURE: 'feature' as const,  IMPROVEMENT: 'improvement' as const,  RESEARCH: 'research' as const,  SUBMISSION: 'submission' as const,
} as const

export const TaskPriority = {  CRITICAL: 'critical' as const,  HIGH: 'high' as const,  MEDIUM: 'medium' as const,  LOW: 'low' as const,
} as const

export const TaskStatus = {  BACKLOG: 'backlog' as const,  TODO: 'todo' as const,  IN_PROGRESS: 'in_progress' as const,  REVIEW: 'review' as const,  DONE: 'done' as const,
} as const

export const SubmissionStatus = {  SUBMITTED: 'submitted' as const,  APPROVED: 'approved' as const,  REVISION_REQUIRED: 'revision_required' as const,  REJECTED: 'rejected' as const,
} as const

export const DependencyType = {  BLOCKS: 'blocks' as const,  BLOCKED_BY: 'blocked_by' as const,  RELATES_TO: 'relates_to' as const,  DUPLICATES: 'duplicates' as const,
} as const

export const SyncStatus = {  PENDING: 'pending' as const,  SYNCED: 'synced' as const,  FAILED: 'failed' as const,
} as const

export const NotificationType = {  TASK_ASSIGNED: 'task_assigned' as const,  TASK_MENTIONED: 'task_mentioned' as const,  MILESTONE_REMINDER: 'milestone_reminder' as const,  STATUS_CHANGED: 'status_changed' as const,  REVIEW_REQUESTED: 'review_requested' as const,  COMMENT: 'comment' as const,
} as const

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
} as const

export interface Batch {
  id: number;
  name: string;
  programme: string;
  start_year: number;
  end_year: number;
  department_id: number;
  created_at: string;
  updated_at: string;
} as const

export interface User {
  id: number;
  email: string;
  name: string;
  system_role: SystemRole;
  department_id?: number;
  batch_id?: number;
  ldap_uid: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
} as const

export interface Project {
  id: number;
  name: string;
  description: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  department_id?: number;
  owner_id: number;
  start_date: string;
  end_date: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
} as const

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: ProjectRole;
  joined_at: string;
  updated_at: string;
} as const

export interface Milestone {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  due_date: string;
  status: TaskStatus;
  reviewer_id?: number;
  created_at: string;
  updated_at: string;
} as const

export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  goal?: string;
  status: 'planning' | 'active' | 'completed';
  velocity?: number;
  created_at: string;
  updated_at: string;
} as const

export interface Task {
  id: number;
  project_id: number;
  sprint_id?: number;
  parent_id?: number;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id?: number;
  reporter_id: number;
  milestone_id?: number;
  due_date?: string;
  estimate_hours?: number;
  position: number;
  is_archived: boolean;
  submission_status?: SubmissionStatus;
  created_at: string;
  updated_at: string;
} as const

export interface TaskDependency {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: DependencyType;
  created_at: string;
} as const

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  parent_comment_id?: number;
  created_at: string;
  updated_at: string;
} as const

export interface Attachment {
  id: number;
  comment_id?: number;
  task_id?: number;
  uploaded_by: number;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
} as const

export interface TimeLog {
  id: number;
  task_id: number;
  user_id: number;
  hours_logged: number;
  log_date: string;
  description?: string;
  synced_to_timesheet: boolean;
  sync_status: SyncStatus;
  external_id?: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
} as const

export interface WorkflowConfig {
  id: number;
  project_id: number;
  status_name: string;
  position: number;
  color?: string;
  created_at: string;
  updated_at: string;
} as const

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  related_task_id?: number;
  related_project_id?: number;
  related_user_id?: number;
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
} as const

export interface ActivityLogEntry {
  id: number;
  entity_type: 'task' | 'project' | 'milestone' | 'comment';
  entity_id: number;
  user_id: number;
  action: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
} as const

export interface AuditLogEntry {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  details?: string;
  ip_address?: string;
  created_at: string;
} as const

// ============================================================================
// API REQUEST/RESPONSE DTOs
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} as const

export interface LoginRequest {
  email: string;
  password: string;
} as const

export interface LoginResponse {
  success: true;
  data: {
    user: User;
    tokens: AuthTokens;
  };
} as const

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  department_id?: number;
  start_date: string;
  end_date: string;
} as const

export interface CreateTaskRequest {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  sprint_id?: number;
  assignee_id?: number;
  due_date?: string;
  estimate_hours?: number;
  parent_id?: number;
} as const

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
} as const

export interface CreateCommentRequest {
  content: string;
  parent_comment_id?: number;
} as const

export interface LogTimeRequest {
  hours_logged: number;
  log_date: string;
  description?: string;
} as const

// ============================================================================
// API ERROR RESPONSE
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  statusCode: number;
} as const

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
} as const

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
} as const

// ============================================================================
// PAGINATED RESPONSE
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
} as const
