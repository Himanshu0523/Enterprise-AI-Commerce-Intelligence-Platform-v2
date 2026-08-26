const { v4: uuidv4 } = require('uuid');

function getCorrelationId(req) {
  return req?.correlationId || req?.headers?.['x-correlation-id'] || uuidv4();
}

module.exports = { getCorrelationId };
