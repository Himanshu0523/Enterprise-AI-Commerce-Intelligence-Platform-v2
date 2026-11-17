'use strict';

// Set OTEL_SDK_DISABLED=true when this service has no configured OTLP collector.
// Check before requiring optional OpenTelemetry packages because Render installs
// dependencies from the service root, not the monorepo tracing package.
function initTracing(serviceName) {
  if (process.env.OTEL_SDK_DISABLED === 'true') {
    console.log(`[OTel] Tracing explicitly disabled for "${serviceName}".`);
    return;
  }

  try {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const { Resource } = require('@opentelemetry/resources');
    const {
      SEMRESATTRS_SERVICE_NAME,
      SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
    } = require('@opentelemetry/semantic-conventions');

    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://jaeger:4318';
    const sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || serviceName,
        [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
      }),
      traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    process.on('SIGTERM', () => sdk.shutdown().finally(() => process.exit(0)));
    process.on('SIGINT', () => sdk.shutdown().finally(() => process.exit(0)));
  } catch (error) {
    console.warn(`[OTel] Tracing unavailable for "${serviceName}": ${error.message}`);
  }
}

module.exports = initTracing;
