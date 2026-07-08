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
-- INSERT DEFAULT USERS
-- ============================================================================
INSERT INTO users (email, name, password_hash, system_role, is_active) VALUES
('admin@cutm.ac.in', 'Admin User', '$2a$10$N9qo8uLOickgx2ZMRZoMye4j0Dn8e.ZfOm5KzxV3F.4Z0a9E7p5ve', 'admin', TRUE),
('hod@cutm.ac.in', 'HOD User', '$2a$10$N9qo8uLOickgx2ZMRZoMye4j0Dn8e.ZfOm5KzxV3F.4Z0a9E7p5ve', 'hod', TRUE),
('faculty@cutm.ac.in', 'Faculty User', '$2a$10$N9qo8uLOickgx2ZMRZoMye4j0Dn8e.ZfOm5KzxV3F.4Z0a9E7p5ve', 'faculty', TRUE),
('student@cutm.ac.in', 'Student User', '$2a$10$N9qo8uLOickgx2ZMRZoMye4j0Dn8e.ZfOm5KzxV3F.4Z0a9E7p5ve', 'student', TRUE);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================
INSERT INTO projects (name, description, category, visibility, status, owner_id, start_date, end_date) VALUES
('Web Development Project', 'Building a modern web application', 'academic', 'private', 'active', 1, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH)),
('Mobile App Development', 'Developing a mobile application', 'academic', 'private', 'active', 1, NOW(), DATE_ADD(NOW(), INTERVAL 4 MONTH)),
('Data Analytics Research', 'Research on data analytics', 'research', 'department', 'planning', 2, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH));

INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'owner'),
(1, 3, 'member'),
(1, 4, 'member'),
(2, 1, 'owner'),
(2, 2, 'lead'),
(3, 2, 'owner');

INSERT INTO tasks (project_id, title, description, type, priority, status, assignee_id, reporter_id, due_date, estimate_hours) VALUES
(1, 'Setup project repository', 'Initialize Git repository and configure CI/CD', 'task', 'high', 'done', 3, 1, NOW(), 4),
(1, 'Design database schema', 'Create and document database design', 'task', 'high', 'in_progress', 3, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 8),
(1, 'Implement authentication', 'Add JWT-based authentication system', 'feature', 'critical', 'todo', 4, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 16),
(2, 'API Development', 'Build RESTful API endpoints', 'feature', 'high', 'todo', 2, 2, DATE_ADD(NOW(), INTERVAL 10 DAY), 20);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Verify database creation
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as task_count FROM tasks;
