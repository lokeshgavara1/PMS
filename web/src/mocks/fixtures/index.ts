import type {
  Department,
  Batch,
  User,
  Project,
  ProjectMember,
  Milestone,
  Sprint,
  Task,
  TaskDependency,
  Comment,
  TimeLog,
  WorkflowConfig,
  Notification,
  ActivityLogEntry,
} from '../../types/index';
import {
  SystemRole,
  ProjectRole,
  ProjectCategory,
  ProjectVisibility,
  ProjectStatus,
  TaskType,
  TaskPriority,
  TaskStatus,
  DependencyType,
  SyncStatus,
  NotificationType,
} from '../../types/index';

// ============================================================================
// DEPARTMENTS
// ============================================================================

export const departments: Department[] = [
  {
    id: 1,
    name: 'Department of Computer Science & Engineering',
    code: 'CSE',
    head_id: 2,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Department of Electronics & Communication Engineering',
    code: 'ECE',
    head_id: 3,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
];

// ============================================================================
// BATCHES
// ============================================================================

export const batches: Batch[] = [
  {
    id: 1,
    name: 'B.Tech CSE 2023-27',
    programme: 'B.Tech',
    start_year: 2023,
    end_year: 2027,
    department_id: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'B.Tech CSE 2024-28',
    programme: 'B.Tech',
    start_year: 2024,
    end_year: 2028,
    department_id: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'B.Tech ECE 2023-27',
    programme: 'B.Tech',
    start_year: 2023,
    end_year: 2027,
    department_id: 2,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
];

// ============================================================================
// USERS (Spanning all 6 roles)
// ============================================================================

export const users: User[] = [
  // Admin
  {
    id: 1,
    email: 'admin@cutm.ac.in',
    name: 'Admin User',
    system_role: SystemRole.ADMIN,
    ldap_uid: 'admin_user',
    is_active: true,
    last_login_at: '2026-07-02T10:00:00Z',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  // HOD
  {
    id: 2,
    email: 'hod.cse@cutm.ac.in',
    name: 'Dr. Rajesh Kumar',
    system_role: SystemRole.HOD,
    department_id: 1,
    ldap_uid: 'rajesh_kumar',
    is_active: true,
    last_login_at: '2026-07-02T09:30:00Z',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 3,
    email: 'hod.ece@cutm.ac.in',
    name: 'Dr. Priya Sharma',
    system_role: SystemRole.HOD,
    department_id: 2,
    ldap_uid: 'priya_sharma',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  // Faculty
  {
    id: 4,
    email: 'faculty1@cutm.ac.in',
    name: 'Prof. Amit Singh',
    system_role: SystemRole.FACULTY,
    department_id: 1,
    ldap_uid: 'amit_singh',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 5,
    email: 'faculty2@cutm.ac.in',
    name: 'Prof. Neha Patel',
    system_role: SystemRole.FACULTY,
    department_id: 1,
    ldap_uid: 'neha_patel',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  // Project Manager
  {
    id: 6,
    email: 'pm@cutm.ac.in',
    name: 'Vikram Desai',
    system_role: SystemRole.PM,
    ldap_uid: 'vikram_desai',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  // Students (batch 2023)
  {
    id: 7,
    email: 'student1@cutm.ac.in',
    name: 'Arjun Verma',
    system_role: SystemRole.STUDENT,
    department_id: 1,
    batch_id: 1,
    ldap_uid: 'arjun_verma',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 8,
    email: 'student2@cutm.ac.in',
    name: 'Sneha Roy',
    system_role: SystemRole.STUDENT,
    department_id: 1,
    batch_id: 1,
    ldap_uid: 'sneha_roy',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 9,
    email: 'student3@cutm.ac.in',
    name: 'Rohan Gupta',
    system_role: SystemRole.STUDENT,
    department_id: 1,
    batch_id: 2,
    ldap_uid: 'rohan_gupta',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  // Guest
  {
    id: 10,
    email: 'guest@external.com',
    name: 'External Collaborator',
    system_role: SystemRole.GUEST,
    ldap_uid: 'external_guest',
    is_active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
];

// ============================================================================
// PROJECTS (4 types: academic, research, admin, infrastructure)
// ============================================================================

export const projects: Project[] = [
  {
    id: 1,
    name: 'B.Tech Final Year Capstone 2027',
    description: 'Final year capstone project for CSE batch 2023',
    category: ProjectCategory.ACADEMIC,
    visibility: ProjectVisibility.DEPARTMENT,
    status: ProjectStatus.ACTIVE,
    department_id: 1,
    owner_id: 4, // Prof. Amit Singh
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    is_archived: false,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'IoT Research Initiative',
    description: 'Research on Internet of Things applications in campus infrastructure',
    category: ProjectCategory.RESEARCH,
    visibility: ProjectVisibility.PUBLIC,
    status: ProjectStatus.ACTIVE,
    department_id: 2,
    owner_id: 5, // Prof. Neha Patel
    start_date: '2025-06-01',
    end_date: '2026-05-31',
    is_archived: false,
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 3,
    name: 'Campus Network Upgrade',
    description: 'Upgrade campus IT infrastructure and network',
    category: ProjectCategory.ADMIN,
    visibility: ProjectVisibility.PRIVATE,
    status: ProjectStatus.PLANNING,
    department_id: 1,
    owner_id: 1, // Admin
    start_date: '2026-07-01',
    end_date: '2026-12-31',
    is_archived: false,
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 4,
    name: 'Library Automation System',
    description: 'Implement automated book management and tracking system',
    category: ProjectCategory.INFRASTRUCTURE,
    visibility: ProjectVisibility.PUBLIC,
    status: ProjectStatus.ACTIVE,
    owner_id: 6, // Vikram Desai (PM)
    start_date: '2026-02-01',
    end_date: '2026-11-30',
    is_archived: false,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
];

// ============================================================================
// PROJECT MEMBERS
// ============================================================================

export const projectMembers: ProjectMember[] = [
  // Project 1 members
  {
    id: 1,
    project_id: 1,
    user_id: 4,
    role: ProjectRole.OWNER,
    joined_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    user_id: 7,
    role: ProjectRole.MEMBER,
    joined_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 3,
    project_id: 1,
    user_id: 8,
    role: ProjectRole.MEMBER,
    joined_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  // Project 2 members
  {
    id: 4,
    project_id: 2,
    user_id: 5,
    role: ProjectRole.OWNER,
    joined_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  // Project 3 members
  {
    id: 5,
    project_id: 3,
    user_id: 1,
    role: ProjectRole.OWNER,
    joined_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 6,
    project_id: 3,
    user_id: 2,
    role: ProjectRole.LEAD,
    joined_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z',
  },
  // Project 4 members
  {
    id: 7,
    project_id: 4,
    user_id: 6,
    role: ProjectRole.OWNER,
    joined_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 8,
    project_id: 4,
    user_id: 9,
    role: ProjectRole.MEMBER,
    joined_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 9,
    project_id: 4,
    user_id: 10,
    role: ProjectRole.VIEWER,
    joined_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
];

// ============================================================================
// MILESTONES
// ============================================================================

export const milestones: Milestone[] = [
  {
    id: 1,
    project_id: 1,
    name: 'Project Proposal Submission',
    description: 'Initial project proposal and feasibility study',
    due_date: '2026-02-28',
    status: TaskStatus.DONE,
    reviewer_id: 4,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    name: 'Design Review',
    description: 'System design review and approval',
    due_date: '2026-04-30',
    status: TaskStatus.IN_PROGRESS,
    reviewer_id: 4,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 3,
    project_id: 1,
    name: 'Final Submission',
    description: 'Project completion and final report submission',
    due_date: '2026-11-30',
    status: TaskStatus.BACKLOG,
    reviewer_id: 4,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
];

// ============================================================================
// SPRINTS
// ============================================================================

export const sprints: Sprint[] = [
  {
    id: 1,
    project_id: 1,
    name: 'Sprint 1 - Setup & Planning',
    description: 'Initial setup, environment configuration, and planning',
    start_date: '2026-01-05',
    end_date: '2026-01-19',
    goal: 'Complete project setup and detailed planning',
    status: 'completed',
    velocity: 21,
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    name: 'Sprint 2 - Core Development',
    description: 'Implement core features and backend services',
    start_date: '2026-01-20',
    end_date: '2026-02-02',
    goal: 'Complete core module implementation',
    status: 'active',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 3,
    project_id: 4,
    name: 'Sprint 1 - Requirements & Design',
    description: 'Gather requirements and create system design',
    start_date: '2026-02-16',
    end_date: '2026-03-01',
    goal: 'Finalize design and get stakeholder approval',
    status: 'planning',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
];

// ============================================================================
// WORKFLOW CONFIGS
// ============================================================================

export const workflowConfigs: WorkflowConfig[] = [
  // Project 1 workflow
  {
    id: 1,
    project_id: 1,
    name: 'Backlog',
    status: 'backlog',
    status_name: 'Backlog',
    position: 0,
    color: '#CCCCCC',
    description: 'Tasks not yet started',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    name: 'To Do',
    status: 'todo',
    status_name: 'To Do',
    position: 1,
    color: '#0066CC',
    description: 'Tasks ready to start',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 3,
    project_id: 1,
    name: 'In Progress',
    status: 'in_progress',
    status_name: 'In Progress',
    position: 2,
    color: '#FFAA00',
    description: 'Tasks currently being worked on',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 4,
    project_id: 1,
    name: 'Review',
    status: 'review',
    status_name: 'Review',
    position: 3,
    color: '#FF6600',
    description: 'Tasks under review',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 5,
    project_id: 1,
    name: 'Done',
    status: 'done',
    status_name: 'Done',
    position: 4,
    color: '#00AA00',
    description: 'Completed tasks',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
];

// ============================================================================
// TASKS
// ============================================================================

export const tasks: Task[] = [
  {
    id: 1,
    project_id: 1,
    sprint_id: 1,
    title: 'Set up project repository',
    description: 'Initialize Git repository and setup CI/CD pipeline',
    type: TaskType.TASK,
    priority: TaskPriority.HIGH,
    status: TaskStatus.DONE,
    assignee_id: 7,
    reporter_id: 4,
    milestone_id: 1,
    due_date: '2026-01-10',
    estimate_hours: 4,
    position: 0,
    is_archived: false,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-08T10:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    sprint_id: 1,
    title: 'Create project documentation',
    description: 'Write README, architecture overview, and setup guide',
    type: TaskType.TASK,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.DONE,
    assignee_id: 8,
    reporter_id: 4,
    due_date: '2026-01-12',
    estimate_hours: 6,
    position: 1,
    is_archived: false,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 3,
    project_id: 1,
    sprint_id: 2,
    title: 'Implement user authentication',
    description: 'Setup JWT-based authentication and user management module',
    type: TaskType.FEATURE,
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.IN_PROGRESS,
    assignee_id: 7,
    reporter_id: 4,
    due_date: '2026-02-02',
    estimate_hours: 12,
    position: 0,
    is_archived: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 4,
    project_id: 1,
    sprint_id: 2,
    title: 'Create task model and API',
    description: 'Define Task entity, create database schema, implement RESTful API',
    type: TaskType.FEATURE,
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    assignee_id: 8,
    reporter_id: 4,
    due_date: '2026-02-02',
    estimate_hours: 16,
    position: 1,
    is_archived: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 5,
    project_id: 1,
    sprint_id: undefined,
    title: 'Setup Kanban board UI',
    description: 'Implement drag-and-drop Kanban board using React',
    type: TaskType.FEATURE,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.BACKLOG,
    assignee_id: undefined,
    reporter_id: 4,
    due_date: '2026-03-30',
    estimate_hours: 20,
    position: 0,
    is_archived: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 6,
    project_id: 4,
    sprint_id: undefined,
    title: 'Gather stakeholder requirements',
    description: 'Conduct meetings with library staff to understand requirements',
    type: TaskType.TASK,
    priority: TaskPriority.HIGH,
    status: TaskStatus.BACKLOG,
    assignee_id: 9,
    reporter_id: 6,
    due_date: '2026-03-15',
    estimate_hours: 8,
    position: 0,
    is_archived: false,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
];

// ============================================================================
// TASK DEPENDENCIES
// ============================================================================

export const taskDependencies: TaskDependency[] = [
  {
    id: 1,
    from_task_id: 3,
    to_task_id: 1,
    dependency_type: DependencyType.BLOCKED_BY,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 2,
    from_task_id: 4,
    to_task_id: 3,
    dependency_type: DependencyType.BLOCKED_BY,
    created_at: '2026-01-20T10:00:00Z',
  },
];

// ============================================================================
// COMMENTS
// ============================================================================

export const comments: Comment[] = [
  {
    id: 1,
    task_id: 1,
    user_id: 4,
    content: 'Great start! Please make sure to setup pre-commit hooks.',
    parent_comment_id: undefined,
    created_at: '2026-01-08T11:00:00Z',
    updated_at: '2026-01-08T11:00:00Z',
  },
  {
    id: 2,
    task_id: 1,
    user_id: 7,
    content: '@Prof. Amit Singh Done! Added pre-commit hooks for linting and testing.',
    parent_comment_id: 1,
    created_at: '2026-01-08T14:30:00Z',
    updated_at: '2026-01-08T14:30:00Z',
  },
  {
    id: 3,
    task_id: 3,
    user_id: 7,
    content: 'Working on JWT implementation. Should be ready for review by end of week.',
    parent_comment_id: undefined,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
];

// ============================================================================
// TIME LOGS
// ============================================================================

export const timeLogs: TimeLog[] = [
  {
    id: 1,
    task_id: 1,
    user_id: 7,
    hours_logged: 3.5,
    log_date: '2026-01-08',
    description: 'Repository setup and CI/CD configuration',
    synced_to_timesheet: true,
    sync_status: SyncStatus.SYNCED,
    external_id: 'TS-12345',
    synced_at: '2026-01-08T15:00:00Z',
    created_at: '2026-01-08T10:00:00Z',
    updated_at: '2026-01-08T15:00:00Z',
  },
  {
    id: 2,
    task_id: 2,
    user_id: 8,
    hours_logged: 5.0,
    log_date: '2026-01-12',
    description: 'Documentation and README updates',
    synced_to_timesheet: true,
    sync_status: SyncStatus.SYNCED,
    external_id: 'TS-12346',
    synced_at: '2026-01-12T16:00:00Z',
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T16:00:00Z',
  },
  {
    id: 3,
    task_id: 3,
    user_id: 7,
    hours_logged: 4.5,
    log_date: '2026-01-25',
    description: 'JWT authentication module - initial implementation',
    synced_to_timesheet: false,
    sync_status: SyncStatus.PENDING,
    created_at: '2026-01-25T16:00:00Z',
    updated_at: '2026-01-25T16:00:00Z',
  },
];

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications: Notification[] = [
  {
    id: 1,
    user_id: 7,
    type: NotificationType.TASK_ASSIGNED,
    related_task_id: 3,
    related_project_id: 1,
    related_user_id: 4,
    message: 'You were assigned to "Implement user authentication"',
    is_read: true,
    read_at: '2026-01-25T11:00:00Z',
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 2,
    user_id: 8,
    type: NotificationType.TASK_ASSIGNED,
    related_task_id: 4,
    related_project_id: 1,
    related_user_id: 4,
    message: 'You were assigned to "Create task model and API"',
    is_read: false,
    created_at: '2026-01-20T10:05:00Z',
  },
  {
    id: 3,
    user_id: 7,
    type: NotificationType.TASK_MENTIONED,
    related_task_id: 1,
    related_project_id: 1,
    related_user_id: 4,
    message: 'Prof. Amit Singh mentioned you in a comment on "Set up project repository"',
    is_read: false,
    created_at: '2026-01-25T14:00:00Z',
  },
];

// ============================================================================
// ACTIVITY LOG
// ============================================================================

export const activityLog: ActivityLogEntry[] = [
  {
    id: 1,
    entity_type: 'task',
    entity_id: 1,
    user_id: 7,
    action: 'status_changed',
    old_value: TaskStatus.TODO,
    new_value: TaskStatus.DONE,
    created_at: '2026-01-08T15:00:00Z',
  },
  {
    id: 2,
    entity_type: 'task',
    entity_id: 3,
    user_id: 7,
    action: 'status_changed',
    old_value: TaskStatus.TODO,
    new_value: TaskStatus.IN_PROGRESS,
    created_at: '2026-01-25T10:00:00Z',
  },
];

// Export all fixtures as a collection
export const fixtures = {
  departments,
  batches,
  users,
  projects,
  projectMembers,
  milestones,
  sprints,
  workflowConfigs,
  tasks,
  taskDependencies,
  comments,
  timeLogs,
  notifications,
  activityLog,
};
