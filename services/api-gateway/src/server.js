// ── OpenTelemetry: MUST be first require before any other imports ──────────
require('../../../packages/tracing')('api-gateway');

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port} in ${config.nodeEnv} mode`);
});