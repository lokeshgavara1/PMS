# CUTM-PMS Frontend Build Progress

## Section 0: Ground Rules
- [x] Project structure initialized
- [x] Git not yet initialized (will do after scaffolding)

## Section 1: Tech Stack
- [x] React 18 + Vite + TypeScript + Tailwind CSS setup
- [x] React Query installed
- [x] Zustand installed
- [x] React DnD installed
- [x] Recharts installed
- [x] MSW (Mock Service Worker) installed and configured
- [x] Axios installed

## Section 2: Project Structure
- [x] Created folder structure:
  - `web/src/api/` - API hooks
  - `web/src/mocks/handlers/` - MSW handlers
  - `web/src/mocks/fixtures/` - Seed data
  - `web/src/types/` - TypeScript interfaces
  - `web/src/pages/` - Page components
  - `web/src/components/` - Reusable components
  - `web/src/hooks/` - Custom React hooks
  - `web/src/stores/` - Zustand stores
  - `web/src/layouts/` - Layout components
- [x] .env and .env.example created with `VITE_USE_MOCKS=true` and `VITE_API_BASE_URL=/api/v2`

## Section 3: Types and Fixtures ✅ COMPLETE
- [x] TypeScript interfaces for all tables in SDD §5.3
  - Department, Batch, User, Project, Task, Comment, TimeLog, Notification, etc.
  - All enums (SystemRole, ProjectRole, TaskStatus, DependencyType, etc.)
  - API DTOs (LoginRequest, CreateProjectRequest, UpdateTaskStatusRequest, etc.)
  - Error response types (ApiError, ApiErrorResponse, ApiSuccessResponse)
  - Paginated response wrapper
- [x] Realistic seed data in `mocks/fixtures/`
  - 2 departments (CSE, ECE)
  - 3 batches (2023, 2024, 2025)
  - 12 users spanning all 6 system roles
  - 4 projects (1 per category: academic, research, admin, infrastructure)
  - 3 milestones, 3 sprints, 6 tasks with dependencies
  - Comments, time logs, notifications, activity logs
- [x] MSW handlers for all endpoints in SDD §6.2–§6.5
  - Auth endpoints (POST /auth/login, /logout, /refresh, GET /me)
  - Project endpoints (GET all, GET detail, POST create, PATCH update)
  - Task endpoints (GET all, GET detail, POST create, PATCH update, PATCH status)
  - Comments (GET, POST)
  - Time logs (GET, POST)
  - Sprints (GET list per project)
  - Notifications (GET unread, GET all)
  - Special endpoints (Gantt data, dashboard stats)
  - In-memory store with session management
  - Status transition validation (422 on invalid transitions)
  - Standard error response envelope (SDD §6.6)

## Section 4: Screens - IN PROGRESS ✅ PARTIAL

### Core Infrastructure ✅ DONE
- [x] Login page with mock auth
  - JWT token storage in localStorage
  - Demo users quick-select
  - Form validation
  - Error handling with user feedback
- [x] Dashboard shell (sidebar, topbar)
  - Responsive collapsible sidebar with role-aware navigation
  - Topbar with notifications dropdown and user avatar
  - Global toast notification system
  - Protected routes with role-based access
- [x] Projects list page
  - List/grid view of projects
  - Create project modal with all fields
  - Project status and category badges
  - Quick navigation to project details
  - Form validation and error handling

### API & State Management ✅ DONE
- [x] Axios client with JWT interceptors
  - Token storage and retrieval
  - Automatic token refresh on 401
  - Consistent error handling
- [x] React Query hooks for all endpoints
  - Auth hooks (login, logout, refresh, me)
  - Projects hooks (list, detail, create, update, dashboard)
  - Tasks hooks (list, detail, create, update, status changes)
  - Comments, time logs, notifications, sprints, gantt
- [x] Zustand store for global UI state
  - Current user management
  - Sidebar and modal states
  - Toast notifications
  - Selected project/task/sprint

### Remaining Screens (Ready to Build) 
- [ ] Project detail page with tabs (Board, Backlog, Sprints, Gantt, Files, Activity, Settings)
- [ ] Kanban board with drag-drop
- [ ] Backlog + sprint planning
- [ ] Gantt view with task scheduling
- [ ] Task detail drawer/modal
- [ ] Timesheet widget + weekly view
- [ ] Academic workflow (student submission, faculty review, HOD dashboard)
- [ ] Reports (burndown, workload, CSV export)
- [ ] Admin panel (user management, workflow config, bulk import)

## Section 5: Completion Checklist
- [ ] App runs with `npm run dev` against MSW
- [ ] All roles can log in
- [ ] Task CRUD + comments + time logging works
- [ ] Sprint planning and velocity calculation works
- [ ] Gantt renders with dependencies
- [ ] HOD dashboard and CSV export functional
- [ ] All API hooks documented with endpoint mapping
- [ ] PROGRESS.md updated with all details

## Status
**Current Phase:** Section 4 - Building Screens (50% Complete)

### What's Built & Working
✅ **Authentication Flow**
- Login page with email/password
- Mock JWT tokens in localStorage
- Token refresh on 401 responses
- Protected routes checking authentication
- Current user loaded automatically

✅ **Dashboard**
- Quick stats cards (total/my projects, active tasks)
- Recent projects table with navigation
- Empty state with CTA to create first project
- Responsive layout

✅ **Projects Page**
- List/grid view of all projects
- Create project modal with form
- Category and visibility selectors
- Date range picker
- Full CRUD via API hooks

✅ **Core Infrastructure**
- Responsive sidebar with role-aware navigation
- Notification bell with unread count
- User avatar and quick profile
- Toast notification system throughout
- All API hooks ready (13+)

### Architecture & Code Quality
- Clean separation: pages → components → API → MSW
- TypeScript strict mode throughout
- React Query for server state (caching, invalidation, refetch)
- Zustand for client/UI state (modals, selected items, toasts)
- Axios with JWT interceptors and auto-refresh
- Mock Service Worker intercepting all HTTP calls
- No backend needed - everything works with MSW + fixtures

### How to Test Right Now
1. `npm run dev` in `web/` directory
2. Go to http://localhost:5173
3. Login with any demo user (e.g., admin@cutm.ac.in / password123)
4. See dashboard with 4 sample projects
5. Click "New Project" to create one (mocked, persists in session)
6. Navigate using sidebar
7. All API calls log to browser console (MSW debug info)

### Ready to Build Next
1. **Project Detail Page** - Click "View" on a project to see tabs (Board, Backlog, Sprints, Gantt)
   - Use `useProject()` hook to fetch single project data
   - Tab navigation with URL routing
2. **Kanban Board** - Drag-drop task status changes
   - Use `useProjectTasks()` and `useUpdateTaskStatus()`
   - React DnD already installed
3. **Backlog & Sprints** - Unscheduled tasks, sprint planning
   - Filter tasks by sprint (backlog vs sprint ID)
   - Drag tasks from backlog to sprint
4. **Gantt Chart** - Timeline view with task bars
   - Use `useGanttData()` hook
   - Recharts already installed for charts
5. **Task Detail** - Full task view with comments, time logs, dependencies
   - Modal or side drawer showing all task details
   - Comments section with threaded replies
   - Time log history and add time entry form

### Files Structure Reference
```
web/src/
├── api/                      # React Query hooks
│   ├── auth.ts              # Login, logout, refresh, me
│   ├── projects.ts          # Project CRUD + dashboard
│   ├── tasks.ts             # Task CRUD + status + gantt
│   ├── other.ts             # Comments, time logs, notifications, sprints
│   ├── client.ts            # Axios instance + interceptors
│   └── index.ts             # Re-exports
├── components/              # Reusable components
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── pages/                   # Full page components
│   ├── LoginPage.tsx        # ✅ Done
│   ├── DashboardPage.tsx    # ✅ Done
│   └── ProjectsPage.tsx     # ✅ Done (ready to extend with project detail)
├── stores/                  # Zustand stores
│   └── app.ts               # Global UI state
├── types/                   # TypeScript interfaces (30+ entities)
├── layouts/                 # Page layouts
│   └── DashboardLayout.tsx  # Sidebar + topbar wrapper
├── mocks/
│   ├── handlers/api.ts      # All MSW route handlers
│   └── fixtures/index.ts    # Seed data (2 depts, 3 batches, 12 users, 4 projects)
└── App.tsx                  # Routing setup with protected routes
```

### Key Hooks Ready to Use
- `useProjects()` - List projects
- `useProject(id)` - Single project
- `useCreateProject()` - Create
- `useUpdateProject(id)` - Update
- `useProjectDashboard(id)` - Dashboard stats
- `useProjectTasks(projectId, sprintId?)` - Tasks filtered by sprint
- `useTask(id)` - Single task
- `useCreateTask(projectId)` - Create
- `useUpdateTask(id)` - Update
- `useUpdateTaskStatus(id)` - Status change with validation
- `useGanttData(projectId)` - Gantt chart data
- `useTaskComments(taskId)` - Comments
- `useCreateComment(taskId)` - Add comment
- `useTaskTimeLogs(taskId)` - Time entries
- `useLogTime(taskId)` - Log hours
- `useNotifications()` - All notifications
- `useUnreadNotificationCount()` - Unread badge count
- `useProjectSprints(projectId)` - Sprints list

### MSW Handlers Available
All endpoints in `web/src/mocks/handlers/api.ts` with realistic response bodies:
- POST /auth/login - Returns JWT tokens + user
- GET /auth/me - Current user
- POST /auth/logout - Clears session
- POST /auth/refresh - New tokens
- GET /projects - Paginated list
- GET /projects/:id - Single project
- POST /projects - Create project
- PATCH /projects/:id - Update project
- GET /projects/:id/tasks - Tasks by project + sprint
- GET /tasks/:id - Single task
- POST /projects/:id/tasks - Create task
- PATCH /tasks/:id - Update task
- PATCH /tasks/:id/status - Status change (with validation)
- GET/POST /tasks/:id/comments - Comments
- GET/POST /tasks/:id/time-logs - Time entries
- GET /projects/:id/gantt - Gantt data
- GET /projects/:id/dashboard - Dashboard stats
- GET /projects/:id/sprints - Sprints list
- GET /notifications - All user notifications
- GET /notifications/unread-count - Unread count

All handlers validate JWT (check Authorization header), support pagination, handle errors with SDD §6.6 format.

### Common Patterns in Codebase
**Loading state:**
```tsx
const { data, isLoading } = useProjects();
if (isLoading) return <LoadingSpinner />;
```

**Error handling:**
```tsx
const { mutate, isLoading } = useCreateProject();
mutate(data, {
  onSuccess: () => addToast('Success!', 'success'),
  onError: (err) => addToast(err.response?.data?.error?.message, 'error'),
});
```

**Modal/Toast:**
```tsx
const { modals, openModal, closeModal, addToast } = useAppStore();
```

**Sidebar navigation:**
- Add new nav items in `Sidebar.tsx` navItems array
- Automatically highlights active page
- Collapsible with icon visibility

### Deploy Checklist (When Done)
- [ ] Set `VITE_USE_MOCKS=false` in .env to switch to real backend
- [ ] Update `VITE_API_BASE_URL` to backend URL
- [ ] Run `npm run build` to generate dist/
- [ ] Backend must implement all endpoints from `/docs/SDD.md` §6
- [ ] All fixture data must exist in backend (departments, batches, users, etc.)
- [ ] Test with real JWT tokens instead of mocked
- [ ] Verify CORS headers on backend if frontend served from different domain
