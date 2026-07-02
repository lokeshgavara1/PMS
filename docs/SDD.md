# System Design Document

CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT
SOFTWARE DESIGN DOCUMENT
Project Management System (CUTM-PMS)
(Extension of tracker.cutm.ac.in)
Document Revision History
Table of Contents
1.  Introduction	4
1.1  Purpose	4
1.2  Scope	4
1.3  Definitions and Abbreviations	4
1.4  References	5
2.  System Overview	6
2.1  System Context	6
2.2  Design Goals and Principles	6
2.3  Constraints and Assumptions	6
3.  Architecture Design	7
3.1  Architectural Style	7
3.2  High-Level Architecture Diagram	7
3.3  Layer Descriptions	8
3.4  Technology Stack	9
4.  Module / Component Design	10
4.1  Authentication & RBAC Module	10
4.2  Project Management Module	10
4.3  Task & Issue Tracking Module	11
4.4  Planning Views Module	11
4.5  Collaboration Module	12
4.6  Timesheet Integration Module	12
4.7  Academic Workflow Module	13
4.8  Reporting & Analytics Module	13
4.9  Notification Module	14
4.10  Administration Module	14
5.  Database Design	15
5.1  Database Architecture	15
5.2  Entity Relationship Overview	15
5.3  Core Table Schemas	16
5.4  Indexes and Performance	20
5.5  Migration Strategy from tracker.cutm.ac.in	20
6.  API Design	21
6.1  API Architecture	21
6.2  Authentication APIs	21
6.3  Project APIs	21
6.4  Task APIs	22
6.5  Timesheet Integration API	22
6.6  Error Response Format	23
7.  User Interface Design	24
7.1  UI Design Principles	24
7.2  Navigation Structure	24
7.3  Key Screen Descriptions	24
7.4  Responsive Breakpoints	25
8.  Security Design	26
8.1  Authentication Flow	26
8.2  Authorisation Model	26
8.3  Data Security	27
8.4  Input Validation	27
9.  Integration Design	28
9.1  CUTM LDAP / SSO Integration	28
9.2  Timesheet (intern.cutm.ac.in) Integration	28
9.3  CUTM ERP Integration (Phase 2)	29
10. Deployment Architecture	30
10.1  Deployment Diagram	30
10.2  Environment Specifications	30
10.3  CI/CD Pipeline	31
11. Error Handling Strategy	32
12. Performance Design	33
Appendix A:  Folder Structure	34
Appendix B:  Coding Standards	34
1. Introduction
1.1 Purpose
This Software Design Document (SDD) describes the architecture, component design, database schema, API contracts, UI structure, security model, and deployment strategy for the CUTM Project Management System (CUTM-PMS). It serves as the authoritative technical reference for developers, architects, DBAs, and QA engineers building or reviewing the system.
This document directly follows from the requirements captured in the CUTM-PMS Software Requirements Specification (SRS) v1.0 and translates those requirements into concrete design decisions.
1.2 Scope
The CUTM-PMS is a web-based project management platform extending tracker.cutm.ac.in. This SDD covers:
System architecture (layered + REST)
All application modules and their internal design
Complete relational database schema
REST API specifications for all major endpoints
UI layout and navigation structure
Security, authentication, and authorisation design
Integration design with CUTM LDAP/SSO and intern.cutm.ac.in
Deployment architecture and CI/CD pipeline
1.3 Definitions and Abbreviations
1.4 References
CUTM-PMS Software Requirements Specification v1.0 (June 2026)
tracker.cutm.ac.in — Existing Issue Tracker (Base System)
intern.cutm.ac.in — CUTM Timesheet API Documentation
IEEE Std 1016-2009: Standard for Information Technology — Systems Design — Software Design Descriptions
OWASP Application Security Verification Standard (ASVS) 4.0
OpenAPI Specification 3.0 — https://spec.openapis.org/oas/v3.0.3
2. System Overview
2.1 System Context
CUTM-PMS operates within the CUTM intranet ecosystem. It extends the existing tracker.cutm.ac.in and interoperates with the CUTM LDAP directory, the intern.cutm.ac.in timesheet system, the CUTM email server, and (in Phase 2) the CUTM ERP for academic data. All services communicate over HTTPS within the CUTM private network.
  ┌─────────────────────────────────────────────────────────────┐
  │                    CUTM Internal Network                    │
  │                                                             │
  │   ┌─────────────┐    HTTPS     ┌───────────────────────┐   │
  │   │  Browser /  │◄────────────►│    CUTM-PMS           │   │
  │   │  Mobile Web │              │  (Web + API Server)   │   │
  │   └─────────────┘              └──────────┬────────────┘   │
  │                                           │                 │
  │          ┌────────────────────────────────┤                 │
  │          │            │          │        │                 │
  │   ┌──────▼───┐ ┌─────▼────┐ ┌───▼───┐ ┌─▼──────────┐     │
  │   │ CUTM     │ │ Timesheet│ │ SMTP  │ │ CUTM ERP   │     │
  │   │ LDAP/SSO │ │ API      │ │ Server│ │ (Phase 2)  │     │
  │   └──────────┘ └──────────┘ └───────┘ └────────────┘     │
  └─────────────────────────────────────────────────────────────┘
2.2 Design Goals and Principles
2.3 Constraints and Assumptions
The existing tracker.cutm.ac.in database schema is available and can be extended (not replaced)
Backend language and framework must be compatible with the existing tracker codebase
CUTM IT will provide LDAP connection details and service account
intern.cutm.ac.in will expose REST endpoints for time entry read/write
Deployment is on CUTM-managed Linux servers (Ubuntu 22.04 LTS)
A Redis-compatible cache server is available or can be provisioned
3. Architecture Design
3.1 Architectural Style
CUTM-PMS uses a Layered Architecture with a RESTful API core. The system is divided into four tiers:
3.2 High-Level Architecture Diagram
  ┌──────────────────────────────────────────────────────────────────┐
  │  PRESENTATION TIER                                               │
  │  React SPA  ─  Kanban Board  ─  Gantt Chart  ─  Dashboards      │
  └───────────────────────┬──────────────────────────────────────────┘
                          │ HTTPS / WebSocket
  ┌───────────────────────▼──────────────────────────────────────────┐
  │  API GATEWAY  (Nginx)                                            │
  │  TLS Termination  │  Rate Limiting  │  Static File Serving       │
  └───────────────────────┬──────────────────────────────────────────┘
                          │ HTTP (internal)
  ┌───────────────────────▼──────────────────────────────────────────┐
  │  APPLICATION TIER                                                │
  │  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
  │  │ Auth &    │ │ Project  │ │ Task &   │ │ Integration        │ │
  │  │ RBAC      │ │ Module   │ │ Planning │ │ Services           │ │
  │  └───────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
  │  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
  │  │ Academic  │ │ Reporting│ │ Notif.   │ │ File Storage Svc   │ │
  │  │ Workflows │ │ Module   │ │ Service  │ │                    │ │
  │  └───────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
  └───────────────────────┬──────────────────────────────────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────────────┐
  │  PERSISTENCE TIER                                                │
  │  MySQL / PostgreSQL (Primary)   Redis (Cache + Sessions)         │
  │  MinIO / NFS File Store         Audit Log Store                  │
  └──────────────────────────────────────────────────────────────────┘
3.3 Layer Descriptions
3.3.1 Presentation Layer
A single-page application (SPA) built with React.js. It communicates exclusively with the Application tier via REST APIs and WebSocket. Key libraries: React Query (data fetching & caching), Zustand (global state), React DnD (Kanban drag-and-drop), DHTMLX Gantt or Frappe Gantt (Gantt chart), Recharts (analytics charts), Tailwind CSS (styling).
3.3.2 API Gateway Layer
Nginx serves as the reverse proxy. Responsibilities: TLS/HTTPS termination using CUTM SSL certificate, routing /api/* requests to the Node.js/PHP application, serving static React build assets from /dist, implementing rate limiting (200 req/min per IP default), gzip compression, and security headers (HSTS, X-Frame-Options, CSP).
3.3.3 Application Layer
The core business logic server. It implements a Controller → Service → Repository pattern. Controllers handle HTTP routing and input validation. Services implement business rules. Repositories abstract database access via an ORM (Sequelize for Node.js / Eloquent for Laravel). A separate WebSocket server (Socket.io) handles real-time activity feeds and Kanban board sync.
3.3.4 Persistence Layer
Primary data store: MySQL 8.0+ or PostgreSQL 15+ (to match existing tracker database). Redis 7 is used for: JWT session blacklisting, notification queues, API response caching (TTL-based), and WebSocket room state. File attachments are stored in MinIO (self-hosted S3-compatible) or CUTM NFS, not in the database.
3.4 Technology Stack
4. Module / Component Design
Each module follows the Controller → Service → Repository (CSR) pattern. Modules communicate via well-defined service interfaces; they do not call each other's repositories directly.
4.1 Authentication & RBAC Module
Login Flow: User submits credentials → AuthService binds to CUTM LDAP → on success, upserts user record → issues JWT (access token, 1h) + refresh token (7d, stored in Redis) → returns tokens to client.
4.2 Project Management Module
4.3 Task & Issue Tracking Module
4.4 Planning Views Module
4.5 Collaboration Module
4.6 Timesheet Integration Module
4.7 Academic Workflow Module
4.8 Reporting & Analytics Module
4.9 Notification Module
4.10 Administration Module
5. Database Design
5.1 Database Architecture
A single MySQL 8.0+ relational database extends the existing tracker.cutm.ac.in schema. A read replica is recommended for reporting queries to offload the primary. Redis handles sessions, queue jobs, and transient cache — not persisted business data.
5.2 Entity Relationship Overview
  departments ─┬─< users >─┬─< project_members >─┬─< projects
               │            │                       │
  batches ─────┘            │              milestones ─< projects
                            │              sprints    ─< projects
               tasks >──────┘ (assignee_id / reporter_id)
               tasks ─< tasks (parent_id → sub-tasks)
               tasks ─< task_dependencies
               tasks ─< comments ─< attachments
               tasks ─< time_logs
               tasks ─< activity_log
               projects ─< activity_log
               users ─< notifications
               users ─< audit_log
5.3 Core Table Schemas
5.3.1 departments
5.3.2 users
5.3.3 projects
5.3.4 tasks (extended from tracker issues)
5.3.5 time_logs
5.3.6 Other Key Tables (Summary)
5.4 Indexes and Performance
5.5 Migration Strategy from tracker.cutm.ac.in
A database migration tool (Flyway or custom Node migration scripts) will execute the following steps in order during the upgrade deployment:
Create new tables: departments, batches, projects, milestones, sprints, project_members, task_dependencies, workflow_configs, time_logs, activity_log, audit_log, notifications
Alter existing issues table: rename to tasks; add columns sprint_id, parent_id, type, estimate_hours, position, is_archived
Add column project_id to tasks table with FK to projects; create a default 'Legacy Tracker' project and set all existing tasks' project_id to it
Extend existing users table: add columns system_role, department_id, batch_id, ldap_uid, is_active, last_login_at
Create database views tracker_issues and tracker_users mapping old tracker table/column names to new schema for backward URL compatibility
Validate row counts and spot-check data integrity before go-live
6. API Design
6.1 API Architecture
All APIs follow REST conventions with JSON payloads. Base URL: https://tracker.cutm.ac.in/api/v2/. Version prefix v2 preserves the existing v1 tracker API. Authentication uses Bearer JWT tokens in the Authorization header. API documentation is maintained as an OpenAPI 3.0 YAML file in the repository at /docs/openapi.yaml.
6.2 Authentication APIs
6.3 Project APIs
6.4 Task APIs
6.5 Timesheet Integration API
The TimesheetSyncJob calls the following intern.cutm.ac.in endpoints:
Sync logic: time_logs with synced_to_timesheet = 0 are fetched every 5 minutes. Each is posted to intern.cutm.ac.in. On HTTP 200/201, synced_at and external_id are recorded and synced_to_timesheet is set to 1. On failure, retry up to 3 times with exponential backoff (5s, 15s, 45s). After 3 failures, the entry is marked sync_status = 'failed' and an admin alert is triggered.
6.6 Error Response Format
All API errors return a consistent JSON envelope:
  {
    "success": false,
    "error": {
      "code": "TASK_NOT_FOUND",
      "message": "Task with ID 123 was not found.",
      "field": null,
      "statusCode": 404
    }
  }
7. User Interface Design
7.1 UI Design Principles
Clarity over density: show only what is needed for the current task; progressive disclosure for advanced options
Consistent visual hierarchy: primary actions use solid blue buttons; secondary actions use outlined; destructive actions use red
Keyboard navigable: all core flows accessible without a mouse (WCAG 2.1 AA)
Optimistic UI updates: Kanban moves reflect instantly; API sync in background with rollback on error
Empty states: every view has a meaningful empty state (not just a blank screen)
7.2 Navigation Structure
  ┌─────────────────────────────────────────────────────────────┐
  │  Top Bar: Logo | Search | Notifications Bell | User Avatar  │
  ├───────────┬─────────────────────────────────────────────────┤
  │  Sidebar  │  Main Content Area                              │
  │           │                                                 │
  │  ● Home   │  Contextual to selected sidebar item:          │
  │  ● My     │  Project Overview / Kanban / Gantt /           │
  │    Tasks  │  Backlog / Calendar / Members / Reports        │
  │  ● Projects│                                                │
  │    ▼ List │                                                 │
  │    ▼ New  │                                                 │
  │  ● Reports│                                                 │
  │  ● Admin  │                                                 │
  │    (role) │                                                 │
  └───────────┴─────────────────────────────────────────────────┘
7.3 Key Screen Descriptions
7.4 Responsive Breakpoints
8. Security Design
8.1 Authentication Flow
  Client                 API Server              CUTM LDAP           Redis
    │                        │                       │                 │
    │── POST /auth/login ───►│                       │                 │
    │   {email, password}    │── LDAP bind ─────────►│                 │
    │                        │◄─ bind success ────────│                 │
    │                        │── upsert user record   │                 │
    │                        │── generate JWT (1h) + refreshToken (7d) ─►│
    │◄── 200 {accessToken,   │                       │                 │
    │         refreshToken}  │                       │                 │
    │                        │                       │                 │
    │── GET /api/v2/... ────►│                       │                 │
    │   Bearer: accessToken  │── validate JWT sig    │                 │
    │                        │── check blacklist ──────────────────────►│
    │                        │◄─ not blacklisted ──────────────────────│
    │                        │── RBAC check          │                 │
    │◄── 200 response ───────│                       │                 │
8.2 Authorisation Model
CUTM-PMS uses a two-level RBAC model: System Role (assigned globally) and Project Role (assigned per project). The effective permission for a request is the more permissive of the two applicable roles.
8.3 Data Security
All passwords are never stored — LDAP authentication only; no local password hash
JWT signed with RS256 (asymmetric); private key stored in server environment variable, never in code
File attachments stored with randomised storage paths (UUID-based); direct URL access blocked — all downloads via pre-signed temporary URLs (15-minute expiry)
Database connection uses a least-privilege service account (no DROP, no GRANT permissions)
PII fields (email, name) are not logged in access logs; only user IDs are logged
Database backups are encrypted at rest using AES-256
8.4 Input Validation
All API inputs validated at Controller layer using a schema validation library (Joi / Zod)
Rich text (task descriptions, comments) sanitised server-side using DOMPurify equivalent to prevent stored XSS
File uploads: MIME type checked against whitelist (pdf, png, jpg, zip, docx, xlsx); file content sniffed (not just extension); max 25 MB enforced
SQL injection: all DB queries use ORM parameterised queries; raw SQL prohibited except in migration scripts
CSRF protection: SameSite=Strict cookie for session + CSRF token header for state-changing requests
9. Integration Design
9.1 CUTM LDAP / SSO Integration
The LDAPService module wraps the ldapjs library (Node.js) or PHP's ldap_* functions. Configuration is injected via environment variables (LDAP_URL, LDAP_BASE_DN, LDAP_SERVICE_ACCOUNT_DN, LDAP_SERVICE_ACCOUNT_PASSWORD).
Login sequence:
Receive user credentials from AuthController
Bind to LDAP with service account to search for user DN by email or employee ID
Re-bind using the found user DN and submitted password
On success, fetch user attributes: cn (name), mail, department, employeeID
Upsert user record in local DB with latest LDAP attributes
Issue JWT and refresh token
Error handling: LDAP_INVALID_CREDENTIALS → return 401; LDAP_SERVER_DOWN → fall back to cached local user record for 1 hour (grace period) with audit log entry.
9.2 Timesheet (intern.cutm.ac.in) Integration
The TimesheetSyncService uses axios (Node.js HTTP client) to communicate with intern.cutm.ac.in's REST API. Configuration: TIMESHEET_API_BASE_URL, TIMESHEET_API_KEY (stored as environment secrets).
  CUTM-PMS DB                   TimesheetSyncJob (cron)      intern.cutm.ac.in
      │                                    │                        │
      │── query time_logs WHERE            │                        │
      │   synced = 0 ──────────────────────►                        │
      │◄─ batch of unsynced entries ────────│                        │
      │                                    │── POST /api/timesheets ►│
      │                                    │◄─ 201 {externalId} ─────│
      │◄─ UPDATE time_logs SET             │                        │
      │   synced=1, external_id=... ────────│                        │
      │                                    │── (repeat for batch)   │
Conflict detection: before pushing a new log entry, the service fetches existing entries for that user+date from intern.cutm.ac.in. If the total hours would exceed 24h, the sync is paused and a notification sent to the user.
9.3 CUTM ERP Integration (Phase 2)
Phase 2 will integrate with the CUTM ERP to automatically import student batch data, programme enrolments, and academic calendar. A dedicated ERPSyncJob will run nightly, pulling updated batch and student records and upserting them into the batches and users tables. The interface will be a REST pull from the ERP's API (endpoint and auth to be confirmed with CUTM IT).
10. Deployment Architecture
10.1 Deployment Diagram
  ┌─────────────────────────── CUTM Server Infrastructure ──────────────────┐
  │                                                                         │
  │  ┌──────────────────────────────────────────────────────────────────┐  │
  │  │  Server 1: Web + App (Primary)          Ubuntu 22.04 LTS         │  │
  │  │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────┐│  │
  │  │  │ Nginx        │  │ Node.js App       │  │ Socket.io Server     ││  │
  │  │  │ (port 443)   │  │ (port 3000)       │  │ (port 3001)          ││  │
  │  │  └─────────────┘  └──────────────────┘  └──────────────────────┘│  │
  │  └──────────────────────────────────────────────────────────────────┘  │
  │                                                                         │
  │  ┌──────────────────────────────────────────────────────────────────┐  │
  │  │  Server 2: Database                     Ubuntu 22.04 LTS         │  │
  │  │  ┌─────────────────────┐  ┌────────────────────────────────────┐│  │
  │  │  │  MySQL 8.0 Primary  │  │  Redis 7 (cache + sessions)        ││  │
  │  │  │  (port 3306)        │  │  (port 6379, auth enabled)         ││  │
  │  │  └─────────────────────┘  └────────────────────────────────────┘│  │
  │  └──────────────────────────────────────────────────────────────────┘  │
  │                                                                         │
  │  ┌──────────────────────────────────────────────────────────────────┐  │
  │  │  Server 3: File Storage + Read Replica   Ubuntu 22.04 LTS        │  │
  │  │  ┌─────────────────────┐  ┌────────────────────────────────────┐│  │
  │  │  │  MinIO (port 9000)  │  │  MySQL Read Replica (port 3306)    ││  │
  │  │  └─────────────────────┘  └────────────────────────────────────┘│  │
  │  └──────────────────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────────────┘
10.2 Environment Specifications
Environment variables (secrets) are never stored in code or Docker images. They are injected via a .env file on the server (gitignored) or through Docker secrets. Minimum required environment variables:
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
  REDIS_URL, REDIS_PASSWORD
  LDAP_URL, LDAP_BASE_DN, LDAP_SERVICE_ACCOUNT_DN, LDAP_SERVICE_ACCOUNT_PASSWORD
  JWT_PRIVATE_KEY, JWT_PUBLIC_KEY
  MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
  TIMESHEET_API_BASE_URL, TIMESHEET_API_KEY
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
  APP_URL, NODE_ENV
10.3 CI/CD Pipeline
GitLab CI pipeline defined in .gitlab-ci.yml with the following stages:
11. Error Handling Strategy
All errors are logged in structured JSON format including: timestamp, trace_id (UUID per request), user_id, method, path, status_code, error_code, message, stack_trace (production: stack omitted from response, only logged server-side).
12. Performance Design
Appendix A: Recommended Folder Structure
  cutm-pms/
  ├── frontend/                 # React SPA
  │   ├── src/
  │   │   ├── components/       # Shared UI components
  │   │   ├── features/         # Feature modules (kanban, gantt, ...)
  │   │   ├── hooks/            # Custom React hooks
  │   │   ├── services/         # API client functions
  │   │   ├── store/            # Zustand global state
  │   │   └── utils/
  │   ├── public/
  │   └── package.json
  ├── backend/                  # Node.js / Express API
  │   ├── src/
  │   │   ├── controllers/      # Route handlers
  │   │   ├── services/         # Business logic
  │   │   ├── repositories/     # DB access layer
  │   │   ├── models/           # Sequelize ORM models
  │   │   ├── middlewares/      # Auth, RBAC, validation
  │   │   ├── integrations/     # LDAP, Timesheet, Email
  │   │   ├── jobs/             # Cron / background jobs
  │   │   ├── routes/           # Express route definitions
  │   │   └── utils/
  │   ├── migrations/           # DB migration scripts
  │   ├── tests/                # Unit + integration tests
  │   └── package.json
  ├── docs/
  │   ├── openapi.yaml          # OpenAPI 3.0 API spec
  │   ├── SRS_v1.0.docx
  │   └── SDD_v1.0.docx
  ├── docker-compose.yml
  ├── .gitlab-ci.yml
  └── README.md
Appendix B: Coding Standards Summary