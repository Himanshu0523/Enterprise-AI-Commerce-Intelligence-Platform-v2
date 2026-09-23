'use strict';

/**
 * @file packages/tracing/index.js
 * @description Shared OpenTelemetry bootstrap for all Node.js microservices.
 *
 * USAGE — Add this as the VERY FIRST line in each service's entry file:
 *   require('../../packages/tracing')('service-name');
 *
 * Or from API gateway:
 *   require('../../../packages/tracing')('api-gateway');
 *
 * Environment Variables:
 *   OTEL_EXPORTER_OTLP_ENDPOINT  — Jaeger OTLP endpoint (default: http://jaeger:4318)
 *   OTEL_SERVICE_NAME             — Overrides the serviceName argument if set
 *   NODE_ENV                      — Sets deployment.environment attribute
 */

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } = require('@opentelemetry/semantic-conventions');

/**
 * Initializes OpenTelemetry tracing for the calling microservice.
 * Must be called BEFORE any other require statements.
 * @param {string} serviceName - The logical service name (e.g. 'order-service')
 */
function initTracing(serviceName) {
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
        // Instrument HTTP (covers Express routes & outgoing fetch)
        '@opentelemetry/instrumentation-http': { enabled: true },

        // Instrument Express middleware stack
        '@opentelemetry/instrumentation-express': { enabled: true },

        // Instrument Mongoose/MongoDB queries
        '@opentelemetry/instrumentation-mongoose': { enabled: true },

        // Instrument ioredis / node-redis calls
        '@opentelemetry/instrumentation-redis': { enabled: true },

        '@opentelemetry/instrumentation-ioredis': { enabled: true },
        
        // Disable noisy fs instrumentation
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  // Graceful shutdown — flush pending spans on process exit
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
}

module.exports = initTracing;
