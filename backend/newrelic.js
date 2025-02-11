"use strict";
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "MERN Observability Demo"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || "YOUR_LICENSE_KEY_HERE",
  logging: {
    level: "info",
  },
  distributed_tracing: {
    enabled: true,
  },
  // Add any additional configuration here as needed.
};
