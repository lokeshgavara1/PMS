require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Sync models (disabled - using manual SQL schema)
// sequelize.sync({ alter: false })
//   .then(() => {
//     console.log('✅ Models synced with database');
//   })
//   .catch(err => {
//     console.error('❌ Failed to sync models:', err);
//   });

// Routes
app.use('/api/v2/auth', require('./routes/auth.routes'));
app.use('/api/v2/projects', require('./routes/projects.routes'));
app.use('/api/v2/users', require('./routes/users.routes'));
app.use('/api/v2/tasks', require('./routes/tasks.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 CUTM-PMS API Server`);
  console.log(`📊 Listening on http://localhost:${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api/v2`);
  console.log(`💡 Health: http://localhost:${PORT}/health\n`);
});

module.exports = app;
