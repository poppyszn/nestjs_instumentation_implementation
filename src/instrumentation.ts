import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-service',
  [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
});

const traceExporter = new OTLPTraceExporter({
  headers: {},
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      headers: {}, // an optional object containing custom headers to be sent with each request
      concurrencyLimit: 1, // an optional limit on pending requests
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
