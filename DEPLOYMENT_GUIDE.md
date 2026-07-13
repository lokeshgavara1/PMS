# 🚀 CUTM-PMS DEPLOYMENT GUIDE

**For:** Deployment Team  
**Version:** 1.0.0  
**Date:** 2026-07-10  
**Status:** Production Ready

---

## TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Google OAuth Configuration](#google-oauth-configuration)
7. [Deployment Checklist](#deployment-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Support Contacts](#support-contacts)

---

## Prerequisites

### System Requirements
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MySQL:** v8.0 or higher
- **OS:** Linux (Ubuntu 20.04+) or Windows Server 2019+
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** Minimum 10GB

### Network Requirements
- Port 5000 (Backend API)
- Port 5175 or 3000 (Frontend - configurable)
- Port 3306 (MySQL)
- HTTPS/SSL certificates configured

---

## Environment Configuration

### Step 1: Backend Configuration

**File:** `api/.env`

```bash
cp api/.env.example api/.env
```

**Critical Variables to Update:**

| Variable | Example | Notes |
|----------|---------|-------|
| `NODE_ENV` | production | Must be "production" |
| `DB_HOST` | 10.0.1.15 | Your MySQL server IP/hostname |
| `DB_PORT` | 3306 | Default MySQL port |
| `DB_NAME` | pms_db | Database name |
| `DB_USER` | pms_user | MySQL user (not root) |
| `DB_PASSWORD` | SecureP@ssw0rd123! | Use strong password |
| `CORS_ORIGIN` | https://pms.cutm.ac.in | Frontend URL |
| `GOOGLE_CLIENT_ID` | 123456789-xxx.apps.googleusercontent.com | From Google Console |
| `GOOGLE_CLIENT_SECRET` | GOCSPX-xxxxxx | From Google Console |
| `JWT_SECRET` | generate_with_crypto_module | See below |

**Generating JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Frontend Configuration

**File:** `web/.env`

```bash
cp web/.env.example web/.env
```

**Critical Variables to Update:**

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_BASE_URL` | https://api.pms.cutm.ac.in/api/v2 | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | 123456789-xxx.apps.googleusercontent.com | Same as backend |
| `VITE_ENVIRONMENT` | production | deployment environment |

---

## Backend Setup

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Verify Environment Variables

```bash
# Check all required variables are set
node -e "
const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missing = required.filter(v => !process.env[v]);
if (missing.length) console.error('Missing:', missing);
else console.log('✅ All variables configured');
"
```

### 3. Start Backend Server

```bash
npm start
# Server should start on port 5000
# Watch for: "✅ Database connected successfully"
```

### 4. Verify Backend Health

```bash
curl http://localhost:5000/health
# Response: { "status": "API is running", "timestamp": "..." }
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Build for Production

```bash
npm run build
# Creates optimized build in web/dist/
```

### 3. Deploy Frontend Build

**Option A: Nginx (Recommended)**

```bash
# Copy build files to web root
sudo cp -r web/dist/* /var/www/pms/

# Create nginx config
sudo tee /etc/nginx/sites-available/pms << EOF
server {
    listen 443 ssl http2;
    server_name pms.cutm.ac.in;

    ssl_certificate /etc/ssl/certs/your_cert.crt;
    ssl_certificate_key /etc/ssl/private/your_key.key;

    root /var/www/pms;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
    }
}
EOF

# Enable and restart nginx
sudo ln -s /etc/nginx/sites-available/pms /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

**Option B: Apache**

```bash
# Copy build files
sudo cp -r web/dist/* /var/www/html/pms/

# Create .htaccess for SPA routing
sudo tee /var/www/html/pms/.htaccess << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

sudo systemctl restart apache2
```

---

## Database Setup

### 1. Create Database and User

```bash
mysql -u root -p << EOF
-- Create database
CREATE DATABASE pms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'pms_user'@'localhost' IDENTIFIED BY 'SecureP@ssw0rd123!';

-- Grant permissions
GRANT ALL PRIVILEGES ON pms_db.* TO 'pms_user'@'localhost';
FLUSH PRIVILEGES;

EOF
```

### 2. Import Database Schema

```bash
mysql -u pms_user -p pms_db < init-db.sql
```

### 3. Verify Database Connection

```bash
mysql -u pms_user -p -e "USE pms_db; SHOW TABLES;"
# Should list: users, projects, tasks, comments, timelogs, etc.
```

---

## Google OAuth Configuration

### 1. Create OAuth 2.0 Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "CUTM-PMS"
3. Enable APIs:
   - Google+ API
   - Google Identity Services

### 2. Create OAuth 2.0 Credential

1. Go to **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web Application**
4. Add authorized origins:
   ```
   https://pms.cutm.ac.in
   https://www.pms.cutm.ac.in
   ```
5. Add authorized redirect URIs:
   ```
   https://pms.cutm.ac.in/auth/google/callback
   https://www.pms.cutm.ac.in/auth/google/callback
   ```

### 3. Copy Credentials

- Copy **Client ID** → `GOOGLE_CLIENT_ID`
- Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured in both `api/.env` and `web/.env`
- [ ] Database created and schema imported
- [ ] Google OAuth credentials obtained and configured
- [ ] SSL certificates installed and valid
- [ ] Firewall rules allowing ports 5000, 5175, 3306
- [ ] Node.js and npm versions verified (v18+)
- [ ] MySQL 8.0+ installed and running

### Deployment Steps
- [ ] Backend dependencies installed (`npm install` in api/)
- [ ] Frontend built successfully (`npm run build` in web/)
- [ ] Backend health check passes (`curl /health`)
- [ ] Frontend deployed to web server (Nginx/Apache)
- [ ] Database connection verified
- [ ] Google OAuth login tested
- [ ] CORS headers verified in responses

### Post-Deployment
- [ ] Test user login with @cutm.ac.in email
- [ ] Create test project
- [ ] Create test task and verify Kanban board
- [ ] Test comment functionality
- [ ] Test time logging
- [ ] Verify notifications bell appears
- [ ] Check browser console for errors (F12)
- [ ] Monitor backend logs for issues

### Security Checks
- [ ] .env files not accessible via HTTP
- [ ] HTTPS enabled with valid SSL certificate
- [ ] JWT tokens have appropriate expiration
- [ ] Database user has minimal required permissions
- [ ] API CORS restricted to frontend domain only
- [ ] Error messages don't leak sensitive information
- [ ] Database credentials never logged or exposed

---

## Troubleshooting

### Backend Issues

**Problem: "Database connection failed"**
```
Solution:
1. Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
2. Check MySQL is running: systemctl status mysql
3. Test connection: mysql -h DB_HOST -u DB_USER -p DB_NAME
```

**Problem: "CORS error in browser"**
```
Solution:
1. Verify CORS_ORIGIN in api/.env matches frontend URL
2. Check it includes https:// (not just domain)
3. Restart backend after .env change
```

**Problem: "Google OAuth fails"**
```
Solution:
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
2. Check Google Console redirect URIs match exactly
3. Ensure frontend is on https://
4. Check browser cookies not blocked
```

### Frontend Issues

**Problem: "Blank page or white screen"**
```
Solution:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify VITE_API_BASE_URL is correct
4. Check Network tab for API calls
5. Verify backend is running
```

**Problem: "API requests fail with 404"**
```
Solution:
1. Verify VITE_API_BASE_URL ends with /api/v2
2. Check backend is running on port 5000
3. Verify CORS_ORIGIN in backend matches frontend
4. Test API directly: curl http://backend:5000/health
```

### Database Issues

**Problem: "Tables don't exist"**
```
Solution:
1. Verify init-db.sql was imported
2. List tables: mysql -u pms_user -p pms_db -e "SHOW TABLES;"
3. Re-import if needed: mysql -u pms_user -p pms_db < init-db.sql
```

---

## Monitoring & Logs

### Backend Logs

```bash
# View live logs (if running with npm start)
tail -f /var/log/pms/app.log

# Or check PM2 logs (if using PM2)
pm2 logs pms-api
```

### Database Logs

```bash
# MySQL error log location varies by OS
# Ubuntu: /var/log/mysql/error.log
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\Data\error.log
tail -f /var/log/mysql/error.log
```

### Web Server Logs

**Nginx:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Apache:**
```bash
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log
```

---

## Performance Optimization

### Backend Optimization
```bash
# Use PM2 for process management and auto-restart
npm install -g pm2
pm2 start api/src/server.js --name "pms-api"
pm2 startup
pm2 save
```

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_project_owner ON projects(owner_id);
CREATE INDEX idx_task_project ON tasks(project_id);
CREATE INDEX idx_task_status ON tasks(status);
```

### Frontend Optimization
- Enable gzip compression in Nginx/Apache
- Configure CDN for static assets
- Enable browser caching headers

---

## Support Contacts

**For Technical Issues:**
- Development Team: development@cutm.ac.in
- Tech Lead: tech-lead@cutm.ac.in

**For Authentication Issues:**
- Google OAuth Support: [Google Cloud Console](https://console.cloud.google.com/)

**For Database Issues:**
- Database Admin: dba@cutm.ac.in

---

## Quick Reference

### Starting Services

```bash
# Terminal 1: Backend
cd api
npm start

# Terminal 2: Frontend (development only, use built version for production)
cd web
npm run dev

# Terminal 3: MySQL (if not running as service)
mysql --user=root --password
```

### Health Checks

```bash
# API Health
curl https://pms.cutm.ac.in/api/v2/health

# Database Check
mysql -u pms_user -p -e "SELECT 1;"

# Frontend Access
curl -I https://pms.cutm.ac.in
```

### Restart Services

```bash
# Backend
systemctl restart pms-api  # if running as service
# OR
kill $(lsof -t -i:5000) && npm start

# Nginx
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2

# MySQL
sudo systemctl restart mysql
```

---

**End of Deployment Guide**

Questions? Contact the development team at development@cutm.ac.in

