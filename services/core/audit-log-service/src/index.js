const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3012;
const auditLogs = [];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'audit-log-service', port: PORT });
});

app.post('/api/audit-logs', (req, res) => {
  const { actor, action, targetResource, metadata } = req.body;
  if (!actor || !action) {
    return res.status(400).json({ success: false, error: 'Actor and action are required' });
  }

  const logEntry = {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    actor,
    action,
    targetResource: targetResource || 'GLOBAL',
    metadata: metadata || {},
    timestamp: new Date().toISOString(),
  };

  auditLogs.push(logEntry);
  console.log(`[AUDIT LOG] [${logEntry.actor}] -> ${logEntry.action} on ${logEntry.targetResource}`);
  res.status(201).json({ success: true, data: logEntry });
});

app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, count: auditLogs.length, data: auditLogs });
});

app.listen(PORT, () => {
  console.log(`Audit Log Service running on port ${PORT}`);
});
