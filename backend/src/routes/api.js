const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

// Normal response
router.get("/normal", (req, res) => {
    logger.info("Normal endpoint hit");
    res.json({ status: "ok", message: "Normal response" });
});

// Slow response (3-5 sec delay)
router.get("/slow", (req, res) => {
    const delay = Math.floor(Math.random() * 3000) + 3000;
    logger.warn(`Slow endpoint delaying response by ${delay}ms`);
    setTimeout(() => {
        res.json({ status: "ok", message: `Delayed response (${delay}ms)` });
    }, delay);
});

// Simulated error response
router.get("/error", (req, res) => {
    logger.error("Error endpoint triggered");
    res.status(500).json({ status: "error", message: "Simulated server error" });
});

// Synthetic monitoring response
router.get("/synthetic", (req, res) => {
    res.json({ status: "ok", message: "Synthetic monitoring test response" });
});

module.exports = router;
