import express, { Express, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// In-memory storage for time logs
const timeLogs: any[] = [];

// Mock intern.cutm.ac.in endpoints

// GET /timesheet/logs - Get all time logs
app.get('/timesheet/logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: timeLogs,
  });
});

// POST /timesheet/sync - Sync time logs from PMS
app.post('/timesheet/sync', (req: Request, res: Response) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'logs array required' },
      });
    }

    const synced = logs.map((log) => ({
      ...log,
      id: uuidv4(),
      synced_at: new Date().toISOString(),
      status: 'synced',
    }));

    timeLogs.push(...synced);

    res.json({
      success: true,
      data: {
        synced_count: synced.length,
        synced_ids: synced.map((l) => l.id),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
});

// GET /timesheet/status/:externalId - Check sync status
app.get('/timesheet/status/:externalId', (req: Request, res: Response) => {
  const log = timeLogs.find((l) => l.id === req.params.externalId);

  if (!log) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Log not found' },
    });
  }

  res.json({
    success: true,
    data: {
      external_id: log.id,
      status: log.status,
      synced_at: log.synced_at,
    },
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock Intern API running on port ${PORT}`);
  console.log(`   Simulating: intern.cutm.ac.in`);
  console.log(`   Endpoints:`);
  console.log(`   - GET /timesheet/logs`);
  console.log(`   - POST /timesheet/sync`);
  console.log(`   - GET /timesheet/status/:externalId`);
});
