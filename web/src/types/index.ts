// ============================================================================
// CUTM-PMS TypeScript Type Definitions
// Based on SDD §5.3 Database Design
// ============================================================================

// Enums
export enum SystemRole {
  ADMIN = 'admin',
  HOD = 'hod',
  FACULTY = 'faculty',
  PM = 'pm',
  STUDENT = 'student',
  GUEST = 'guest',
}

export enum ProjectRole {
  OWNER = 'owner',
  LEAD = 'lead',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum ProjectCategory {
  ACADEMIC = 'academic',
  RESEARCH = 'research',
  ADMIN = 'admin',
  INFRASTRUCTURE = 'infrastructure',
}

export enum ProjectVisibility {
  PRIVATE = 'private',
  DEPARTMENT = 'department',
  PUBLIC = 'public',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum TaskType {
  TASK = 'task',
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
  RESEARCH = 'research',
  SUBMISSION = 'submission',
}

export enum TaskPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REVISION_REQUIRED = 'revision_required',
  REJECTED = 'rejected',
}

export enum DependencyType {
  BLOCKS = 'blocks',
  BLOCKED_BY = 'blocked_by',
  RELATES_TO = 'relates_to',
  DUPLICATES = 'duplicates',
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  FAILED = 'failed',
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_MENTIONED = 'task_mentioned',
  MILESTONE_REMINDER = 'milestone_reminder',
  STATUS_CHANGED = 'status_changed',
  REVIEW_REQUESTED = 'review_requested',
  COMMENT = 'comment',
}

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
  system_role: SystemRole;
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
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: ProjectRole;
  joined_at: string;
  updated_at: string;
}

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
}

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
}

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
}

export interface TaskDependency {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: DependencyType;
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
}

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
}

export interface WorkflowConfig {
  id: number;
  project_id: number;
  status_name: string;
  position: number;
  color?: string;
  created_at: string;
  updated_at: string;
}

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
}

export interface ActivityLogEntry {
  id: number;
  entity_type: 'task' | 'project' | 'milestone' | 'comment';
  entity_id: number;
  user_id: number;
  action: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  details?: string;
  ip_address?: string;
  created_at: string;
}

// ============================================================================
// API REQUEST/RESPONSE DTOs
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: true;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  department_id?: number;
  start_date: string;
  end_date: string;
}

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
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
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

// ============================================================================
// API ERROR RESPONSE
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

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
}
