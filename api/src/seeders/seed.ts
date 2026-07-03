import bcrypt from 'bcrypt';
import sequelize from '../config/database';
import { initializeModels } from '../models';

const models = initializeModels(sequelize);

async function seed() {
  try {
    // Disable foreign key checks for truncate
    await sequelize.query('SET FOREIGN_KEY_CHECKS=0');

    // Clear existing data
    await sequelize.truncate({ cascade: true });

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS=1');
    console.log('✅ Cleared existing data');

    // Create departments
    const depts = await models.Department.bulkCreate([
      { id: 1, name: 'Computer Science', code: 'CS' },
      { id: 2, name: 'Electronics', code: 'ECE' },
      { id: 3, name: 'Mechanical', code: 'MECH' },
    ]);
    console.log('✅ Created departments');

    // Create users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await models.User.bulkCreate([
      {
        id: 1,
        email: 'admin@cutm.ac.in',
        name: 'Admin User',
        password_hash: hashedPassword,
        system_role: 'admin',
        department_id: 1,
      },
      {
        id: 2,
        email: 'hod.cse@cutm.ac.in',
        name: 'Dr. HOD',
        password_hash: hashedPassword,
        system_role: 'hod',
        department_id: 1,
      },
      {
        id: 3,
        email: 'faculty1@cutm.ac.in',
        name: 'Prof. Faculty',
        password_hash: hashedPassword,
        system_role: 'faculty',
        department_id: 1,
      },
      {
        id: 4,
        email: 'pm@cutm.ac.in',
        name: 'Project Manager',
        password_hash: hashedPassword,
        system_role: 'pm',
        department_id: 1,
      },
      {
        id: 5,
        email: 'student1@cutm.ac.in',
        name: 'Student One',
        password_hash: hashedPassword,
        system_role: 'student',
        department_id: 1,
      },
      {
        id: 6,
        email: 'faculty2@cutm.ac.in',
        name: 'Dr. Another Faculty',
        password_hash: hashedPassword,
        system_role: 'faculty',
        department_id: 1,
      },
      {
        id: 7,
        email: 'student2@cutm.ac.in',
        name: 'Student Two',
        password_hash: hashedPassword,
        system_role: 'student',
        department_id: 1,
      },
      {
        id: 8,
        email: 'student3@cutm.ac.in',
        name: 'Student Three',
        password_hash: hashedPassword,
        system_role: 'student',
        department_id: 1,
      },
      {
        id: 9,
        email: 'student4@cutm.ac.in',
        name: 'Student Four',
        password_hash: hashedPassword,
        system_role: 'student',
        department_id: 1,
      },
      {
        id: 10,
        email: 'student5@cutm.ac.in',
        name: 'Student Five',
        password_hash: hashedPassword,
        system_role: 'student',
        department_id: 1,
      },
    ]);
    console.log('✅ Created users');

    // Create projects
    const projects = await models.Project.bulkCreate([
      {
        id: 1,
        name: 'B.Tech Final Year Capstone 2027',
        description: 'Final year capstone project for CSE batch 2023',
        owner_id: 1,
        category: 'academic',
        status: 'active',
        start_date: new Date('2026-01-01'),
        end_date: new Date('2026-12-31'),
      },
      {
        id: 2,
        name: 'IoT Research Initiative',
        description: 'Research on Internet of Things applications in campus infrastructure',
        owner_id: 2,
        category: 'research',
        status: 'active',
        start_date: new Date('2026-02-01'),
        end_date: new Date('2026-05-31'),
      },
      {
        id: 3,
        name: 'Campus Network Upgrade',
        description: 'Upgrade campus IT infrastructure and network',
        owner_id: 1,
        category: 'admin',
        status: 'planning',
        start_date: new Date('2026-06-01'),
        end_date: new Date('2026-12-31'),
      },
      {
        id: 4,
        name: 'Library Automation System',
        description: 'Implement automated book management and tracking system',
        owner_id: 3,
        category: 'infrastructure',
        status: 'active',
        start_date: new Date('2026-03-01'),
        end_date: new Date('2026-11-30'),
      },
    ]);
    console.log('✅ Created projects');

    // Create tasks
    await models.Task.bulkCreate([
      {
        id: 1,
        project_id: 1,
        parent_id: null,
        title: 'Setup Kanban board UI',
        description: 'Implement drag-and-drop Kanban board using React',
        type: 'feature',
        priority: 'medium',
        status: 'backlog',
        assignee_id: 5,
        reporter_id: 1,
        due_date: new Date('2026-03-15'),
        estimate_hours: 16,
        position: 1,
      },
      {
        id: 2,
        project_id: 1,
        parent_id: null,
        title: 'Create task model and API',
        description: 'Define Task entity, create database schema, implement RESTful API',
        type: 'feature',
        priority: 'high',
        status: 'todo',
        assignee_id: 4,
        reporter_id: 1,
        due_date: new Date('2026-02-28'),
        estimate_hours: 24,
        position: 2,
      },
      {
        id: 3,
        project_id: 1,
        parent_id: null,
        title: 'Implement user authentication',
        description: 'Setup JWT-based authentication and user management module',
        type: 'feature',
        priority: 'critical',
        status: 'in_progress',
        assignee_id: 6,
        reporter_id: 1,
        due_date: new Date('2026-02-15'),
        estimate_hours: 32,
        position: 3,
      },
      {
        id: 4,
        project_id: 1,
        parent_id: null,
        title: 'Set up project repository',
        description: 'Initialize git repo, setup CI/CD pipeline',
        type: 'task',
        priority: 'high',
        status: 'done',
        assignee_id: 1,
        reporter_id: 1,
        due_date: new Date('2026-01-15'),
        estimate_hours: 8,
        position: 4,
      },
      {
        id: 5,
        project_id: 1,
        parent_id: null,
        title: 'Create project documentation',
        description: 'Write comprehensive documentation for project setup and usage',
        type: 'documentation',
        priority: 'medium',
        status: 'done',
        assignee_id: 3,
        reporter_id: 1,
        due_date: new Date('2026-01-31'),
        estimate_hours: 12,
        position: 5,
      },
    ]);
    console.log('✅ Created tasks');

    // Create sprints
    await models.Sprint.bulkCreate([
      {
        id: 1,
        project_id: 1,
        name: 'Sprint 1',
        start_date: new Date('2026-01-01'),
        end_date: new Date('2026-02-14'),
        status: 'completed',
        velocity: 40,
      },
      {
        id: 2,
        project_id: 1,
        name: 'Sprint 2',
        start_date: new Date('2026-02-15'),
        end_date: new Date('2026-03-31'),
        status: 'active',
      },
    ]);
    console.log('✅ Created sprints');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSeeded Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:             admin@cutm.ac.in / password123');
    console.log('HOD:               hod.cse@cutm.ac.in / password123');
    console.log('Faculty:           faculty1@cutm.ac.in / password123');
    console.log('Project Manager:   pm@cutm.ac.in / password123');
    console.log('Student:           student1@cutm.ac.in / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
