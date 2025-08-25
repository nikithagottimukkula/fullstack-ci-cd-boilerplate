const express = require('express');
const { testConnection } = require('../config/database');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    };

    if (!dbConnected) {
      healthStatus.status = 'degraded';
    }

    res.status(dbConnected ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Readiness check (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready', reason: 'database not connected' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not ready', reason: error.message });
  }
});

// Liveness check (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
