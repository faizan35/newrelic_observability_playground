require("dotenv").config();
require("./config/tracing"); // Load OpenTelemetry first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Logging each request
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// API Routes
app.use("/api", apiRoutes);

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
