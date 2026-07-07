export const TaskStatus = {  BACKLOG: 'backlog' as const,  TODO: 'todo' as const,  IN_PROGRESS: 'in_progress' as const,  REVIEW: 'review' as const,  DONE: 'done' as const,
} as const

export const TaskType = {  TASK: 'task' as const,  BUG: 'bug' as const,  FEATURE: 'feature' as const,  IMPROVEMENT: 'improvement' as const,  RESEARCH: 'research' as const,  SUBMISSION: 'submission' as const,
} as const

export const TaskPriority = {  CRITICAL: 'critical' as const,  HIGH: 'high' as const,  MEDIUM: 'medium' as const,  LOW: 'low' as const,
} as const

export const SubmissionStatus = {  SUBMITTED: 'submitted' as const,  APPROVED: 'approved' as const,  REVISION_REQUIRED: 'revision_required' as const,  REJECTED: 'rejected' as const,
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
