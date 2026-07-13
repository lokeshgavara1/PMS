# CUTM-PMS Implementation Checklist
## Complete Feature Build - Phases 1-6

**Status:** Starting Phase 1  
**Target Completion:** 6 weeks  
**Last Updated:** 2026-07-10

---

## PHASE 1: PROJECT & TASK CRUD + DASHBOARD (Week 1-2)

### Backend ✅
- [x] Project CRUD APIs (list, create, read, update, delete)
- [x] Task CRUD APIs (list, create, read, update, delete, updateStatus)
- [x] Project members management
- [ ] Milestone CRUD APIs
- [ ] Sprint CRUD APIs
- [ ] Authorization checks for all endpoints
- [ ] Error handling and validation

### Frontend
- [ ] Dashboard page (overview, stats, recent projects)
- [ ] Projects list page (pagination, filters)
- [ ] Project detail page (full layout with tabs)
- [ ] Task detail page (modal or full page)
- [ ] Create project modal/form
- [ ] Create task modal/form
- [ ] Edit task modal
- [ ] Task list view (within project)

### Database
- [x] Project model
- [x] Task model
- [x] ProjectMember model
- [ ] Add indexes for performance
- [ ] Add triggers for audit logging

**TOTAL: 8 items to complete**

---

## PHASE 2: PLANNING VIEWS (Week 3-4)

### Kanban Board
- [ ] Kanban board component
- [ ] Drag-and-drop task movement
- [ ] Status columns (configurable per project)
- [ ] Real-time updates (WebSocket)
- [ ] WIP limit enforcement
- [ ] Quick task preview on hover

### Gantt Chart
- [ ] Gantt chart component (using library)
- [ ] Task rendering with dependencies
- [ ] Timeline zoom (day/week/month/quarter)
- [ ] Milestone rendering
- [ ] Draggable task bars for rescheduling
- [ ] Dependency connector lines

### Calendar View
- [ ] Calendar component
- [ ] Due date visualization
- [ ] Milestone markers
- [ ] Day/week view toggle

### Backlog View
- [ ] Unscheduled tasks list
- [ ] Sortable by priority/date/assignee
- [ ] Drag to sprint functionality
- [ ] Sprint planning interface

**TOTAL: 14 items to complete**

---

## PHASE 3: COLLABORATION (Week 5)

### Comments System
- [ ] Comment API endpoints
- [ ] Frontend comment form
- [ ] Comment thread display
- [ ] @mention parsing
- [ ] Rich text editor (Markdown)
- [ ] Comment edit/delete (within 24h)

### Activity Feed
- [ ] Activity log table in DB
- [ ] Activity logging middleware
- [ ] Activity feed component
- [ ] Filter by action type
- [ ] Real-time activity push (WebSocket)

### Notifications
- [ ] Notification system API
- [ ] Email notification queue
- [ ] In-app notification component
- [ ] Notification preferences page
- [ ] @mention trigger logic

**TOTAL: 13 items to complete**

---

## PHASE 4: TIMESHEET INTEGRATION (Week 6)

### Time Logging
- [ ] TimeLog CRUD APIs
- [ ] Hour logging UI (form in task detail)
- [ ] Weekly timesheet view
- [ ] Logged vs estimated comparison

### Sync with intern.cutm.ac.in
- [ ] HTTP client for external API
- [ ] Push hours to timesheet system
- [ ] Pull hours from timesheet system
- [ ] Bidirectional sync logic
- [ ] Sync status tracking

### Reports
- [ ] Effort reports API
- [ ] Workload heatmap component
- [ ] Hours by member/task/date-range

**TOTAL: 11 items to complete**

---

## PHASE 5: ACADEMIC WORKFLOWS (Week 7)

### Submission System
- [ ] Submission task type
- [ ] Deadline enforcement
- [ ] Extension request workflow
- [ ] File upload handler (PDF, images, code)

### Faculty Review
- [ ] Review request notification
- [ ] Review panel UI (Approve/Revision/Reject)
- [ ] Review comments form
- [ ] Submission file viewer

### Department/Batch Management
- [ ] Batch CRUD APIs
- [ ] Department linking
- [ ] HOD assignment logic
- [ ] Student-to-batch assignment

### HOD Dashboard
- [ ] Departmental project overview
- [ ] Submission status aggregation
- [ ] Drill-down by batch/subject
- [ ] Reminder notification system
- [ ] PDF report export

**TOTAL: 14 items to complete**

---

## PHASE 6: ADMIN & REPORTING (Week 8)

### Admin Dashboard
- [ ] User management page
- [ ] User role assignment UI
- [ ] CSV bulk import
- [ ] Deactivate/activate users

### Email Templates
- [ ] Template management UI
- [ ] Variable substitution system
- [ ] Template editor with preview

### Reporting
- [ ] Project dashboard
- [ ] Burndown chart generation
- [ ] Burnup chart generation
- [ ] Workload distribution report
- [ ] Cross-project status report
- [ ] Audit log report
- [ ] PDF/Excel export

### System Health
- [ ] Health check endpoints
- [ ] Monitoring dashboard
- [ ] Performance metrics display

**TOTAL: 17 items to complete**

---

## GRAND TOTALS
- **Phase 1:** 8 items
- **Phase 2:** 14 items
- **Phase 3:** 13 items
- **Phase 4:** 11 items
- **Phase 5:** 14 items
- **Phase 6:** 17 items
- **TOTAL: 77 items**

---

## TRACKING

### Completed: 0 / 77 (0%)

### In Progress: 
- Starting Phase 1 frontend

### Blocked: None

---

## NEXT STEPS
1. Complete Phase 1 dashboard + project/task pages
2. Add Kanban board component
3. Implement Gantt chart
4. Add comment system
5. Connect timesheet sync
6. Build academic workflows
7. Create reporting engine
8. Deploy admin panel

