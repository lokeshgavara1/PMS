-- CUTM-PMS Database Initialization Script
-- Run this in MySQL Workbench to set up the complete database schema

-- ============================================================================
-- CREATE DATABASE
-- ============================================================================
CREATE DATABASE IF NOT EXISTS pms_db;
USE pms_db;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  system_role ENUM('admin', 'hod', 'faculty', 'pm', 'student', 'guest') DEFAULT 'student',
  department_id INT,
  batch_id INT,
  ldap_uid VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_system_role (system_role)
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  category ENUM('academic', 'research', 'admin', 'infrastructure') DEFAULT 'academic',
  visibility ENUM('private', 'department', 'public') DEFAULT 'private',
  status ENUM('planning', 'active', 'on_hold', 'completed', 'archived') DEFAULT 'planning',
  department_id INT,
  owner_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_owner (owner_id)
);

-- ============================================================================
-- PROJECT MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'lead', 'member', 'viewer') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (project_id, user_id)
);

-- ============================================================================
-- MILESTONES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  due_date DATETIME NOT NULL,
  status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_status (status)
);

-- ============================================================================
-- SPRINTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sprints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
  velocity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id)
);

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  sprint_id INT,
  parent_id INT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  type ENUM('task', 'bug', 'feature', 'improvement', 'research', 'submission') DEFAULT 'task',
  priority ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
  status ENUM('backlog', 'todo', 'in_progress', 'review', 'done') DEFAULT 'backlog',
  assignee_id INT,
  reporter_id INT NOT NULL,
  milestone_id INT,
  due_date DATETIME,
  estimate_hours FLOAT,
  position INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  submission_status ENUM('submitted', 'approved', 'revision_required', 'rejected'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sprint_id) REFERENCES sprints(id),
  FOREIGN KEY (parent_id) REFERENCES tasks(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  FOREIGN KEY (milestone_id) REFERENCES milestones(id),
  INDEX idx_project (project_id),
  INDEX idx_status (status),
  INDEX idx_assignee (assignee_id)
);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content LONGTEXT NOT NULL,
  parent_comment_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id),
  INDEX idx_task (task_id)
);

-- ============================================================================
-- TIME LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS time_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  hours_logged FLOAT NOT NULL,
  log_date DATETIME NOT NULL,
  description LONGTEXT,
  synced_to_timesheet BOOLEAN DEFAULT FALSE,
  sync_status ENUM('pending', 'synced', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task (task_id),
  INDEX idx_user (user_id)
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Verify database creation
SELECT 'Database schema setup complete!' AS status;
