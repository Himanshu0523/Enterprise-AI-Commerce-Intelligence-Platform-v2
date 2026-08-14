const crypto = require('crypto');

const GENESIS_HASH = 'GENESIS_HASH_0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Deterministically serialize any JavaScript value / object into a canonical JSON string.
 * Recursively sorts all object keys to ensure consistent hash generation across runs and platforms.
 *
 * @param {*} value - Value to serialize
 * @returns {string} Canonical JSON string
 */
function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalStringify).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  const pairs = keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(value[k])}`);
  return '{' + pairs.join(',') + '}';
}

/**
 * Computes a deterministic SHA-256 hash for an audit log entry.
 * Cryptographically binds the current log entry payload to the previous entry's hash
 * to form a tamper-evident blockchain-like chain of custody.
 *
 * @param {Object} entry - The audit log entry
 * @param {string} previousHash - SHA-256 hash of previous audit record
 * @returns {string} SHA-256 hex string
 */
function calculateLogHash(entry, previousHash = GENESIS_HASH) {
  const payload = {
    previousHash: previousHash || GENESIS_HASH,
    logId: entry.logId,
    actorId: entry.actor ? (entry.actor.id || entry.actor) : 'UNKNOWN',
    action: entry.action,
    category: entry.category || 'SYSTEM',
    targetResource: entry.targetResource ? `${entry.targetResource.resourceType || ''}:${entry.targetResource.resourceId || ''}` : '',
    timestamp: entry.timestamp instanceof Date ? entry.timestamp.toISOString() : (entry.timestamp || new Date().toISOString()),
    status: entry.status || 'SUCCESS',
    details: entry.details || entry.metadata || {},
  };

  const serialized = canonicalStringify(payload);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Validates the cryptographic integrity of an array of audit logs.
 * Iterates sequentially through the chain to verify:
 * 1. Unbroken hash linking: Current log's `previousHash` equals previous log's computed `hash`.
 * 2. Tamper-evident integrity: Re-computes SHA-256 hash of each log and compares with stored `hash`.
 *
 * @param {Array} logs - Sorted ascending by sequenceNumber / timestamp
 * @returns {Object} { isValid: boolean, count: number, corruptedLogId: string|null, index?: number, message: string }
 */
function verifyLogChainIntegrity(logs) {
  if (!logs || logs.length === 0) {
    return { isValid: true, count: 0, corruptedLogId: null, message: 'No logs to verify' };
  }

  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < logs.length; i++) {
    const current = logs[i];
    const logIdentifier = current.logId || current.id || `index_${i}`;

    // 1. Verify previousHash link
    if (i > 0 && current.previousHash !== expectedPrevHash) {
      return {
        isValid: false,
        count: logs.length,
        corruptedLogId: logIdentifier,
        index: i,
        message: `Hash link broken at index ${i} (${logIdentifier}): expected previousHash "${expectedPrevHash}", but found "${current.previousHash}"`,
      };
    }

    // 2. Re-compute payload hash to verify zero tampering
    const recalculatedHash = calculateLogHash(current, current.previousHash || expectedPrevHash);
    if (current.hash && current.hash !== recalculatedHash) {
      return {
        isValid: false,
        count: logs.length,
        corruptedLogId: logIdentifier,
        index: i,
        message: `Payload tampering detected at log ${logIdentifier}: stored hash "${current.hash}" does not match computed hash "${recalculatedHash}"`,
      };
    }

    expectedPrevHash = current.hash || recalculatedHash;
  }

  return {
    isValid: true,
    count: logs.length,
    corruptedLogId: null,
    message: `All ${logs.length} audit logs cryptographically verified. Hash chain is unbroken and intact.`,
  };
}

module.exports = {
  GENESIS_HASH,
  canonicalStringify,
  calculateLogHash,
  verifyLogChainIntegrity,
};
