// routes/fakeEvents.js
const express = require("express");
const router = express.Router();
const newrelic = require("newrelic");
const axios = require("axios"); // For making internal HTTP calls

// Fake Load Generator: Simulate CPU-intensive task
router.get("/fake-load", (req, res) => {
  console.log("Starting CPU load simulation...");
  const startTime = Date.now();
  let total = 0;
  for (let i = 0; i < 1e7; i++) {
    total += Math.sqrt(i);
  }
  const duration = Date.now() - startTime;
  newrelic.recordCustomEvent("FakeLoadEvent", { duration, iterations: 1e7 });
  res.json({ message: "Fake load generated", duration });
  console.log("Completed CPU load simulation. Duration:", duration, "ms");
});

  
// APM Simulation: Introduce an artificial delay
router.get("/simulate-apm", (req, res) => {
    const delay = Math.floor(Math.random() * 2500) + 500; // 500ms to 3000ms delay
    setTimeout(() => {
      newrelic.recordCustomEvent("FakeAPMEvent", { delay });
      res.json({ message: "APM simulated endpoint", delay });
      console.log("APM simulation complete. Delay:", delay, "ms");
    }, delay);
  });


// Infrastructure Monitoring: Generate random metrics
router.get("/simulate-infra", (req, res) => {
    const cpuUsage = (Math.random() * 100).toFixed(2);
    const memoryUsage = (Math.random() * 100).toFixed(2);
    const diskIO = (Math.random() * 1000).toFixed(0);
    newrelic.recordCustomEvent("FakeInfraEvent", { cpuUsage, memoryUsage, diskIO });
    res.json({
      message: "Infrastructure simulated",
      cpuUsage,
      memoryUsage,
      diskIO,
    });
    console.log("Infrastructure simulation complete:", { cpuUsage, memoryUsage, diskIO });
  });

  
// Browser Monitoring Simulation: Record a backend custom event for browser metrics
router.get("/browser-monitoring", (req, res) => {
    newrelic.recordCustomEvent("FakeBrowserEvent", { timestamp: Date.now() });
    res.json({ message: "Browser monitoring simulated" });
  });

  
// Synthetic Monitoring: Simulate a chain of internal calls
router.get("/simulate-synthetic", async (req, res) => {
    try {
      const port = process.env.PORT || 5000;
      const apmResponse = await axios.get(`http://localhost:${port}/simulate-apm`);
      const networkResponse = await axios.get(`http://localhost:${port}/simulate-network`);
      
      newrelic.recordCustomEvent("FakeSyntheticEvent", {
        apmDelay: apmResponse.data.delay,
        network: networkResponse.data,
      });
      
      res.json({
        message: "Synthetic monitoring simulated",
        apm: apmResponse.data,
        network: networkResponse.data,
      });
    } catch (err) {
      newrelic.noticeError(err);
      res.status(500).json({
        message: "Error during synthetic monitoring simulation",
        error: err.message,
      });
    }
  });

  
// Fake Log Generation: Simulate logging of both info and error messages
router.get("/fake-log", (req, res) => {
    console.log("Info: Fake log generation started.");
    newrelic.recordCustomEvent("FakeLogEvent", {
      level: "info",
      message: "Fake log started",
    });
    
    const error = new Error("Simulated error for fake logging");
    newrelic.noticeError(error);
    console.error("Error:", error.message);
    newrelic.recordCustomEvent("FakeLogEvent", {
      level: "error",
      message: error.message,
    });
    
    res.json({ message: "Fake log generation complete" });
  });

  
// Distributed Tracing: Chain calls and propagate headers
router.get("/simulate-tracing", async (req, res) => {
    try {
      const port = process.env.PORT || 5000;
      const apmResponse = await axios.get(`http://localhost:${port}/simulate-apm`, {
        headers: req.headers,
      });
      const infraResponse = await axios.get(`http://localhost:${port}/simulate-infra`, {
        headers: req.headers,
      });
      
      newrelic.recordCustomEvent("FakeDistributedTracingEvent", {
        apmDelay: apmResponse.data.delay,
        cpuUsage: infraResponse.data.cpuUsage,
      });
      
      res.json({
        message: "Distributed tracing simulation complete",
        apm: apmResponse.data,
        infra: infraResponse.data,
      });
    } catch (err) {
      newrelic.noticeError(err);
      res.status(500).json({
        message: "Error in distributed tracing simulation",
        error: err.message,
      });
    }
  });

  

// Network Performance Monitoring: Simulate network latency and occasional failures
router.get("/simulate-network", (req, res) => {
    const simulatedLatency = Math.floor(Math.random() * 1000) + 100; // 100ms to 1100ms
    setTimeout(() => {
      if (Math.random() < 0.3) {
        // 30% chance to simulate an error
        newrelic.noticeError(new Error("Simulated network error"));
        res.status(500).json({
          message: "Simulated network failure",
          latency: simulatedLatency,
        });
      } else {
        newrelic.recordCustomEvent("FakeNetworkEvent", { latency: simulatedLatency });
        res.json({
          message: "Network simulation successful",
          latency: simulatedLatency,
        });
      }
    }, simulatedLatency);
  });

  

// API Tracking: Simulate different API responses based on query parameters
router.get("/simulate-api", (req, res) => {
    const delay = parseInt(req.query.delay) || 0;
    const forceError = req.query.error === "true";
    setTimeout(() => {
      if (forceError) {
        const error = new Error("Simulated API error");
        newrelic.noticeError(error);
        res.status(500).json({ message: "Simulated API error", delay });
      } else {
        newrelic.recordCustomEvent("FakeAPIEvent", {
          delay,
          status: "success",
        });
        res.json({ message: "API simulation successful", delay });
      }
    }, delay);
  });

  


module.exports = router;
