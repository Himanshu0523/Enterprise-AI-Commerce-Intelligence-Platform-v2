const createLogger = (serviceName = 'microservice') => {
  return {
    info: (msg, meta = {}) => console.log(`[INFO] [${serviceName}] ${msg}`, Object.keys(meta).length ? meta : ''),
    warn: (msg, meta = {}) => console.warn(`[WARN] [${serviceName}] ${msg}`, Object.keys(meta).length ? meta : ''),
    error: (msg, err = {}) => console.error(`[ERROR] [${serviceName}] ${msg}`, err.message || err),
  };
};

module.exports = { createLogger };
