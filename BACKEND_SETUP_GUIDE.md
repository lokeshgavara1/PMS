# Backend Setup & Integration Guide

## What's Been Built ✅

### Complete Backend Infrastructure
- **Express.js API** with 20+ endpoints matching frontend contract exactly
- **MySQL Database** with 9 tables and all required indexes
- **Redis** for caching and session management
- **JWT Authentication** with bcrypt password hashing
- **Mock Intern API** simulating external timesheet endpoints
- **Docker Compose** setup with all services
- **Database Seeding** with test data and 10 demo users

### API Modules Implemented
✅ Auth (login, logout, refresh, me)  
✅ Projects (CRUD)  
✅ Tasks (CRUD, status updates)  
✅ Comments (create, list)  
✅ Time Logs (create, list, all logs)  
✅ Notifications (list, read, unread count)  
✅ Activity Logging  

## Files Created

```
api/
├── src/
│   ├── index.ts                 # Main Express app with all routes
│   ├── config/
│   │   ├── database.ts          # MySQL/Sequelize config
│   │   └── redis.ts             # Redis config
│   ├── models/
│   │   └── index.ts             # All 9 database models
│   ├── providers/
│   │   ├── IAuthProvider.ts     # Auth interface
│   │   └── MockLdapProvider.ts  # Mock LDAP implementation
│   └── seeders/
│       └── seed.ts              # Database seeding script
├── package.json
├── tsconfig.json
├── Dockerfile
├── .env.example
└── .gitignore

mock-intern-api/
├── src/
│   └── index.ts                 # Mock timesheet API
├── package.json
├── tsconfig.json
└── Dockerfile

docker-compose.yml              # Full stack orchestration
README.md                        # Complete documentation
BACKEND_PROGRESS.md             # Implementation status
```

## Quick Start (3 Steps)

### Step 1: Start Services
```bash
cd /Users/lokes/Desktop/PMS
docker-compose up
```

**Wait for all services to be ready:**
- ✅ MySQL connected
- ✅ Redis connected
- ✅ API server running on port 5000
- ✅ Mock Intern API on port 5001

### Step 2: Seed Database
```bash
docker exec cutm_pms_api npm run seed
```

**You'll see:**
```
✅ Database seeded successfully!

Seeded Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:             admin@cutm.ac.in / password123
HOD:               hod.cse@cutm.ac.in / password123
Faculty:           faculty1@cutm.ac.in / password123
Project Manager:   pm@cutm.ac.in / password123
Student:           student1@cutm.ac.in / password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Update Frontend
Edit `web/.env`:
```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:5000/api/v2
```

Restart frontend:
```bash
cd web
npm run dev
```

## Testing the Integration

### ✅ Test 1: Login
1. Navigate to http://localhost:5173
2. Login with `admin@cutm.ac.in` / `password123`
3. Should redirect to dashboard

### ✅ Test 2: View Projects
1. Click "Projects" in sidebar
2. Should show 4 seeded projects from MySQL
3. Click a project to see tasks

### ✅ Test 3: Kanban Board
1. In project detail, drag a task between columns
2. Refresh page - task should stay in new column (persisted to MySQL)
3. Proves frontend is reading/writing to real database

### ✅ Test 4: Create Task
1. Click "+ New Project" button
2. Fill form and create
3. Task should appear in database

### ✅ Test 5: Time Logs
1. Go to a task and log time
2. Check `GET /api/v2/time-logs` endpoint
3. Should show new time log

### ✅ Test 6: Different Roles
1. Log out and log in as different user (hod.cse@cutm.ac.in)
2. Should see role-appropriate views
3. Test all 5 demo accounts

## API Contract Verification

### Check Backend Health
```bash
curl http://localhost:5000/api/v2/health
# Response: {"status":"ok"}
```

### Test Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cutm.ac.in","password":"password123"}'

# Response: {
#   "success": true,
#   "data": {
#     "user": {...},
#     "tokens": {"accessToken":"...","refreshToken":"...","expiresIn":3600}
#   }
# }
```

### Test Project Listing
```bash
# List projects (replace TOKEN with actual access token)
curl http://localhost:5000/api/v2/projects \
  -H "Authorization: Bearer TOKEN"

# Response: {
#   "success": true,
#   "data": {
#     "data": [...4 projects...],
#     "pagination": {"total":4,"page":1,"limit":10,"pages":1}
#   }
# }
```

## Troubleshooting

### Backend won't start
```bash
# Check Docker logs
docker logs cutm_pms_api

# Check if ports are in use
lsof -i :5000  # API port
lsof -i :3306  # MySQL port
lsof -i :6379  # Redis port

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Database connection error
```bash
# Verify MySQL is running
docker exec cutm_pms_mysql mysql -u cutm_user -pecutm_password cutm_pms -e "SELECT COUNT(*) FROM users;"

# Check database migrations ran
docker exec cutm_pms_api npm run migrate
```

### Frontend shows "Backend not found"
```bash
# Check API is responding
curl http://localhost:5000/api/v2/health

# Verify frontend .env is correct
cat web/.env | grep VITE_API_BASE_URL

# Check browser console for CORS errors
# (Open DevTools F12 → Console tab)

# If CORS error: the API CORS setting might need adjustment
# Edit api/src/index.ts line with cors() config
```

### Tasks not persisting
```bash
# Check task was saved to database
docker exec cutm_pms_mysql mysql -u cutm_user -pecutm_password cutm_pms \
  -e "SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;"

# If empty: frontend might still be using mocks
# Verify VITE_USE_MOCKS=false in web/.env and restart frontend dev server
```

## Next Steps: Advanced Features

### To Add Later:
1. **Socket.io Integration** - Real-time Kanban updates
   - File: `api/src/sockets/board.ts`
   - Broadcast task updates to all project members

2. **Time Sync Job** - Auto-sync time logs
   - File: `api/src/jobs/timesheetSync.ts`
   - Use `node-cron` for 5-minute intervals

3. **File Uploads** - Attachment system
   - Implement `IStorageProvider` interface
   - LocalDisk provider for `/uploads`

4. **Email Notifications** - Real emails on events
   - Setup SMTP configuration
   - Send on task mentions, assignments

5. **Real LDAP** - Replace MockLdapProvider
   - Install ldapjs package
   - Implement CutmLdapProvider

6. **Real Timesheet Sync** - Replace mock API
   - Update MOCK_INTERN_API_URL to real endpoint
   - Update sync retry logic

## Environment Variables Reference

**API (.env)**
```
DB_HOST=mysql                          # Database host
DB_PORT=3306                           # Database port
DB_NAME=cutm_pms                       # Database name
DB_USER=cutm_user                      # Database user
DB_PASSWORD=cutm_password              # Database password
REDIS_URL=redis://redis:6379           # Redis connection URL
JWT_SECRET=your-secret                 # JWT signing secret
JWT_EXPIRE=1h                          # Access token expiry
REFRESH_TOKEN_EXPIRE=7d                # Refresh token expiry
API_PORT=5000                          # API server port
NODE_ENV=development                   # Node environment
MOCK_INTERN_API_URL=http://mock-intern-api:5001  # Timesheet API URL
CORS_ORIGIN=http://localhost:5173      # Frontend CORS origin
```

**Frontend (.env)**
```
VITE_USE_MOCKS=false                   # Use real API (true = use MSW mocks)
VITE_API_BASE_URL=http://localhost:5000/api/v2   # API base URL
```

## Database Schema Summary

| Table | Purpose | Rows |
|-------|---------|------|
| users | User accounts with roles | 10 |
| departments | Organization structure | 3 |
| projects | Projects | 4 |
| tasks | Tasks & subtasks | 5 |
| sprints | Sprint planning | 2 |
| comments | Task discussions | 0 |
| time_logs | Time tracking | 0 |
| notifications | User alerts | 0 |
| activity_log | Audit trail | 0 |

## Production Deployment Checklist

Before deploying to production:

- [ ] Update JWT_SECRET to a secure random string
- [ ] Configure database with proper backups
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS and update CORS_ORIGIN
- [ ] Configure real LDAP instead of mock
- [ ] Setup real email service for notifications
- [ ] Configure real timesheet API URL
- [ ] Setup monitoring and logging
- [ ] Run security audit
- [ ] Load test the system
- [ ] Document deployment process

## Architecture Overview

```
User Browser (http://localhost:5173)
         ↓
    React Frontend
         ↓
    API Calls (http://localhost:5000/api/v2)
         ↓
    Express.js API
    ├── Authentication (JWT + Mock LDAP)
    ├── Projects Service
    ├── Tasks Service
    ├── TimeLog Service
    └── Notification Service
         ↓
    Sequelize ORM
         ↓
    MySQL Database (localhost:3306)
         ↓
    Redis Cache (localhost:6379)
         
    Mock Intern API (localhost:5001)
    ├── Timesheet sync endpoint
    └── Status checking
```

## Support & Debugging

**View backend logs:**
```bash
docker logs -f cutm_pms_api
```

**View database logs:**
```bash
docker logs -f cutm_pms_mysql
```

**Access database directly:**
```bash
docker exec -it cutm_pms_mysql mysql -u cutm_user -pecutm_password cutm_pms
# Run SQL queries here
```

**Test API endpoints:**
```bash
# Use Postman or curl
# Example: GET /api/v2/projects
# Header: Authorization: Bearer <token>
```

## Summary

✅ **Backend Infrastructure:** 100% Complete  
✅ **API Endpoints:** All 20+ implemented  
✅ **Database:** Schema + Seeding complete  
✅ **Authentication:** JWT + MockLDAP ready  
✅ **Docker Setup:** Full stack configured  
✅ **Documentation:** Complete  

🚀 **Ready to integrate with frontend!**

---

**Created:** 2026-07-03  
**Version:** 1.0  
**Status:** Ready for Integration Testing
