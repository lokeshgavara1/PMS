# CUTM-PMS (Performance Management System)

A comprehensive Project Management System built for Centurion University of Technology and Management.

## Project Structure

```
cutm-pms/
├── web/                    # Frontend (React + Vite)
├── api/                    # Backend (Express + MySQL)
├── mock-intern-api/        # Mock timesheet API
├── docker-compose.yml      # Full stack setup
├── FRONTEND_VERIFICATION_REPORT.md
├── PROFILE_PAGE_AND_UI_UPDATE.md
└── BACKEND_PROGRESS.md
```

## Tech Stack

### Frontend (Part 1)
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS v4
- React Query + Zustand
- React Router
- Mock Service Worker (MSW)

### Backend (Part 2)
- Node.js + Express.js
- MySQL 8.0 + Sequelize ORM
- Redis for caching
- JWT authentication
- Docker & Docker Compose

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (if running locally without Docker)

### Setup with Docker (Recommended)

```bash
# Clone and navigate to project
cd cutm-pms

# Start all services
docker-compose up

# In another terminal, run database seed
docker exec cutm_pms_api npm run seed

# Frontend will be available at: http://localhost:5173
# Backend API at: http://localhost:5000/api/v2
```

### Update Frontend to Use Live API

Edit `web/.env`:
```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:5000/api/v2
```

Restart frontend dev server:
```bash
cd web
npm run dev
```

## Seeded Credentials

All demo users have password: `password123`

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cutm.ac.in | password123 |
| HOD | hod.cse@cutm.ac.in | password123 |
| Faculty | faculty1@cutm.ac.in | password123 |
| PM | pm@cutm.ac.in | password123 |
| Student | student1@cutm.ac.in | password123 |

## Features Implemented

### ✅ Frontend (100% Complete)
- 11 full pages (Landing, Login, Dashboard, Projects, Tasks, My Tasks, Reports, Timesheet, Workflow, Admin, Profile)
- Professional UI with Centurion University branding
- Real-time Kanban board with drag-and-drop
- Time tracking integration
- Role-based access control
- Email domain validation (cutm.ac.in / cutmap.ac.in)
- Mock API integration (MSW)

### ✅ Backend (70% Complete)
- Complete authentication (JWT + Mock LDAP)
- Full project/task CRUD
- Timesheet sync integration
- Notifications system
- Comments and activity logging
- Database seeding with test data
- Docker containerization
- All API routes matching frontend contract

### 🚀 Coming Soon
- Real LDAP integration
- Real timesheet sync to intern.cutm.ac.in
- Socket.io real-time updates
- Advanced reporting
- File uploads
- Email notifications
- Production deployment

## API Endpoints

### Authentication
- `POST /api/v2/auth/login` - Login
- `POST /api/v2/auth/logout` - Logout
- `POST /api/v2/auth/refresh` - Refresh token
- `GET /api/v2/auth/me` - Current user

### Projects
- `GET /api/v2/projects` - List projects
- `GET /api/v2/projects/:id` - Get project
- `POST /api/v2/projects` - Create project
- `PATCH /api/v2/projects/:id` - Update project

### Tasks
- `GET /api/v2/projects/:projectId/tasks` - List tasks
- `POST /api/v2/projects/:projectId/tasks` - Create task
- `PATCH /api/v2/tasks/:id` - Update task
- `PATCH /api/v2/tasks/:id/status` - Change status

### Time Logs
- `POST /api/v2/tasks/:taskId/timelog` - Log time
- `GET /api/v2/tasks/:taskId/timelog` - Get time logs
- `GET /api/v2/time-logs` - All time logs

### Notifications
- `GET /api/v2/notifications` - List notifications
- `GET /api/v2/notifications/unread-count` - Unread count
- `PATCH /api/v2/notifications/:id/read` - Mark as read

### Comments
- `POST /api/v2/tasks/:taskId/comments` - Add comment
- `GET /api/v2/tasks/:taskId/comments` - Get comments

## Testing the System

1. **Start Services:**
   ```bash
   docker-compose up
   ```

2. **Test Login:**
   - Navigate to http://localhost:5173
   - Use seeded credentials above
   - All roles can log in and see role-appropriate screens

3. **Test Projects & Tasks:**
   - Click on "Projects" to see 4 pre-seeded projects
   - Click into a project to see Kanban board
   - Drag tasks between columns (persists to MySQL)
   - Create new tasks

4. **Test Timesheet:**
   - Navigate to "Timesheet" page
   - Log hours for tasks
   - Hours sync with database

5. **Test Profile:**
   - Click "Profile" in sidebar
   - View and edit user information
   - See personal statistics

## Configuration

### Backend (.env)
```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=cutm_pms
DB_USER=cutm_user
DB_PASSWORD=cutm_password

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=1h
REFRESH_TOKEN_EXPIRE=7d

# Server
API_PORT=5000
NODE_ENV=development

# Timesheet
MOCK_INTERN_API_URL=http://mock-intern-api:5001

# Frontend
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:5000/api/v2
```

## Development

### Backend Development
```bash
cd api
npm install
npm run dev       # Start dev server
npm run build     # Build for production
npm run seed      # Seed database
npm test          # Run tests
```

### Frontend Development
```bash
cd web
npm install
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Database Schema

### Core Tables
- `users` - User accounts with roles
- `departments` - Department management
- `projects` - Projects
- `tasks` - Tasks and subtasks
- `sprints` - Sprint planning
- `time_logs` - Time tracking
- `comments` - Task comments
- `notifications` - User notifications
- `activity_log` - Audit trail

See `BACKEND_PROGRESS.md` for complete schema details.

## Mock Services

The system includes a mock timesheet API that simulates `intern.cutm.ac.in`:

**Endpoints:**
- `POST /timesheet/sync` - Sync time logs
- `GET /timesheet/logs` - Get all logs
- `GET /timesheet/status/:externalId` - Check sync status

**Running:**
```bash
docker-compose up mock-intern-api
```

Or start with full stack:
```bash
docker-compose up
```

## Real Integration Setup

When ready to integrate with real CUTM services:

1. **LDAP Authentication:**
   - Update `api/src/providers/` to use real LDAP provider
   - Configure LDAP_URL, LDAP_BIND_DN, LDAP_BIND_PASSWORD

2. **Timesheet Sync:**
   - Update `MOCK_INTERN_API_URL` to actual `intern.cutm.ac.in`
   - Implement real timesheet sync job

3. **Production Deployment:**
   - Use environment-specific `.env` files
   - Configure CORS for production domain
   - Set secure JWT secret
   - Enable HTTPS
   - Configure database backups

## Troubleshooting

### Docker won't start
```bash
# Check if ports are in use
docker ps
docker logs cutm_pms_api

# Clean up old containers
docker-compose down
docker system prune
```

### Database connection error
```bash
# Verify MySQL is running
docker exec cutm_pms_mysql mysql -u cutm_user -p cutm_password -e "SELECT 1"

# Check Redis
docker exec cutm_pms_redis redis-cli ping
```

### Frontend can't connect to API
```bash
# Check API is running
curl http://localhost:5000/api/v2/health

# Verify frontend .env settings
cat web/.env

# Check CORS configuration
curl -H "Origin: http://localhost:5173" http://localhost:5000/api/v2/health
```

## Documentation

- `FRONTEND_VERIFICATION_REPORT.md` - Frontend testing and features
- `PROFILE_PAGE_AND_UI_UPDATE.md` - UI color scheme updates
- `BACKEND_PROGRESS.md` - Backend implementation status
- `docs/SRS.md` - System requirements specification
- `docs/SDD.md` - System design document

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## Team

**Frontend Developer:** Claude Code  
**Backend Developer:** Claude Code  
**University:** Centurion University of Technology and Management

## License

© 2026 Centurion University of Technology and Management. All rights reserved.

## Support

For issues or questions:
- Check existing GitHub issues
- Review documentation in `docs/`
- Check `BACKEND_PROGRESS.md` for implementation status

---

**Status:** 🚀 Ready for Integration Testing  
**Last Updated:** 2026-07-03
