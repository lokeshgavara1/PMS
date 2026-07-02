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

## Section 4: Screens
- [ ] Login page with mock auth
- [ ] Dashboard shell (sidebar, topbar)
- [ ] Projects list + create/edit modal
- [ ] Kanban board
- [ ] Backlog + sprint planning
- [ ] Gantt view
- [ ] Task detail drawer
- [ ] Timesheet widget
- [ ] Academic workflow (student/faculty/HOD)
- [ ] Reports (burndown, workload, CSV export)
- [ ] Admin panel

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
**Current Phase:** Section 3 Complete → Starting Section 4 (Building Screens)

**Completed:**
- ✅ Vite + React + TypeScript + Tailwind setup
- ✅ MSW pipeline with Axios + React Query ready
- ✅ All TypeScript types (30+ interfaces, 14 enums)
- ✅ Realistic fixture data (12 users, 4 projects, 6 tasks, etc.)
- ✅ Full MSW handler suite (13+ endpoints, 50+ routes)
- ✅ Dev server running and accessible at http://localhost:5173

**Next: Section 4 - Build Screens in Order**
1. Login page + auth flow → Dashboard shell
2. Projects list + create modal → Project detail tabs
3. Kanban board with drag-drop
4. Backlog + sprint planning
5. Gantt chart view
6. Task detail drawer
7. Timesheet widget
8. Academic workflow (student/faculty/HOD)
9. Reports (burndown, workload, CSV)
10. Admin panel

**Testing Approach:**
- After each screen: run app in dev, test the golden path
- Verify MSW is serving correct mock data
- Check all API calls resolve properly
- Test role-based visibility (admin, hod, faculty, student, pm, guest)
