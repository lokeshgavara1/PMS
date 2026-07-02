# System Requirements Specification

CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT
SOFTWARE REQUIREMENTS SPECIFICATION
Project Management System
(Extension of tracker.cutm.ac.in)
Document Revision History
Table of Contents
1.  Introduction	4
1.1  Purpose	4
1.2  Scope	4
1.3  Definitions, Acronyms, and Abbreviations	4
1.4  References	5
1.5  Overview	5
2.  Overall Description	6
2.1  Product Perspective	6
2.2  Product Functions (Summary)	6
2.3  User Classes and Characteristics	6
2.4  Operating Environment	7
2.5  Design and Implementation Constraints	7
2.6  Assumptions and Dependencies	7
3.  Functional Requirements	8
3.1  Authentication and User Management	8
3.2  Project Management	8
3.3  Task and Issue Tracking	9
3.4  Planning and Visualisation	10
3.5  Collaboration	10
3.6  Timesheet Integration	11
3.7  Academic-Specific Workflows	11
3.8  Reporting and Analytics	12
3.9  System Administration	12
4.  Non-Functional Requirements	13
4.1  Performance	13
4.2  Availability and Reliability	13
4.3  Security	13
4.4  Usability	14
4.5  Maintainability	14
4.6  Scalability	14
5.  System Constraints	15
6.  External Interface Requirements	16
6.1  User Interfaces	16
6.2  Software Interfaces	16
6.3  Communication Interfaces	16
7.  Key Use Cases	17
UC-01  Student Creates and Submits Academic Project	17
UC-02  Faculty Reviews and Approves Submission	17
UC-03  Project Manager Runs a Sprint	18
UC-04  HOD Reviews Departmental Project Status	18
8.  Data Model Overview	19
8.1  Core Entities	19
8.2  Migration from tracker.cutm.ac.in	19
9.  Implementation Roadmap	20
9.1  Technology Stack Recommendation	20
10. Acceptance Criteria	21
Appendix A:  Glossary	22
Appendix B:  Open Issues and Future Scope	22
1. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the CUTM Project Management System (CUTM-PMS). The system is a full extension of the existing issue tracker at tracker.cutm.ac.in, evolving it into a comprehensive project management platform tailored for Centurion University's academic, research, and administrative workflows.
This document is intended for use by the development team, project stakeholders, faculty administrators, and QA teams involved in designing, building, and validating the system.
1.2 Scope
The CUTM Project Management System (CUTM-PMS) will:
Extend the existing tracker.cutm.ac.in issue/bug tracking functionality
Provide full project lifecycle management — from initiation to closure
Support academic project workflows including student capstone projects, faculty research, and departmental initiatives
Integrate with intern.cutm.ac.in timesheet system for effort tracking
Offer role-based access for Students, Faculty, HODs, Project Mentors, and Administrators
Provide dashboards, Gantt charts, Kanban boards, and reporting capabilities
1.3 Definitions, Acronyms, and Abbreviations
1.4 References
tracker.cutm.ac.in — Existing CUTM Issue Tracker (Base System)
intern.cutm.ac.in — CUTM Timesheet Application
IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications
CUTM Academic Regulations — B.Tech Degree Programme (CBCS)
CUTM IT Infrastructure Policy Document
1.5 Overview
Section 2 provides the overall system description and context. Section 3 defines the functional requirements grouped by module. Section 4 covers non-functional requirements. Section 5 defines system constraints. Section 6 specifies external interface requirements. Section 7 outlines use cases. Section 8 provides data model and schema overview.
2. Overall Description
2.1 Product Perspective
CUTM-PMS is an internal web-based platform that extends the current tracker.cutm.ac.in. The existing tracker provides basic issue logging, status tracking, assignment, and prioritization. CUTM-PMS adds a Project layer above these issues, introducing planning, scheduling, collaboration, and reporting capabilities — all within the CUTM ecosystem and integrated with existing authentication and the timesheet system.
System context:
tracker.cutm.ac.in: Existing issue tracker (to be extended)
intern.cutm.ac.in: Timesheet system (to be integrated)
CUTM SSO / LDAP: Authentication source
CUTM ERP: Academic data (students, batches, departments) — integration planned
Email server: Notifications
2.2 Product Functions (Summary)
2.3 User Classes and Characteristics
2.4 Operating Environment
Web application accessible via modern browsers (Chrome, Firefox, Edge, Safari)
Hosted on CUTM internal servers (on-premise or private cloud)
Responsive design supporting desktop and mobile browsers
Backend: to be built on the same stack as tracker.cutm.ac.in
Database: MySQL / PostgreSQL (extending existing schema)
Integration with CUTM LDAP/SSO for authentication
2.5 Design and Implementation Constraints
Must maintain backward compatibility with all existing tracker.cutm.ac.in data and URLs
Must reuse existing authentication and session management
New modules must integrate with intern.cutm.ac.in via REST API
Must follow CUTM IT security policies and data privacy requirements
System must support at least 5,000 concurrent users (university-wide rollout)
All UI must support English language; Hindi/Odia may be added in a future phase
2.6 Assumptions and Dependencies
The existing tracker.cutm.ac.in codebase and database will be made available for extension
intern.cutm.ac.in will expose a REST API for timesheet data synchronisation
CUTM IT team will provide LDAP/SSO credentials and documentation for integration
Academic calendar data (semesters, batches) will be sourced from CUTM ERP or manual configuration
Email SMTP server will be available for notification sending
3. Functional Requirements
3.1 Authentication and User Management
3.1.1 Login and Single Sign-On
FR-AUTH-01: The system shall authenticate users via the existing CUTM LDAP/SSO.
FR-AUTH-02: Users shall be able to log in using their CUTM credentials (employee ID or roll number + password).
FR-AUTH-03: The system shall support session timeout after 30 minutes of inactivity.
FR-AUTH-04: An admin shall be able to manually create local accounts for external collaborators.
3.1.2 Role-Based Access Control (RBAC)
FR-AUTH-05: The system shall enforce RBAC as defined in Section 2.3.
FR-AUTH-06: Project-level roles (Member, Lead, Viewer) shall override system-level roles within a project.
FR-AUTH-07: An administrator shall be able to assign, modify, or revoke roles for any user.
FR-AUTH-08: All access control decisions shall be logged in an audit trail.
3.2 Project Management
3.2.1 Project Creation and Configuration
FR-PROJ-01: Users with appropriate roles (Faculty, PM, Admin) shall be able to create a new project.
FR-PROJ-02: Each project shall have: Name, Description, Category (Academic / Research / Admin / Infrastructure), Department, Start Date, End Date, Status, and Visibility (Private / Department / Public).
FR-PROJ-03: The system shall support project templates for common project types (e.g., B.Tech Final Year Project, Research Paper, Software Development Sprint).
FR-PROJ-04: Projects shall be archivable without deletion to preserve history.
FR-PROJ-05: A project owner shall be able to clone an existing project structure (without tasks) as a template.
3.2.2 Milestones
FR-PROJ-06: Each project shall support multiple milestones with a name, due date, and linked tasks.
FR-PROJ-07: The system shall send notifications 7 days and 1 day before a milestone due date.
FR-PROJ-08: Milestone completion shall require approval from the assigned reviewer (Faculty / HOD).
3.2.3 Sprints / Iterations
FR-PROJ-09: Projects shall support optional sprint planning with configurable sprint duration (1–4 weeks).
FR-PROJ-10: Tasks shall be assignable to specific sprints from the backlog.
FR-PROJ-11: The system shall automatically close a sprint at end date and move incomplete tasks to the backlog.
FR-PROJ-12: Sprint velocity and burndown data shall be stored for reporting.
3.3 Task and Issue Tracking (Extended from tracker.cutm.ac.in)
3.3.1 Task Creation
FR-TASK-01: Users shall be able to create tasks with: Title, Description, Type (Task / Bug / Feature / Improvement / Research / Submission), Priority (Critical / High / Medium / Low), Status, Assignee(s), Reporter, Due Date, Estimated Hours, Tags/Labels, and Parent Task (for sub-tasks).
FR-TASK-02: All existing issue types from tracker.cutm.ac.in shall be preserved and extended.
FR-TASK-03: Tasks shall support file attachments (PDF, images, code files up to 25 MB).
FR-TASK-04: Tasks shall support rich-text descriptions with inline images and code blocks.
3.3.2 Task Workflow
FR-TASK-05: Each project shall have a configurable workflow with custom statuses (default: Backlog → To Do → In Progress → Review → Done).
FR-TASK-06: Status transitions shall be configurable with optional approval gates.
FR-TASK-07: The system shall support bulk task operations (assign, re-prioritize, close, move to sprint).
FR-TASK-08: Tasks shall support dependencies (Blocks / Blocked By / Relates To / Duplicates).
3.3.3 Sub-Tasks
FR-TASK-09: A task shall support up to 3 levels of sub-tasks.
FR-TASK-10: Parent task progress shall auto-calculate based on sub-task completion percentage.
3.4 Planning and Visualisation
3.4.1 Kanban Board
FR-VIEW-01: The system shall provide a Kanban board view with drag-and-drop task movement between status columns.
FR-VIEW-02: Kanban columns shall be configurable per project workflow.
FR-VIEW-03: Work-in-progress (WIP) limits shall be configurable per column.
3.4.2 Gantt Chart
FR-VIEW-04: The system shall provide an interactive Gantt chart view showing tasks and milestones on a timeline.
FR-VIEW-05: Task bars on the Gantt chart shall be draggable to reschedule.
FR-VIEW-06: Dependencies between tasks shall be rendered as connector lines on the Gantt chart.
FR-VIEW-07: The Gantt chart shall support zoom levels: Day / Week / Month / Quarter.
3.4.3 Calendar View
FR-VIEW-08: A calendar view shall display task due dates and milestones on a monthly/weekly calendar.
3.4.4 Backlog View
FR-VIEW-09: The backlog shall list all unscheduled tasks sortable by priority, creation date, and assignee.
FR-VIEW-10: Users shall be able to drag tasks from the backlog directly into a sprint.
3.5 Collaboration
3.5.1 Comments and Discussions
FR-COLLAB-01: Every task and project shall support threaded comments with rich text and file attachments.
FR-COLLAB-02: Users shall be able to @mention other project members to trigger notifications.
FR-COLLAB-03: Comments shall be editable and deletable by the author within 24 hours.
3.5.2 Activity Feed
FR-COLLAB-04: Every project shall have an activity feed showing all changes (status updates, assignments, comments, file uploads) in chronological order.
FR-COLLAB-05: The activity feed shall be filterable by type (comments only, status changes only, etc.).
3.5.3 Notifications
FR-COLLAB-06: The system shall send in-app and email notifications for: task assignment, @mention, milestone due-date reminders, status change on watched tasks, and submission review requests.
FR-COLLAB-07: Users shall be able to configure their notification preferences per project.
3.6 Timesheet Integration (intern.cutm.ac.in)
FR-TIME-01: Users shall be able to log hours against individual tasks directly within CUTM-PMS.
FR-TIME-02: Logged hours shall sync bidirectionally with the intern.cutm.ac.in timesheet system via REST API.
FR-TIME-03: The system shall display total logged vs. estimated hours per task and per project.
FR-TIME-04: A weekly timesheet summary view shall be available per user.
FR-TIME-05: Project managers shall be able to generate effort reports by team member, task, and date range.
3.7 Academic-Specific Workflows
3.7.1 Student Project Submission
FR-ACAD-01: Students shall be able to create projects linked to their academic batch, semester, and subject.
FR-ACAD-02: Each academic project shall have a submission task type with a deadline enforced by the system.
FR-ACAD-03: Students shall be able to upload final project reports, source code, and presentation files as task attachments.
FR-ACAD-04: The system shall prevent submission after the deadline unless an extension is granted by Faculty.
3.7.2 Faculty Review and Approval
FR-ACAD-05: Faculty mentors shall receive a notification when a student marks a submission task as 'Ready for Review'.
FR-ACAD-06: Faculty shall be able to mark a submission as Approved, Revision Required, or Rejected with review comments.
FR-ACAD-07: HODs shall have a consolidated view of all departmental project submissions and their review status.
3.7.3 Batch and Department Management
FR-ACAD-08: The system shall support grouping projects by Department, Programme (B.Tech, MBA, etc.), Batch/Year, and Semester.
FR-ACAD-09: HODs shall be able to assign faculty mentors to student projects in bulk.
3.8 Reporting and Analytics
FR-RPT-01: The system shall provide a project dashboard showing: open tasks count, overdue tasks, milestone status, sprint progress (burndown), and team workload.
FR-RPT-02: Sprint burndown and burnup charts shall be auto-generated from task data.
FR-RPT-03: The system shall provide a team workload heatmap showing task distribution across members.
FR-RPT-04: Administrators and HODs shall be able to generate a cross-project status report filterable by department, date range, and project type.
FR-RPT-05: All reports shall be exportable to PDF and Excel formats.
FR-RPT-06: An audit log report shall be available to administrators showing all user actions over a configurable time period.
3.9 System Administration
FR-ADMIN-01: Administrators shall be able to manage all users — create, edit, deactivate, and assign system-level roles.
FR-ADMIN-02: Administrators shall be able to configure global workflow templates, issue types, and priority levels.
FR-ADMIN-03: The system shall support bulk user import via CSV (for onboarding new student batches).
FR-ADMIN-04: Administrators shall be able to configure email notification templates.
FR-ADMIN-05: The system shall provide a health dashboard showing server status, API response times, and active sessions.
4. Non-Functional Requirements
4.1 Performance
NFR-PERF-01: Page load time shall not exceed 3 seconds under normal load (up to 500 concurrent users).
NFR-PERF-02: API response time for task CRUD operations shall be under 500ms (95th percentile).
NFR-PERF-03: The system shall support at least 5,000 registered users and 500 concurrent active sessions.
NFR-PERF-04: File uploads up to 25 MB shall complete within 10 seconds on a 10 Mbps connection.
4.2 Availability and Reliability
NFR-AVAIL-01: The system shall achieve 99.5% uptime during academic working hours (6 AM – 11 PM IST).
NFR-AVAIL-02: Planned maintenance windows shall not exceed 2 hours per month and shall be communicated 48 hours in advance.
NFR-AVAIL-03: The system shall implement daily automated database backups with a 30-day retention policy.
NFR-AVAIL-04: Recovery Time Objective (RTO): 4 hours; Recovery Point Objective (RPO): 24 hours.
4.3 Security
NFR-SEC-01: All data transmission shall be over HTTPS (TLS 1.2+).
NFR-SEC-02: Passwords shall be hashed using bcrypt (minimum cost factor 12) before storage.
NFR-SEC-03: The system shall implement CSRF protection on all state-changing API endpoints.
NFR-SEC-04: SQL injection, XSS, and other OWASP Top-10 vulnerabilities shall be addressed in development.
NFR-SEC-05: File upload validation shall check MIME type, extension whitelist, and scan for malware.
NFR-SEC-06: All administrative actions shall be logged with user ID, timestamp, IP address, and action description.
4.4 Usability
NFR-USE-01: The UI shall be responsive and usable on screen sizes from 360px (mobile) to 2560px (large desktop).
NFR-USE-02: New users shall be able to create a project and add their first task within 5 minutes without training.
NFR-USE-03: The system shall provide contextual tooltips and inline help for all major features.
NFR-USE-04: The system shall comply with WCAG 2.1 Level AA accessibility guidelines.
4.5 Maintainability
NFR-MAINT-01: The codebase shall follow consistent coding standards documented in a developer guide.
NFR-MAINT-02: Core business logic shall have at least 80% unit test coverage.
NFR-MAINT-03: All APIs shall be documented using OpenAPI 3.0 (Swagger).
NFR-MAINT-04: The system shall use a database migration tool (e.g., Flyway/Liquibase) for all schema changes.
4.6 Scalability
NFR-SCALE-01: The architecture shall support horizontal scaling of the application tier.
NFR-SCALE-02: The system shall be containerisable (Docker) for deployment flexibility.
NFR-SCALE-03: Database read replicas shall be configurable to support increased read load.
5. System Constraints
6. External Interface Requirements
6.1 User Interfaces
Web application with responsive layout built using a modern frontend framework (React / Vue)
Primary navigation: Sidebar with Projects, My Tasks, Dashboard, Reports, and Admin sections
Kanban board with drag-and-drop interaction
Interactive Gantt chart with zoom, pan, and inline editing
Rich text editor (Markdown + WYSIWYG) for task descriptions and comments
File drag-and-drop upload zone on task detail pages
6.2 Software Interfaces
6.3 Communication Interfaces
All client-server communication over HTTPS (TLS 1.2+)
WebSocket support for real-time activity feed and Kanban board updates
REST API with JSON payloads following OpenAPI 3.0 specification
Email notifications via SMTP with HTML and plain-text fallback
7. Key Use Cases
UC-01: Student Creates and Submits Academic Project
UC-02: Faculty Reviews and Approves Submission
UC-03: Project Manager Runs a Sprint
UC-04: HOD Reviews Departmental Project Status
8. Data Model Overview
8.1 Core Entities
8.2 Migration from tracker.cutm.ac.in
The following migration steps are required to extend the existing tracker schema:
Add projects, milestones, sprints tables with foreign key links to existing issues table
Rename/extend issues table to tasks table with new columns (type, estimate_hours, sprint_id, parent_id)
Add time_logs, attachments (extended), departments, batches tables
Add user_roles and project_members junction tables
Migrate all existing tracker data with project_id = NULL (to appear in a 'Legacy' default project)
Create database views for backward-compatible access to old tracker URLs
9. Implementation Roadmap
9.1 Technology Stack Recommendation
10. Acceptance Criteria
The system shall be considered ready for production release when all of the following acceptance criteria are met:
Appendix A: Glossary
Appendix B: Open Issues and Future Scope