const express = require("express");
const client = require("prom-client");
const winston = require("winston");

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Logger (Sends logs to Fluent Bit)
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// API Routes
app.get("/health", (req, res) => {
  logger.info("Health check endpoint hit");
  res.json({ status: "UP" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  logger.info(`Microservice running on port ${PORT}`);
});
