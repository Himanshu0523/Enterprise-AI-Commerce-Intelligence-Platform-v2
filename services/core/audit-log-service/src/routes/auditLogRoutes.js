const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// Aggregate statistics & compliance metrics (before /:id parameter)
router.get('/stats', auditLogController.getAuditStats);

// Cryptographic hash chain verification
router.get('/verify-chain', auditLogController.verifyChain);

// Compliance data export (CSV / JSON)
router.get('/export', auditLogController.exportAuditLogs);

// Query and list audit logs (with filters & pagination)
router.get('/', auditLogController.getAuditLogs);

// Single audit log by ID
router.get('/:id', auditLogController.getAuditLogById);

// Create new audit log entry
router.post('/', auditLogController.createAuditLog);

// Batch audit log ingestion
router.post('/batch', auditLogController.createAuditLogBatch);

module.exports = router;
