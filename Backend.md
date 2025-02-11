# Backend Developer Instructions for the MERN Observability Demo

**Project Overview:**  
Develop a Node.js/Express backend that supports two main features:

1. **Todo CRUD API:** Standard RESTful endpoints to create, read, update, and delete todo items stored in MongoDB.
2. **Observability Simulation Endpoints:** A set of endpoints that simulate various monitoring scenarios. These endpoints generate fake data or behaviors for New Relic to capture and display. The simulated endpoints include:
   - Fake Load Generator
   - Application Performance Monitoring (APM)
   - Infrastructure Monitoring
   - Browser Monitoring (if needed for extra simulation)
   - Synthetic Monitoring
   - Fake Log Generation
   - Distributed Tracing
   - Network Performance Monitoring
   - API Tracking

Each endpoint should be instrumented with New Relic’s Node agent to record custom events, simulate errors, delays, and propagate distributed tracing data.

---

## 1. Project Setup & Folder Structure

### a. Repository Layout

Set up the project repository with a clear separation of concerns. A sample structure might look like:

```
/backend
├── index.js               // Main entry point: require New Relic before other modules!
├── newrelic.js            // New Relic configuration file
├── package.json
├── /routes
│     ├── todos.js         // CRUD endpoints for Todo items
│     └── fakeEvents.js    // Endpoints for simulated observability events
├── /models
│     └── Todo.js          // Mongoose model/schema for Todo items
└── /utils
      └── logger.js        // (Optional) A utility for logging if needed
```

### b. Environment Variables

Use environment variables for sensitive data and configuration. This includes:

- **New Relic License Key**
- **Application Name**
- **MongoDB Connection URI**

Create a `.env` file (or use your preferred configuration method) and document its expected keys.

---

## 2. New Relic Integration

### a. Installation & Configuration

1. **Install New Relic:**
   ```bash
   npm install newrelic
   ```
2. **Configuration File (`newrelic.js`):**  
   Create a `newrelic.js` file at the project root (or in the backend folder). Populate it with your configuration. For example:
   ```js
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
     // ... other configuration as needed
   };
   ```
3. **Critical Step – Require New Relic First:**  
   In your `index.js`, ensure that you load New Relic _before_ any other modules:

   ```js
   // index.js
   require("newrelic"); // Must be at the top!
   const express = require("express");
   const mongoose = require("mongoose");
   const bodyParser = require("body-parser");
   const dotenv = require("dotenv");

   // Load environment variables from .env file
   dotenv.config();

   // Initialize Express
   const app = express();
   app.use(bodyParser.json());

   // Import routes
   const todosRoute = require("./routes/todos");
   const fakeEventsRoute = require("./routes/fakeEvents");

   // Connect to MongoDB
   mongoose
     .connect(process.env.MONGODB_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
     .then(() => console.log("Connected to MongoDB"))
     .catch((err) => console.error("MongoDB connection error:", err));

   // Use routes
   app.use("/todos", todosRoute);
   app.use("/", fakeEventsRoute);

   // Start the server
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Distributed Tracing:**  
   Ensure that New Relic distributed tracing is enabled in your configuration and that you propagate tracing headers in your internal calls (see below under the Distributed Tracing endpoint).

---

## 3. Implementing the Todo CRUD Endpoints

### a. Model (Mongoose Schema)

Create a file `models/Todo.js`:

```js
const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", TodoSchema);
```

### b. Routes (todos.js)

Create a file `routes/todos.js` that implements the following endpoints:

- **GET `/todos`** – Retrieve all todos.
- **POST `/todos`** – Create a new todo.
- **PUT `/todos/:id`** – Update a todo.
- **DELETE `/todos/:id`** – Delete a todo.

A sample implementation might look like:

```js
const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
router.post("/", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a todo
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.text != null) {
      todo.text = req.body.text;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.remove();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

---

## 4. Implementing Observability Simulation Endpoints

Create a file `routes/fakeEvents.js`. This file will contain all endpoints for generating fake monitoring data.

### a. General Guidelines

- **Custom Events:** Use `newrelic.recordCustomEvent()` to log custom events (e.g., `FakeLoadEvent`, `FakeInfraEvent`, etc.).
- **Simulated Behavior:** For many endpoints, simulate delays using `setTimeout()`, loops, or asynchronous tasks.
- **Error Handling:** Use `newrelic.noticeError(new Error('...'))` to log simulated errors.
- **Distributed Tracing:** When simulating a chain of calls, propagate headers (e.g., using Axios or node-fetch) to ensure the entire request chain appears as one distributed trace.

### b. Endpoint Implementations

Below are sample implementations for each endpoint:

#### 1. **Fake Load Generator**

- **Endpoint:** `GET /fake-load`
- **Behavior:** Simulate CPU load using a busy loop or mathematical calculations.
- **Implementation:**
  ```js
  const newrelic = require("newrelic");
  router.get("/fake-load", (req, res) => {
    const startTime = Date.now();
    // Simulate CPU-intensive task: a loop for a fixed number of iterations
    let total = 0;
    for (let i = 0; i < 1e7; i++) {
      total += Math.sqrt(i);
    }
    const duration = Date.now() - startTime;
    newrelic.recordCustomEvent("FakeLoadEvent", { duration, iterations: 1e7 });
    res.json({ message: "Fake load generated", duration });
  });
  ```

#### 2. **Application Performance Monitoring (APM)**

- **Endpoint:** `GET /simulate-apm`
- **Behavior:** Introduce an artificial delay to simulate a slow response.
- **Implementation:**
  ```js
  router.get("/simulate-apm", (req, res) => {
    const delay = Math.floor(Math.random() * 2500) + 500; // 500ms to 3000ms delay
    setTimeout(() => {
      newrelic.recordCustomEvent("FakeAPMEvent", { delay });
      res.json({ message: "APM simulated endpoint", delay });
    }, delay);
  });
  ```

#### 3. **Infrastructure Monitoring**

- **Endpoint:** `GET /simulate-infra`
- **Behavior:** Generate random infrastructure metrics.
- **Implementation:**
  ```js
  router.get("/simulate-infra", (req, res) => {
    const cpuUsage = (Math.random() * 100).toFixed(2);
    const memoryUsage = (Math.random() * 100).toFixed(2);
    const diskIO = (Math.random() * 1000).toFixed(0);
    newrelic.recordCustomEvent("FakeInfraEvent", {
      cpuUsage,
      memoryUsage,
      diskIO,
    });
    res.json({
      message: "Infrastructure simulated",
      cpuUsage,
      memoryUsage,
      diskIO,
    });
  });
  ```

#### 4. **Browser Monitoring Simulation**

- **Endpoint:** `GET /browser-monitoring`
- **Behavior:** Although the browser agent captures most metrics, you can simulate a backend call that records a custom event.
- **Implementation:**
  ```js
  router.get("/browser-monitoring", (req, res) => {
    newrelic.recordCustomEvent("FakeBrowserEvent", { timestamp: Date.now() });
    res.json({ message: "Browser monitoring simulated" });
  });
  ```

#### 5. **Synthetic Monitoring**

- **Endpoint:** `GET /simulate-synthetic`
- **Behavior:** Make internal calls to other endpoints (e.g., `/simulate-apm` and `/simulate-network`) sequentially or in parallel. Ensure distributed tracing headers are passed.
- **Implementation:**
  ```js
  const axios = require("axios");
  router.get("/simulate-synthetic", async (req, res) => {
    try {
      // Example: call simulate-apm and simulate-network endpoints
      const apmResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5000}/simulate-apm`
      );
      const networkResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5000}/simulate-network`
      );
      // Record a custom event for the synthetic monitoring
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
  ```

#### 6. **Fake Log Generation**

- **Endpoint:** `GET /fake-log`
- **Behavior:** Log several messages, including simulated errors.
- **Implementation:**
  ```js
  router.get("/fake-log", (req, res) => {
    console.log("Info: Fake log generation started.");
    newrelic.recordCustomEvent("FakeLogEvent", {
      level: "info",
      message: "Fake log started",
    });
    // Simulate an error log
    const error = new Error("Simulated error for fake logging");
    newrelic.noticeError(error);
    console.error("Error:", error.message);
    newrelic.recordCustomEvent("FakeLogEvent", {
      level: "error",
      message: error.message,
    });
    res.json({ message: "Fake log generation complete" });
  });
  ```

#### 7. **Distributed Tracing**

- **Endpoint:** `GET /simulate-tracing`
- **Behavior:** Simulate a distributed transaction by chaining internal endpoint calls. Pass distributed tracing headers as needed.
- **Implementation:**
  ```js
  router.get("/simulate-tracing", async (req, res) => {
    try {
      // First internal call: simulate-apm
      const apmResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5000}/simulate-apm`,
        {
          headers: req.headers, // Propagate headers for distributed tracing
        }
      );
      // Second internal call: simulate-infra
      const infraResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5000}/simulate-infra`,
        {
          headers: req.headers,
        }
      );
      // Record distributed tracing event
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
  ```

#### 8. **Network Performance Monitoring**

- **Endpoint:** `GET /simulate-network`
- **Behavior:** Simulate network latency and occasional failures.
- **Implementation:**
  ```js
  router.get("/simulate-network", (req, res) => {
    const simulatedLatency = Math.floor(Math.random() * 1000) + 100; // 100ms to 1100ms
    setTimeout(() => {
      // Randomly decide to simulate an error
      if (Math.random() < 0.3) {
        // 30% chance of error
        newrelic.noticeError(new Error("Simulated network error"));
        res.status(500).json({
          message: "Simulated network failure",
          latency: simulatedLatency,
        });
      } else {
        newrelic.recordCustomEvent("FakeNetworkEvent", {
          latency: simulatedLatency,
        });
        res.json({
          message: "Network simulation successful",
          latency: simulatedLatency,
        });
      }
    }, simulatedLatency);
  });
  ```

#### 9. **API Tracking**

- **Endpoint:** `GET /simulate-api`
- **Behavior:** Simulate different API responses based on query parameters.
- **Implementation:**
  ```js
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
  ```

### c. Registering Routes

In your `index.js`, ensure that you import and use the `fakeEvents.js` routes:

```js
const fakeEventsRoute = require("./routes/fakeEvents");
app.use("/", fakeEventsRoute);
```

---

## 5. Testing & Verification

### a. Local Testing

- **Run the Backend:**  
  Start your server and test each endpoint using tools like Postman or cURL.
- **Verify New Relic Data:**  
  Check your New Relic dashboard to see if the custom events and errors are being reported as expected.
- **Distributed Tracing:**  
  Validate that the chained calls in the `/simulate-tracing` endpoint show up as one distributed trace in New Relic APM.

### b. Error Handling & Logging

- Ensure that all simulated errors are caught and logged properly with `newrelic.noticeError()`.
- Use console logs (or a logging utility) to aid debugging during development, but ensure production logs are clean.

---

## 6. Code Quality & Documentation

- **Comments & Documentation:**  
  Add inline comments, especially around the New Relic integration points and the simulation logic.
- **Modularity:**  
  If any common simulation logic is repeated, consider refactoring into utility functions under `/utils`.
- **Testing:**  
  Write unit tests (using Mocha/Chai, Jest, etc.) for key endpoints to ensure simulated delays, errors, and custom events work as expected.

---

## 7. Final Notes

- **Collaboration:**  
  Communicate closely with the frontend developer to confirm endpoint URLs, HTTP methods, and expected response structures.
- **Iterate & Enhance:**  
  This demo is meant to be a playground. Feel free to enhance the simulation (e.g., add configurable parameters via query strings or request bodies) to experiment further with New Relic’s observability capabilities.
- **Deployment:**  
  Consider containerizing the backend (with Docker) for consistency in local and production environments. Document the deployment process in your README.

By following these detailed instructions, you’ll implement a robust Node.js backend that not only serves the Todo CRUD operations but also generates a variety of simulated events for comprehensive observability testing with New Relic.

Happy coding and observability exploration!

---

Below is a detailed, day‐by‐day project plan that breaks down the tasks for creating the MERN Observability Demo backend. This plan assumes an 8‑day schedule, though you can adjust the pace based on your team’s workflow and priorities.

---

## **Day 1 – Project Kick-Off & Initial Setup**

- **Repository & Version Control**
  - Initialize a new Git repository.
  - Create a `.gitignore` file (node_modules, .env, etc.).
  - Set up your project folder structure:
    ```
    /backend
    ├── index.js
    ├── newrelic.js
    ├── package.json
    ├── .env
    ├── /models
    ├── /routes
    └── /utils
    ```
- **Project Initialization**

  - Run `npm init -y` to generate a basic `package.json`.
  - Install core dependencies:
    ```bash
    npm install express mongoose body-parser dotenv
    ```
  - (Optional) Install development dependencies like Nodemon:
    ```bash
    npm install --save-dev nodemon
    ```

- **Basic Server Setup**

  - Create a basic `index.js` file that starts an Express server.
  - Use `dotenv` to load environment variables from `.env`.
  - Create a placeholder route to verify the server is running.
  - Test locally by running the server.

- **Documentation**
  - Write an initial `README.md` describing the project and planned features.

---

## **Day 2 – New Relic Integration Setup**

- **Install New Relic**
  - Install New Relic with:
    ```bash
    npm install newrelic
    ```
- **Create New Relic Configuration**
  - Create `newrelic.js` at the project root with configuration that uses environment variables:
    ```js
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
    };
    ```
- **Ensure Proper Loading Order**
  - In `index.js`, require New Relic at the very top:
    ```js
    require("newrelic");
    ```
- **Set Up Environment Variables**

  - Create a `.env` file with at least the following:
    ```ini
    PORT=5000
    MONGODB_URI=mongodb://your-mongodb-uri
    NEW_RELIC_LICENSE_KEY=your_new_relic_license_key
    NEW_RELIC_APP_NAME="MERN Observability Demo"
    ```

- **Validation**
  - Run the server and check the logs to ensure New Relic is loading properly.

---

## **Day 3 – Database Connection & Todo CRUD API**

- **MongoDB Setup**

  - Update `index.js` to establish a connection to MongoDB using Mongoose.
  - Add connection error handling and log successful connection messages.

- **Create Mongoose Model**

  - In `/models/Todo.js`, define the Todo schema:

    ```js
    const mongoose = require("mongoose");

    const TodoSchema = new mongoose.Schema({
      text: { type: String, required: true },
      completed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    });

    module.exports = mongoose.model("Todo", TodoSchema);
    ```

- **Implement CRUD Routes**

  - In `/routes/todos.js`, implement endpoints for:
    - **GET `/todos`** – Retrieve all todos.
    - **POST `/todos`** – Create a new todo.
    - **PUT `/todos/:id`** – Update a todo.
    - **DELETE `/todos/:id`** – Delete a todo.
  - Ensure error handling is robust (return appropriate HTTP statuses and messages).

- **Testing**
  - Use Postman or curl to test each CRUD endpoint.
  - Verify that data is correctly stored, updated, and removed in MongoDB.

---

## **Day 4 – Observability Simulation Endpoints (Part 1)**

- **Create Routes for Observability**
  - Create a new file `/routes/fakeEvents.js` for all simulation endpoints.
- **Implement Fake Load Generator**

  - Create an endpoint **GET `/fake-load`** that simulates a CPU-intensive task (e.g., a loop with mathematical operations).
  - Record a custom event with New Relic using `newrelic.recordCustomEvent()`.

- **Implement Application Performance Monitoring Simulation**

  - Create **GET `/simulate-apm`** that introduces an artificial delay (using `setTimeout`).
  - Record the delay as a custom event.

- **Implement Infrastructure Monitoring Simulation**

  - Create **GET `/simulate-infra`** to simulate CPU, memory, and disk I/O metrics.
  - Record these metrics as a custom event.

- **Testing**
  - Test each endpoint individually.
  - Check both the response payloads and New Relic custom events (if you have access to the New Relic dashboard).

---

## **Day 5 – Observability Simulation Endpoints (Part 2)**

- **Implement Browser Monitoring Simulation**

  - Create **GET `/browser-monitoring`** which simulates a browser event by logging a custom event with a timestamp.

- **Implement Synthetic Monitoring**

  - Create **GET `/simulate-synthetic`**.
  - Use Axios to call internal endpoints (for example, `/simulate-apm` and `/simulate-network`).
  - Propagate headers for distributed tracing.
  - Record a synthetic monitoring custom event.

- **Implement Fake Log Generation**

  - Create **GET `/fake-log`** that logs informational and error messages.
  - Use both `console.log` and `newrelic.noticeError()` to simulate log generation.

- **Testing**
  - Use Postman or similar tools to verify that these endpoints are triggering the correct simulated events and behaviors.

---

## **Day 6 – Observability Simulation Endpoints (Part 3) & API Tracking**

- **Implement Distributed Tracing Endpoint**

  - Create **GET `/simulate-tracing`**.
  - Use Axios to chain calls to endpoints like `/simulate-apm` and `/simulate-infra`.
  - Propagate incoming headers to maintain distributed tracing across the calls.
  - Record a custom event with combined data from the calls.

- **Implement Network Performance Monitoring**

  - Create **GET `/simulate-network`**.
  - Simulate network latency using `setTimeout`.
  - Randomly simulate failures (e.g., a 30% chance) and record errors with New Relic.

- **Implement API Tracking Endpoint**

  - Create **GET `/simulate-api`**.
  - Allow query parameters to simulate delays (`?delay=500`) or force errors (`?error=true`).
  - Use `setTimeout` to simulate the delay, and conditionally log errors or success events.

- **Testing**
  - Test each endpoint thoroughly.
  - Validate that distributed tracing and API simulation behave as expected.
  - Verify that custom events are recorded correctly in New Relic.

---

## **Day 7 – Quality Assurance, Logging Enhancements & Documentation**

- **Enhance Logging**

  - (Optional) Create a logging utility in `/utils/logger.js` (e.g., using Winston) for consistent logging across modules.
  - Replace any raw `console.log`/`console.error` calls with your logger (if implemented).

- **Code Refactoring**

  - Review all routes and models for consistency, error handling, and code clarity.
  - Add comments and documentation within the code to explain key sections and New Relic integrations.

- **Documentation Updates**
  - Update the `README.md` with:
    - Project overview.
    - Setup instructions (including environment variables and dependency installation).
    - Detailed API endpoint descriptions (including sample requests and responses).
    - Instructions on how to run and test the application.
- **Local Testing & Debugging**
  - Re-test all endpoints.
  - Ensure that errors are logged appropriately and that New Relic custom events appear as expected (if you have access to the dashboard).

---

## **Day 8 – Final Integration Testing & Deployment Preparation**

- **End-to-End Testing**

  - Perform integration tests to simulate user flows across multiple endpoints.
  - Verify that distributed tracing spans across internal calls correctly.

- **Security & Performance Checks**

  - Run a security audit (e.g., using `npm audit`) and address any critical vulnerabilities.
  - Ensure that production-level settings are applied (e.g., environment-specific logging levels, database connection options).

- **Deployment Preparations**

  - (Optional) Create a `Dockerfile` for containerization:
    - Define base image, copy source code, install dependencies, and set the start command.
  - Prepare any necessary deployment scripts or documentation (e.g., instructions for deploying on a cloud provider or a PaaS).

- **Final Code Review & Commit**
  - Conduct a final code review.
  - Commit and push the final code to your repository.
  - Update the deployment documentation with the latest changes.

---

Following this day-by-day plan will help ensure that the project is built step-by-step, with clear milestones and testing at each stage. Adjust timelines as needed based on team size and complexity, and consider adding buffer time for unexpected challenges or deeper testing phases.
