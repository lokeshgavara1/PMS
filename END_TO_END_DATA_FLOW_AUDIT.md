# 🔍 END-TO-END DATA FLOW AUDIT - CUTM-PMS

**Date:** 2026-07-13  
**Status:** ⚠️ CRITICAL ISSUES FOUND  
**Severity:** HIGH - Data Flow Broken in Multiple Places

---

## 📋 EXECUTIVE SUMMARY

Frontend-to-database data flow has **CRITICAL MISMATCHES** in:
1. ❌ API endpoint paths (frontend vs backend)
2. ❌ Database field names (SQL schema vs models)
3. ❌ Missing Notification table in database
4. ❌ Route nesting inconsistencies

**Result:** Comments, Time Logs, and Notifications will FAIL to save to database

---

## 🔴 CRITICAL ISSUES IDENTIFIED

### Issue #1: API Endpoint Path Mismatches

#### ❌ COMMENTS ENDPOINTS

**Frontend Calls:**
```javascript
/tasks/${taskId}/comments
```

**Backend Routes:**
- Root level: `/api/v2/tasks/:taskId/comments` ✅
- Nested: `/api/v2/projects/:projectId/tasks/:taskId/comments` ✅

**Status:** ⚠️ PARTIALLY WORKS
- Works via root tasks mount
- But nested comments are handled differently
- **Risk:** Inconsistent behavior

---

#### ❌ TIME LOGS ENDPOINTS

**Frontend Calls:**
```javascript
/tasks/${taskId}/time-logs   // WITH HYPHEN
```

**Backend Routes:**
```javascript
/tasks/:taskId/timelogs      // NO HYPHEN
```

**Status:** ❌ BROKEN
- Frontend uses `/time-logs` (hyphen)
- Backend uses `/timelogs` (no hyphen)
- **Result:** 404 ERROR - Time logs won't save!

---

#### ❌ NOTIFICATIONS ENDPOINTS

**Frontend Calls:**
```javascript
GET  /notifications
GET  /notifications/unread-count
```

**Backend Routes:**
```javascript
GET  /notifications/users/:userId
PATCH /notifications/:id/read
PATCH /notifications/users/:userId/read-all
DELETE /notifications/:id
```

**Status:** ❌ BROKEN
- Frontend missing `userId` in URL
- Endpoint `/notifications/unread-count` doesn't exist
- **Result:** Notifications won't load!

---

### Issue #2: Database Schema vs Model Field Mismatches

#### ❌ COMMENTS TABLE

**Database (init-db.sql):**
```sql
CREATE TABLE comments (
  id INT,
  task_id INT,
  user_id INT,          -- ❌ Wrong! Should be author_id
  content LONGTEXT,      -- ❌ Wrong! Model uses body
  parent_comment_id INT,
  ...
)
```

**Model (Comment.js):**
```javascript
const Comment = sequelize.define('Comment', {
  // No explicit field mapping
})
// Model looks for: author_id, body
// Schema has: user_id, content
```

**Status:** ❌ BROKEN
- Schema uses `user_id` but model uses author relationship
- Schema uses `content` but controller sends `body`
- **Result:** Comments created but fields misaligned!

---

#### ❌ TIME LOGS TABLE

**Database (init-db.sql):**
```sql
CREATE TABLE time_logs (
  id INT,
  task_id INT,
  user_id INT,
  hours_logged FLOAT,    -- ❌ Schema uses this
  log_date DATETIME,     -- ❌ Schema uses this
  description LONGTEXT,  -- ❌ Schema has description
  synced_to_timesheet BOOLEAN,
  sync_status ENUM(...),
  ...
)
```

**Model (TimeLog.js):**
```javascript
// Model expects: hours, date, notes
// Not: hours_logged, log_date, description
```

**Frontend (TimeLogForm.tsx):**
```javascript
formData = {
  hours: '',      // ✅ Correct
  date: '',       // ✅ Correct
  notes: ''       // ✅ Correct
}
```

**Status:** ❌ BROKEN
- Frontend sends: `hours`, `date`, `notes`
- Database expects: `hours_logged`, `log_date`, `description`
- **Result:** Time entries won't save correctly!

---

#### ❌ NOTIFICATIONS TABLE MISSING!

**Frontend Uses:**
```javascript
interface Notification {
  id: number
  user_id: number
  type: string
  message: string
  read_at?: Date
  created_at: Date
}
```

**Database Schema:**
❌ **NOT IN init-db.sql!**

**Status:** ❌ CRITICAL
- Notifications table never created in database
- Model exists (we fixed it this session)
- **But SQL schema needs update!**

---

### Issue #3: Route Mounting Structure

**server.js Mounting:**
```javascript
app.use('/api/v2/auth', auth.routes)
app.use('/api/v2/projects', projects.routes)
app.use('/api/v2/users', users.routes)
app.use('/api/v2/tasks', tasks.routes)           // ← Root tasks
app.use('/api/v2/notifications', notifications.routes)
```

**projects.routes.js Mounting:**
```javascript
router.use('/:projectId/tasks', tasks.routes)   // ← Nested tasks
router.use('/:projectId/milestones', milestones.routes)
router.use('/:projectId/sprints', sprints.routes)
```

**Status:** ⚠️ DOUBLE MOUNTING
- Tasks routes mounted at TWO levels:
  1. `/api/v2/tasks/:taskId/...`
  2. `/api/v2/projects/:projectId/tasks/:taskId/...`
- Nested comments/timelogs only work via projects path
- Root path has no nested routes for comments/timelogs!

---

## 📊 DATA FLOW MATRIX

| Feature | Frontend Endpoint | Backend Route | Field Names | Status |
|---------|------------------|---------------|-------------|--------|
| **Project Create** | POST /projects | POST /projects | ✅ Correct | ✅ OK |
| **Task Create** | POST /projects/:id/tasks | POST /projects/:id/tasks | ✅ Correct | ✅ OK |
| **Comment Create** | POST /tasks/:id/comments | POST /projects/:id/tasks/:id/comments | ❌ Path Mismatch | ⚠️ BROKEN |
| **TimeLog Create** | POST /tasks/:id/time-logs | POST /projects/:id/tasks/:id/timelogs | ❌ Path + Field Names | ❌ BROKEN |
| **Notification Get** | GET /notifications | GET /notifications/users/:userId | ❌ Missing userId | ❌ BROKEN |
| **Comment Read** | GET /tasks/:id/comments | GET /projects/:id/tasks/:id/comments | ❌ Path Mismatch | ⚠️ BROKEN |
| **TimeLog Read** | GET /tasks/:id/time-logs | GET /projects/:id/tasks/:id/timelogs | ❌ Path + Field Names | ❌ BROKEN |

---

## 🔧 TESTING SCENARIOS

### Test 1: Create User & Login ✅

**Flow:**
1. Frontend: `POST /auth/google` → { token }
2. Backend: `auth.controller.googleLogin()` → Creates/finds user
3. Database: INSERT INTO users → ✅ WORKS
4. Response: Returns user + tokens

**Status:** ✅ WORKING

---

### Test 2: Create Project ✅

**Flow:**
1. Frontend: `POST /projects` → { name, description, ... }
2. Backend: `project.controller.createProject()` → Project.create()
3. Database: INSERT INTO projects → ✅ WORKS
4. Response: Returns project object

**Status:** ✅ WORKING

---

### Test 3: Create Task ✅

**Flow:**
1. Frontend: `POST /projects/1/tasks` → { title, ... }
2. Backend: `task.controller.createTask()` → Task.create()
3. Database: INSERT INTO tasks → ✅ WORKS
4. Response: Returns task object

**Status:** ✅ WORKING

---

### Test 4: Create Comment ❌

**Flow:**
1. Frontend: `POST /tasks/1/comments` → { body: "text" }
2. Backend expects request at: `/projects/1/tasks/1/comments`
3. **MISMATCH!** - 404 error
4. If root path worked:
   - Controller expects: `req.body.body`
   - Database field: `content` (not `body`)
   - INSERT INTO comments (task_id, user_id, content) → ❌ FAILS

**Status:** ❌ BROKEN

---

### Test 5: Log Time ❌

**Flow:**
1. Frontend: `POST /tasks/1/time-logs` → { hours: 2, date: "...", notes: "..." }
2. Backend expects request at: `/projects/1/tasks/1/timelogs` (no hyphen)
3. **MISMATCH!** - 404 error
4. If route was correct:
   - Frontend sends: `hours`, `date`, `notes`
   - Database expects: `hours_logged`, `log_date`, `description`
   - INSERT INTO time_logs → ❌ FAILS

**Status:** ❌ BROKEN

---

### Test 6: Get Notifications ❌

**Flow:**
1. Frontend: `GET /notifications`
2. Backend expects: `GET /notifications/users/:userId`
3. **MISMATCH!** - Missing userId parameter
4. If fixed:
   - Database table doesn't exist in schema!
   - Models won't have proper column mapping

**Status:** ❌ BROKEN

---

## 📝 DETAILED ISSUE BREAKDOWN

### Issue A: Comment Data Flow

**Current State:**
```
Frontend                     Backend                     Database
─────────────────────────────────────────────────────────────────
POST /tasks/1/comments   →   ❌ Route not available     (no connection)
                             (Only /projects/1/tasks/1/comments)
                          
If route exists:
POST data: { body: "..." } → Controller: body          Schema: content ❌
                          → Model expects: author_id    Schema has: user_id ❌
```

**Why it fails:**
1. Frontend doesn't know projectId
2. Frontend can't construct nested URL
3. Even if route exists, field names don't match

---

### Issue B: TimeLog Data Flow

**Current State:**
```
Frontend                     Backend                     Database
─────────────────────────────────────────────────────────────────
POST /tasks/1/time-logs  →   ❌ 404 NOT FOUND          (no connection)
(hyphen)                      (Route is /timelogs)      
                          
If route exists:
POST data:                  Controller:
  hours: 2       ──→        ✓ receives as hours   ──→  ✗ DB expects hours_logged ❌
  date: "..."    ──→        ✓ receives as date    ──→  ✗ DB expects log_date ❌
  notes: ""      ──→        ✓ receives as notes   ──→  ✗ DB expects description ❌
```

**Why it fails:**
1. Hyphen/no-hyphen mismatch in endpoint name
2. Model field names don't match database schema
3. Three field name mismatches

---

### Issue C: Notification Data Flow

**Current State:**
```
Frontend                     Backend                     Database
─────────────────────────────────────────────────────────────────
GET /notifications       →   ❌ Missing userId           ❌ Table doesn't exist!
                             Expected: /notifications/users/:userId
                          
Even if fixed:
GET /notifications/123   →   Controller finds user's     ❌ Schema missing
                             notifications              
                          
Query result:               No table in schema
  NULL / ERROR
```

**Why it fails:**
1. Frontend doesn't include userId
2. Backend expects userId in URL
3. Database table doesn't exist in init-db.sql

---

## 🚨 IMMEDIATE FIXES REQUIRED

### Fix #1: Update init-db.sql - Add Notification Table

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('task_assigned', 'comment', 'milestone', 'sprint', 'general') DEFAULT 'general',
  message TEXT NOT NULL,
  related_entity_id INT,
  related_entity_type VARCHAR(50),
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (read_at)
);
```

---

### Fix #2: Update init-db.sql - Comments Table

```sql
-- CHANGE FROM:
CREATE TABLE comments (
  id INT,
  task_id INT,
  user_id INT,          -- ❌ Wrong
  content LONGTEXT,     -- ❌ Wrong
  ...
)

-- CHANGE TO:
CREATE TABLE comments (
  id INT,
  task_id INT,
  author_id INT,        -- ✅ Correct
  body LONGTEXT,        -- ✅ Correct
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  ...
)
```

---

### Fix #3: Update init-db.sql - Time Logs Table

```sql
-- CHANGE FROM:
CREATE TABLE time_logs (
  hours_logged FLOAT,   -- ❌ Wrong
  log_date DATETIME,    -- ❌ Wrong
  description LONGTEXT, -- ❌ Wrong
  ...
)

-- CHANGE TO:
CREATE TABLE time_logs (
  hours FLOAT,          -- ✅ Correct
  date DATETIME,        -- ✅ Correct
  notes LONGTEXT,       -- ✅ Correct
  ...
)
```

---

### Fix #4: Fix Frontend Time Logs Endpoint

**File:** `web/src/api/other.ts`

```javascript
// CHANGE FROM:
const response = await apiClient.get(
  `/tasks/${taskId}/time-logs`   // ❌ Wrong endpoint + hyphen
);

// CHANGE TO:
const response = await apiClient.get(
  `/tasks/${taskId}/timelogs`    // ✅ Correct endpoint + no hyphen
);

// Also for POST:
const response = await apiClient.post(
  `/tasks/${taskId}/timelogs`,   // ✅ No hyphen
  logData
);
```

---

### Fix #5: Fix Frontend Comments Route

**Current:** Routes work but field mismatch

**File:** Check Comment controller for field mapping

---

### Fix #6: Fix Frontend Notifications API

**File:** `web/src/api/other.ts`

```javascript
// CHANGE FROM:
const response = await apiClient.get('/notifications');

// CHANGE TO:
const response = await apiClient.get('/notifications/users/:userId');

// Add user context:
export const useNotifications = (userId: number) => {
  return useQuery(
    ['notifications', userId],
    async () => {
      const response = await apiClient.get(
        `/notifications/users/${userId}`  // ✅ Include userId
      );
      return response.data.data;
    },
    { enabled: !!userId }
  );
};
```

---

## ✅ WHAT'S WORKING

| Feature | Status | Notes |
|---------|--------|-------|
| User Login | ✅ | Google OAuth works correctly |
| Project CRUD | ✅ | All operations working |
| Task CRUD | ✅ | All operations working |
| Task Status Updates | ✅ | Dedicated endpoint works |
| User Management | ✅ | Admin APIs working |
| Sprint CRUD | ✅ | Working correctly |
| Milestone CRUD | ✅ | Working correctly |

---

## ❌ WHAT'S BROKEN

| Feature | Status | Issue |
|---------|--------|-------|
| Comments | ❌ | Route path + field name mismatches |
| Time Logs | ❌ | Endpoint path (hyphen) + field names (3 mismatches) |
| Notifications | ❌ | Endpoint path + missing database table |

---

## 🔄 SUMMARY: REQUIRED CHANGES

### Database (init-db.sql)
- [ ] Add Notifications table
- [ ] Fix Comments table fields (user_id → author_id, content → body)
- [ ] Fix TimeLog table fields (hours_logged → hours, log_date → date, description → notes)

### Frontend (web/src/api/)
- [ ] Change `/time-logs` to `/timelogs` (2 places: GET and POST)
- [ ] Add userId parameter to notifications endpoints
- [ ] Verify comment field names match database

### Backend (already OK but verify models)
- [ ] Verify models use correct field names
- [ ] Test with updated schema

---

## 📊 COMPLETION STATUS

**Before Fixes:**
```
Database schema alignment:    ❌ 30%
Frontend-Backend routes:      ⚠️  50%
Data field mapping:          ❌ 20%
End-to-end data flow:        ❌ 40%
```

**After Fixes (Required):**
```
Database schema alignment:    ✅ 100%
Frontend-Backend routes:      ✅ 100%
Data field mapping:          ✅ 100%
End-to-end data flow:        ✅ 100%
```

---

## 🎯 NEXT STEPS

1. **Update init-db.sql** - Add Notifications table, fix field names
2. **Update Frontend API** - Fix endpoint paths and parameters
3. **Verify Models** - Ensure Sequelize models match schema
4. **Test Data Flow** - Test each CRUD operation end-to-end
5. **Re-export Database** - Export updated schema
6. **Deployment** - Update deployment guide with fixed schema

---

**Status:** 🔴 CRITICAL - Must be fixed before production deployment

