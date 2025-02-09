const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ status: "error", message: err.message });
};

module.exports = errorHandler;
