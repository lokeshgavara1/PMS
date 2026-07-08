-- Create database and initial tables
CREATE DATABASE IF NOT EXISTS pms_db;
USE pms_db;

-- Users table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default users
INSERT INTO users (email, name, system_role) VALUES
('admin@cutm.ac.in', 'Admin User', 'admin'),
('hod@cutm.ac.in', 'HOD User', 'hod'),
('faculty@cutm.ac.in', 'Faculty User', 'faculty'),
('student@cutm.ac.in', 'Student User', 'student');

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_system_role ON users(system_role);
