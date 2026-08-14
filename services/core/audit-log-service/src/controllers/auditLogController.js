const AuditLog = require('../models/AuditLog');
const { calculateLogHash, verifyLogChainIntegrity, GENESIS_HASH } = require('../utils/crypto');
const { isDbConnected, onDbConnect } = require('../config/db');

// In-memory buffer fallback when MongoDB is running in detached or offline mode
let memoryLogs = [];

/**
 * Flushes buffered in-memory logs to MongoDB when the database becomes available.
 * Preserves the continuous cryptographic hash chain without creating gaps or duplicate sequence numbers.
 */
async function flushMemoryLogsToDb() {
  if (memoryLogs.length === 0 || !isDbConnected()) {
    return;
  }

  console.log(`[AuditLog] Starting synchronization of ${memoryLogs.length} buffered in-memory logs to MongoDB...`);
  const logsToSync = [...memoryLogs];
  memoryLogs = [];

  try {
    for (const memLog of logsToSync) {
      // Check if already in DB
      const existing = await AuditLog.findOne({ logId: memLog.logId }).lean();
      if (!existing) {
        await AuditLog.createChainedLog(memLog);
      }
    }
    console.log(`[AuditLog] Successfully synced ${logsToSync.length} logs to MongoDB.`);
  } catch (err) {
    console.error('[AuditLog] Error during memory-to-DB sync:', err.message);
    // Put back unsaved logs at the beginning of memoryLogs
    memoryLogs = [...logsToSync, ...memoryLogs];
  }
}

// Register sync handler for automatic trigger on DB connection
onDbConnect(flushMemoryLogsToDb);

/**
 * Normalizes actor information from request
 */
function parseActor(actorInput, req = {}) {
  const headers = req.headers || {};
  const ipAddress = headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || null;
  const userAgent = headers['user-agent'] || null;

  if (typeof actorInput === 'string') {
    return {
      id: actorInput,
      type: actorInput.startsWith('admin') ? 'ADMIN' : (actorInput.startsWith('agent') ? 'AI_AGENT' : (actorInput === 'SYSTEM' ? 'SYSTEM' : 'USER')),
      email: actorInput.includes('@') ? actorInput : null,
      ipAddress,
      userAgent,
    };
  }

  if (typeof actorInput === 'object' && actorInput !== null) {
    return {
      id: actorInput.id || actorInput.userId || actorInput.username || 'ANONYMOUS',
      type: actorInput.type || 'USER',
      email: actorInput.email || null,
      ipAddress: actorInput.ipAddress || ipAddress,
      userAgent: actorInput.userAgent || userAgent,
    };
  }

  return {
    id: 'ANONYMOUS',
    type: 'ANONYMOUS',
    email: null,
    ipAddress,
    userAgent,
  };
}

/**
 * Normalizes targetResource information
 */
function parseTargetResource(resourceInput) {
  if (typeof resourceInput === 'string') {
    const parts = resourceInput.split(':');
    if (parts.length > 1) {
      return { resourceType: parts[0], resourceId: parts.slice(1).join(':') };
    }
    return { resourceType: resourceInput, resourceId: null };
  }

  if (typeof resourceInput === 'object' && resourceInput !== null) {
    return {
      resourceType: resourceInput.resourceType || resourceInput.type || 'GLOBAL',
      resourceId: resourceInput.resourceId || resourceInput.id || null,
    };
  }

  return { resourceType: 'GLOBAL', resourceId: null };
}

/**
 * Internal log recorder used across controllers, Kafka consumer, and system events
 */
async function recordAuditLogInternal(rawEntry, req = {}) {
  const {
    actor,
    action,
    category = 'SYSTEM',
    severity = 'INFO',
    targetResource,
    details,
    metadata,
    status = 'SUCCESS',
    errorMessage = null,
    serviceName = 'api-gateway',
    correlationId = null,
  } = rawEntry;

  if (!actor || !action) {
    throw new Error('Actor and action are required fields for audit logging.');
  }

  const parsedActor = parseActor(actor, req);
  const parsedTarget = parseTargetResource(targetResource);
  const parsedDetails = details || { metadata: metadata || {} };

  const entryData = {
    actor: parsedActor,
    action: action.toUpperCase(),
    category: category.toUpperCase(),
    severity: severity.toUpperCase(),
    targetResource: parsedTarget,
    details: parsedDetails,
    status: status.toUpperCase(),
    errorMessage,
    correlationId: correlationId || (req.headers && (req.headers['x-correlation-id'] || req.headers['x-request-id'])) || null,
    clientInfo: {
      origin: req.headers && (req.headers['origin'] || req.headers['referer']),
      serviceName: serviceName || 'api-gateway',
    },
  };

  let savedEntry;

  if (isDbConnected()) {
    savedEntry = await AuditLog.createChainedLog(entryData);
  } else {
    // In-memory fallback with continuous hash chaining
    const latestMem = memoryLogs[memoryLogs.length - 1];
    const previousHash = latestMem ? latestMem.hash : GENESIS_HASH;
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date();
    const sequenceNumber = memoryLogs.length + 1;

    const memEntry = {
      ...entryData,
      logId,
      sequenceNumber,
      previousHash,
      timestamp,
    };

    memEntry.hash = calculateLogHash(memEntry, previousHash);
    memoryLogs.push(memEntry);
    savedEntry = memEntry;
  }

  if (['HIGH', 'CRITICAL'].includes(savedEntry.severity)) {
    console.warn(
      `🚨 [SECURITY ALERT] [${savedEntry.severity}] [${savedEntry.category}] Actor=${savedEntry.actor.id} Action=${savedEntry.action} Target=${savedEntry.targetResource.resourceType}:${savedEntry.targetResource.resourceId || 'GLOBAL'} Status=${savedEntry.status}`
    );
  } else {
    console.log(
      `[AUDIT LOG] [${savedEntry.severity}] [${savedEntry.category}] actor=${savedEntry.actor.id} action=${savedEntry.action} resource=${savedEntry.targetResource.resourceType}:${savedEntry.targetResource.resourceId || 'GLOBAL'} hash=${savedEntry.hash.substring(0, 10)}...`
    );
  }

  return savedEntry;
}

/**
 * POST /api/audit-logs
 * Records a single immutable audit log entry
 */
exports.createAuditLog = async (req, res) => {
  try {
    const savedEntry = await recordAuditLogInternal(req.body, req);

    return res.status(201).json({
      success: true,
      message: 'Audit log recorded securely with cryptographic SHA-256 hash verification',
      data: savedEntry,
    });
  } catch (error) {
    console.error('[AuditLog] Error creating audit log:', error);
    return res.status(error.message.includes('required fields') ? 400 : 500).json({
      success: false,
      error: error.message || 'Failed to record audit log',
    });
  }
};

/**
 * POST /api/audit-logs/batch
 * Ingests an array of audit log entries in continuous cryptographic sequence
 */
exports.createAuditLogBatch = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Logs array is required and must contain at least one audit entry.',
      });
    }

    const savedBatch = [];
    for (const logItem of logs) {
      const saved = await recordAuditLogInternal(logItem, req);
      savedBatch.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully ingested batch of ${savedBatch.length} audit logs`,
      data: savedBatch,
      count: savedBatch.length,
    });
  } catch (error) {
    console.error('[AuditLog] Error creating batch audit logs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record batch audit logs',
      details: error.message,
    });
  }
};

/**
 * GET /api/audit-logs
 * Retrieves paginated audit logs with search, filtering, and sorting
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const {
      actor,
      actorType,
      action,
      category,
      severity,
      status,
      resourceType,
      resourceId,
      serviceName,
      correlationId,
      startDate,
      endDate,
      search,
    } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (actor) query['actor.id'] = new RegExp(actor, 'i');
      if (actorType) query['actor.type'] = actorType.toUpperCase();
      if (action) query.action = new RegExp(action, 'i');
      if (category) query.category = category.toUpperCase();
      if (severity) query.severity = severity.toUpperCase();
      if (status) query.status = status.toUpperCase();
      if (resourceType) query['targetResource.resourceType'] = new RegExp(resourceType, 'i');
      if (resourceId) query['targetResource.resourceId'] = resourceId;
      if (serviceName) query['clientInfo.serviceName'] = serviceName;
      if (correlationId) query.correlationId = correlationId;

      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { action: searchRegex },
          { 'actor.id': searchRegex },
          { 'actor.email': searchRegex },
          { 'targetResource.resourceType': searchRegex },
          { 'targetResource.resourceId': searchRegex },
          { correlationId: searchRegex },
        ];
      }

      const [logs, total] = await Promise.all([
        AuditLog.find(query).sort({ sequenceNumber: -1, timestamp: -1 }).skip(skip).limit(limit).lean(),
        AuditLog.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return res.json({
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    }

    // In-memory query fallback
    let filtered = [...memoryLogs];

    if (actor) filtered = filtered.filter((l) => l.actor.id.toLowerCase().includes(actor.toLowerCase()));
    if (actorType) filtered = filtered.filter((l) => l.actor.type === actorType.toUpperCase());
    if (action) filtered = filtered.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
    if (category) filtered = filtered.filter((l) => l.category === category.toUpperCase());
    if (severity) filtered = filtered.filter((l) => l.severity === severity.toUpperCase());
    if (status) filtered = filtered.filter((l) => l.status === status.toUpperCase());
    if (resourceType) filtered = filtered.filter((l) => l.targetResource.resourceType.toLowerCase().includes(resourceType.toLowerCase()));
    if (resourceId) filtered = filtered.filter((l) => l.targetResource.resourceId === resourceId);
    if (serviceName) filtered = filtered.filter((l) => l.clientInfo && l.clientInfo.serviceName === serviceName);
    if (correlationId) filtered = filtered.filter((l) => l.correlationId === correlationId);
    if (startDate) filtered = filtered.filter((l) => new Date(l.timestamp) >= new Date(startDate));
    if (endDate) filtered = filtered.filter((l) => new Date(l.timestamp) <= new Date(endDate));

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.actor.id.toLowerCase().includes(q) ||
          (l.targetResource.resourceType && l.targetResource.resourceType.toLowerCase().includes(q)) ||
          (l.correlationId && l.correlationId.toLowerCase().includes(q))
      );
    }

    // Sort descending by timestamp
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('[AuditLog] Error retrieving logs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve audit logs',
      details: error.message,
    });
  }
};

/**
 * GET /api/audit-logs/:id
 * Retrieves a single audit log entry by ID or logId
 */
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    let log;
    if (isDbConnected()) {
      log = await AuditLog.findOne({
        $or: [{ logId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      }).lean();
    } else {
      log = memoryLogs.find((l) => l.logId === id || l.id === id);
    }

    if (!log) {
      return res.status(404).json({ success: false, error: 'Audit log entry not found' });
    }

    return res.json({ success: true, data: log });
  } catch (error) {
    console.error('[AuditLog] Error retrieving single log:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/audit-logs/verify-chain
 * Validates the cryptographic SHA-256 hash chain across all audit logs
 */
exports.verifyChain = async (req, res) => {
  try {
    let logs = [];
    if (isDbConnected()) {
      logs = await AuditLog.find().sort({ sequenceNumber: 1, timestamp: 1 }).lean();
    } else {
      logs = [...memoryLogs].sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
    }

    const result = verifyLogChainIntegrity(logs);

    return res.json({
      success: true,
      data: {
        ...result,
        verifiedAt: new Date().toISOString(),
        algorithm: 'SHA-256-Blockchain-Chaining',
      },
    });
  } catch (error) {
    console.error('[AuditLog] Error verifying chain:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/audit-logs/stats
 * Aggregates operational, category, severity, and compliance statistics
 */
exports.getAuditStats = async (req, res) => {
  try {
    if (isDbConnected()) {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [totalLogs, categoryStats, severityStats, recentCritical, topActors] = await Promise.all([
        AuditLog.countDocuments(),
        AuditLog.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        AuditLog.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
        AuditLog.countDocuments({
          timestamp: { $gte: last24h },
          severity: { $in: ['HIGH', 'CRITICAL'] },
        }),
        AuditLog.aggregate([
          { $group: { _id: '$actor.id', count: { $sum: 1 }, actorType: { $first: '$actor.type' } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
      ]);

      return res.json({
        success: true,
        data: {
          totalLogs,
          recentCritical24h: recentCritical,
          categories: categoryStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
          severities: severityStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
          topActors: topActors.map((a) => ({ actor: a._id, type: a.actorType, eventCount: a.count })),
          timestamp: new Date().toISOString(),
        },
      });
    }

    // In-memory stats fallback
    const totalLogs = memoryLogs.length;
    const categories = {};
    const severities = {};
    const actorCounts = {};
    let recentCritical24h = 0;
    const now = Date.now();

    memoryLogs.forEach((l) => {
      categories[l.category] = (categories[l.category] || 0) + 1;
      severities[l.severity] = (severities[l.severity] || 0) + 1;
      if (['HIGH', 'CRITICAL'].includes(l.severity) && now - new Date(l.timestamp).getTime() < 86400000) {
        recentCritical24h++;
      }
      if (l.actor && l.actor.id) {
        actorCounts[l.actor.id] = (actorCounts[l.actor.id] || 0) + 1;
      }
    });

    const topActors = Object.entries(actorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([actor, count]) => ({ actor, type: 'USER', eventCount: count }));

    return res.json({
      success: true,
      data: {
        totalLogs,
        recentCritical24h,
        categories,
        severities,
        topActors,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[AuditLog] Error retrieving stats:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/audit-logs/export
 * Exports audit logs as CSV or JSON for SOC-2, ISO-27001, and PCI-DSS compliance audits
 */
exports.exportAuditLogs = async (req, res) => {
  try {
    const format = (req.query.format || 'json').toLowerCase();

    let logs = [];
    if (isDbConnected()) {
      logs = await AuditLog.find().sort({ timestamp: -1 }).limit(2000).lean();
    } else {
      logs = [...memoryLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    const filename = `audit_compliance_export_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      const headers = ['LogID', 'Timestamp', 'Actor', 'ActorType', 'Action', 'Category', 'Severity', 'Resource', 'Status', 'Hash', 'PreviousHash'];
      const rows = logs.map((l) => [
        `"${l.logId}"`,
        `"${new Date(l.timestamp).toISOString()}"`,
        `"${l.actor ? l.actor.id : ''}"`,
        `"${l.actor ? l.actor.type : ''}"`,
        `"${l.action}"`,
        `"${l.category}"`,
        `"${l.severity}"`,
        `"${l.targetResource ? `${l.targetResource.resourceType}:${l.targetResource.resourceId || ''}` : ''}"`,
        `"${l.status}"`,
        `"${l.hash}"`,
        `"${l.previousHash || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csvContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
    return res.json({
      exportDate: new Date().toISOString(),
      totalRecords: logs.length,
      complianceStandard: 'SOC-2 / ISO-27001 / PCI-DSS Audit Trail',
      records: logs,
    });
  } catch (error) {
    console.error('[AuditLog] Export error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Export internal helper
exports.recordAuditLogInternal = recordAuditLogInternal;
exports.flushMemoryLogsToDb = flushMemoryLogsToDb;
