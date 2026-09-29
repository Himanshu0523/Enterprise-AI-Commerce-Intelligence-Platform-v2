'use strict';

/**
 * @file packages/tracing/index.js
 * @description Shared OpenTelemetry bootstrap for all Node.js microservices.
 *
 * USAGE — Add this as the VERY FIRST line in each service's entry file:
 *   require('../../packages/tracing')('service-name');
 *
 * Environment Variables:
 *   OTEL_EXPORTER_OTLP_ENDPOINT  — Jaeger OTLP endpoint (default: http://jaeger:4318)
 *   OTEL_SERVICE_NAME             — Overrides the serviceName argument if set
 *   NODE_ENV                      — Sets deployment.environment attribute
 */

function resolveModule(name) {
  try {
    return require(name);
  } catch (e) {
    if (require.main && typeof require.main.require === 'function') {
      return require.main.require(name);
    }
    throw e;
  }
}

/**
 * Initializes OpenTelemetry tracing for the calling microservice.
 * Must be called BEFORE any other require statements.
 * @param {string} serviceName - The logical service name (e.g. 'order-service')
 */
function initTracing(serviceName) {
  try {
    const { NodeSDK } = resolveModule('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = resolveModule('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = resolveModule('@opentelemetry/exporter-trace-otlp-http');
    const { Resource } = resolveModule('@opentelemetry/resources');
    const { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } = resolveModule('@opentelemetry/semantic-conventions');

    const otlpEndpoint =
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://jaeger:4318';

    const exporter = new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
    });

    const sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || serviceName,
        [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
      }),
      traceExporter: exporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': { enabled: true },
          '@opentelemetry/instrumentation-express': { enabled: true },
          '@opentelemetry/instrumentation-mongoose': { enabled: true },
          '@opentelemetry/instrumentation-redis': { enabled: true },
          '@opentelemetry/instrumentation-ioredis': { enabled: true },
          '@opentelemetry/instrumentation-fs': { enabled: false },
        }),
      ],
    });

    sdk.start();

    process.on('SIGTERM', () => {
      sdk.shutdown().finally(() => process.exit(0));
    });
    process.on('SIGINT', () => {
      sdk.shutdown().finally(() => process.exit(0));
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[OTel] Tracing initialized for "${serviceName}" → ${otlpEndpoint}`
      );
    }
  } catch (err) {
    console.warn(`[OTel] Tracing disabled for "${serviceName}": ${err.message}`);
  }
}

module.exports = initTracing;
