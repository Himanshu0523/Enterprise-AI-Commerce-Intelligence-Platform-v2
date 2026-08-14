const mongoose = require('mongoose');
const { calculateLogHash, GENESIS_HASH } = require('../utils/crypto');

const AuditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sequenceNumber: {
      type: Number,
      index: true,
    },
    actor: {
      id: { type: String, required: true, index: true },
      type: {
        type: String,
        enum: ['USER', 'ADMIN', 'SYSTEM', 'SERVICE', 'AI_AGENT', 'ANONYMOUS'],
        default: 'USER',
      },
      email: { type: String, default: null },
      ipAddress: { type: String, default: null },
      userAgent: { type: String, default: null },
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['AUTH', 'ORDER', 'PAYMENT', 'INVENTORY', 'PRICING', 'USER', 'SYSTEM', 'SECURITY', 'COMPLIANCE', 'AI_AGENT', 'OTHER'],
      default: 'SYSTEM',
      index: true,
    },
    severity: {
      type: String,
      enum: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'INFO',
      index: true,
    },
    targetResource: {
      resourceType: { type: String, default: 'GLOBAL', index: true },
      resourceId: { type: String, default: null, index: true },
    },
    details: {
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, default: null },
      diff: { type: mongoose.Schema.Types.Mixed, default: null },
      metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'ATTEMPTED', 'BLOCKED'],
      default: 'SUCCESS',
      index: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    correlationId: {
      type: String,
      default: null,
      index: true,
    },
    clientInfo: {
      origin: { type: String, default: null },
      serviceName: { type: String, default: 'gateway', index: true },
    },
    hash: {
      type: String,
      required: true,
      index: true,
    },
    previousHash: {
      type: String,
      required: true,
      default: GENESIS_HASH,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound indexes for ultra-fast query performance
AuditLogSchema.index({ category: 1, timestamp: -1 });
AuditLogSchema.index({ 'actor.id': 1, timestamp: -1 });
AuditLogSchema.index({ 'targetResource.resourceType': 1, 'targetResource.resourceId': 1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });

/**
 * Static method to fetch the latest audit log entry for hash chaining
 */
AuditLogSchema.statics.getLatestLog = async function () {
  return this.findOne().sort({ sequenceNumber: -1, timestamp: -1 }).lean();
};

/**
 * Static method to create and chain an individual audit log entry
 */
AuditLogSchema.statics.createChainedLog = async function (data) {
  const latestLog = await this.getLatestLog();
  const sequenceNumber = latestLog && typeof latestLog.sequenceNumber === 'number' ? latestLog.sequenceNumber + 1 : 1;
  const previousHash = latestLog && latestLog.hash ? latestLog.hash : GENESIS_HASH;

  const logId = data.logId || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

  const entryData = {
    ...data,
    logId,
    sequenceNumber,
    timestamp,
    previousHash,
  };

  const hash = calculateLogHash(entryData, previousHash);
  entryData.hash = hash;

  const logDoc = new this(entryData);
  return await logDoc.save();
};

/**
 * Static method to create multiple chained audit logs in a continuous sequential batch
 */
AuditLogSchema.statics.createChainedLogsBatch = async function (entriesArray) {
  if (!entriesArray || !Array.isArray(entriesArray) || entriesArray.length === 0) {
    return [];
  }

  const results = [];
  for (const entry of entriesArray) {
    const saved = await this.createChainedLog(entry);
    results.push(saved);
  }
  return results;
};

module.exports = mongoose.model('AuditLog', AuditLogSchema);
