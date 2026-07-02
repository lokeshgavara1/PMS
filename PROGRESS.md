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

## Section 3: Types and Fixtures
- [ ] TypeScript interfaces for all tables in SDD §5.3
- [ ] Realistic seed data in `mocks/fixtures/`
- [ ] MSW handlers for all endpoints in SDD §6.2–§6.5

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
**Current Phase:** Section 2 - Project scaffolding complete, waiting for SRS.md and SDD.md specification documents to proceed with Section 3 (Types and Fixtures).

**Next Steps:**
1. Provide SRS.md and SDD.md files
2. Create TypeScript types based on SDD §5.3
3. Generate seed data in fixtures
4. Implement MSW handlers for all endpoints
5. Build screens in specified order
