const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

// Create OpenTelemetry SDK instance
const sdk = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "observability-demo-backend",
    }),
    traceExporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }), // Change to your OTLP endpoint
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
    ],
});

// Start SDK (no need for `.then()`)
sdk.start();
console.log("✅ OpenTelemetry tracing initialized.");

// Graceful shutdown handling
process.on("SIGTERM", async () => {
    await sdk.shutdown();
    console.log("OpenTelemetry SDK shut down.");
});
