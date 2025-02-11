Below is a detailed “specification & instruction” document you can share with your frontend and backend developers. This document outlines the goals, architecture, endpoints, UI requirements, and New Relic instrumentation points needed to build a demo 3‑tier MERN “Todo” application that—in addition to normal todo operations—generates fake data for various observability aspects. You can adjust and expand these instructions as needed for your company’s standards.

---

# Observability Demo Application Specification

**Project Name:** MERN Observability Demo  
**Overview:**  
Build a MERN (MongoDB, Express/Node.js, React) application with two main parts:

1. A typical Todo application that lets users create, read, update, and delete (CRUD) todo items.
2. A left-side control panel (or sidebar) with buttons that, when clicked, trigger endpoints to generate “fake” data/events simulating different monitoring signals. These events include simulated load, APM events, infrastructure metrics, browser data, synthetic transactions, logs, distributed tracing, network performance, and API tracking.  
   The primary goal is to generate data that can be captured and visualized in your New Relic account (https://newrelic.com).

---

## 1. Architecture & Project Structure

### a. Overall Architecture

- **Frontend:**
  - A React application that displays the Todo list in the main area.
  - A left sidebar containing buttons for each fake data generator.
  - Integrate the New Relic Browser agent (via snippet in HTML or via a React plugin) to capture frontend performance events.
- **Backend:**

  - A Node.js/Express server that exposes RESTful endpoints for the Todo CRUD operations.
  - Additional endpoints to simulate the fake events (see section 3 below).
  - Integrate the New Relic Node agent for APM, custom event recording, logging, and distributed tracing.

- **Database:**
  - MongoDB (using Mongoose) for storing todo items.

### b. Suggested File Structure (Example)

```
/observability-demo
├── /backend
│   ├── index.js          // Main entry point – must require newrelic first!
│   ├── newrelic.js       // New Relic configuration file
│   ├── /routes
│   │     ├── todos.js    // CRUD endpoints for todos
│   │     └── fakeEvents.js // Endpoints for fake data generation
│   ├── /models
│   │     └── Todo.js     // Mongoose Todo schema
│   └── package.json
└── /frontend
    ├── public
    │    └── index.html   // Add New Relic Browser snippet here
    ├── src
    │    ├── App.js       // Main component: layout with left sidebar & todo UI
    │    ├── components
    │    │    ├── TodoList.js   // Todo list UI and CRUD operations
    │    │    └── ControlPanel.js // Left sidebar with fake event buttons
    │    └── index.js
    └── package.json
```

---

## 2. New Relic Integration

### a. Backend (Node.js/Express)

- **Installation & Setup:**
  - Add the New Relic Node agent to your project (`npm install newrelic`).
  - Create a `newrelic.js` configuration file at the root of your backend. Make sure to set up the following (or load via environment variables):
    - `app_name`: A name for your application.
    - `license_key`: Your New Relic license key.
    - `logging` options (if needed).
  - **Important:** In your main entry file (`index.js`), **require New Relic before any other module**:
    ```js
    // index.js
    require("newrelic");
    const express = require("express");
    // ...rest of your code
    ```
- **Custom Instrumentation:**  
  Use New Relic’s APIs (e.g., `newrelic.recordCustomEvent`, `newrelic.noticeError`) inside your fake endpoints to record custom events and errors.

### b. Frontend (React)

- **Browser Agent:**
  - Add the New Relic Browser agent snippet to your `public/index.html` (preferably right after the `<head>` tag) so that page load and SPA performance are captured.
  - Optionally, if you need custom browser events, you can use New Relic’s Browser API to add custom attributes.

---

## 3. Backend Endpoints for Fake Data Generation

For each “fake event” below, create an endpoint (or a set of endpoints) that simulates the corresponding behavior. These endpoints will be triggered via button clicks from the frontend.

> **General Guidelines:**
>
> - Each endpoint should record custom events (via `newrelic.recordCustomEvent`) and log messages so that you can see the data appear in New Relic.
> - Simulate variability (e.g., random delays, errors, and load) where applicable.
> - Where possible, simulate realistic HTTP headers and distributed tracing headers so that distributed tracing can be visualized in New Relic.

### a. Fake Load Generator

- **Endpoint:** `GET /fake-load`
- **Behavior:**
  - Simulate CPU-intensive tasks (e.g., perform heavy mathematical calculations or run a large loop for a configurable duration).
  - Optionally use asynchronous tasks (or even spawn a child process) to simulate heavy load without blocking all requests.
- **New Relic Integration:**
  - Record a custom event such as `FakeLoadEvent` with details (duration, simulated load level).

### b. Application Performance Monitoring (APM)

- **Endpoint:** `GET /simulate-apm`
- **Behavior:**
  - Simulate a slow endpoint by adding an artificial delay (using `setTimeout`).
  - Optionally simulate variable response times (e.g., delay between 500ms to 3000ms).
- **New Relic Integration:**
  - Ensure that the transaction shows up in New Relic APM with the simulated delay.
  - Record a custom event with the delay duration.

### c. Infrastructure Monitoring

- **Endpoint:** `GET /simulate-infra`
- **Behavior:**
  - Simulate a change in infrastructure metrics. For example, generate fake metrics such as CPU spike, memory usage increase, or disk I/O changes.
  - You could simulate this by simply recording a custom event with random metric values.
- **New Relic Integration:**
  - Use `newrelic.recordCustomEvent('FakeInfraEvent', { cpuUsage, memoryUsage, diskIO })`.

### d. Browser Monitoring

- **Endpoint:** (Triggered on the frontend)
- **Behavior:**
  - When the user clicks the “Browser Monitoring” button, the React app should simulate a new “page load” or route change event.
  - You might add custom timing data or performance marks in the browser and send them via New Relic Browser’s API.
- **New Relic Integration:**
  - Leverage the Browser agent’s automatic page load metrics.
  - Optionally record a custom browser event using New Relic’s JavaScript API.

### e. Synthetic Monitoring

- **Endpoint:** `GET /simulate-synthetic`
- **Behavior:**
  - Simulate a synthetic transaction that calls multiple internal endpoints. For example, the endpoint can internally call `/simulate-apm` and `/simulate-network` sequentially or in parallel.
- **New Relic Integration:**
  - Propagate distributed tracing headers between the internal calls so that the entire synthetic journey appears as one trace.
  - Record a custom event summarizing the synthetic run.

### f. Fake Log Generation

- **Endpoint:** `GET /fake-log`
- **Behavior:**
  - Generate several log messages, both informational and error logs.
  - You might simulate random errors using `newrelic.noticeError(new Error('Simulated error'))`.
- **New Relic Integration:**
  - Ensure that logs appear in New Relic Logs (if log forwarding is set up) and record a custom event `FakeLogEvent`.

### g. Distributed Tracing

- **Endpoint:** `GET /simulate-tracing`
- **Behavior:**
  - Create a chain of calls that simulate a distributed transaction. For example:
    1. Endpoint A (`/simulate-tracing`) calls internal endpoint B.
    2. Endpoint B calls endpoint C.
    3. Each endpoint passes the required tracing headers.
  - Use asynchronous calls or even separate modules/microservices if desired.
- **New Relic Integration:**
  - Validate that distributed tracing spans appear in New Relic APM.
  - Record custom events at each step if needed.

### h. Network Performance Monitoring

- **Endpoint:** `GET /simulate-network`
- **Behavior:**
  - Simulate network issues such as variable latency or random connection failures.
  - For example, add random delays and occasionally return HTTP error codes (e.g., 500 or 503).
- **New Relic Integration:**
  - Record a custom event `FakeNetworkEvent` with fields for simulated latency, error codes, and failure rates.

### i. API Tracking

- **Endpoint:** `GET /simulate-api`
- **Behavior:**
  - Simulate different API responses (e.g., successful, slow, error).
  - Allow the simulation to accept parameters (via query params) to control the behavior (e.g., `?delay=2000&error=true`).
- **New Relic Integration:**
  - Log details of each API call (response time, status code) as custom events.
  - Ensure that New Relic APM shows these API endpoints with proper metrics.

---

## 4. Frontend UI Specifications

### a. Layout

- **Split View:**
  - **Left Sidebar:**
    - Contains buttons for each fake event:
      1. Fake Load Generator
      2. Application Performance Monitoring (APM)
      3. Infrastructure Monitoring
      4. Browser Monitoring
      5. Synthetic Monitoring
      6. Fake Log Generation
      7. Distributed Tracing
      8. Network Performance Monitoring
      9. API Tracking
  - **Main Area:**
    - Displays the Todo application.
    - Standard features: list todos, add new todos, mark complete/incomplete, edit, and delete.

### b. Behavior

- **Button Actions:**
  - Each button sends an HTTP request (using `fetch` or Axios) to the corresponding backend endpoint.
  - Show visual feedback (e.g., a spinner, success/error message) when the backend returns a response.
  - Optionally, display a log panel or notifications area on the frontend that shows responses from these endpoints.
- **Routing & Navigation:**
  - Use React Router (if needed) to simulate page transitions. This helps with browser monitoring if you want to simulate SPA route changes.
- **New Relic Browser Agent:**
  - Confirm that page loads and button click events are being captured by the New Relic Browser agent.

---

## 5. Testing & Verification

- **Local Testing:**
  - Run the backend and frontend locally.
  - Click each button in the control panel and verify that:
    - The endpoint responds correctly.
    - The simulated behavior (delays, logs, errors) occurs as expected.
    - Custom events appear in your New Relic dashboard (APM, Logs, Browser, etc.).
- **Observability Verification:**
  - **APM:** Check that slow endpoints and custom transactions appear.
  - **Distributed Tracing:** Validate that the synthetic transactions and tracing chains appear as a single distributed trace.
  - **Logs:** Verify that fake logs are captured in New Relic Logs (if your log forwarding is configured).
  - **Infrastructure & Network:** Look for the custom metrics/events in New Relic Insights or via custom dashboards.
  - **Browser:** Confirm that page load and SPA navigation metrics appear.

---

## 6. Deployment & Environment Configuration

- **Environment Variables:**
  - New Relic license key, app name, MongoDB URI, and any other sensitive data should be configured via environment variables or a secrets manager.
- **Dockerization (Optional):**
  - Containerize both the backend and frontend using Docker for easier deployment/testing.
- **Documentation:**
  - Update a README with instructions on how to run both the frontend and backend, and how to configure New Relic integration.
  - Document each endpoint and its parameters for future reference.

---

## 7. Code Quality & Comments

- **Comment Instrumentation:**
  - Clearly comment where New Relic methods are used (e.g., `newrelic.recordCustomEvent`) so that future developers understand the observability hooks.
- **Error Handling:**

  - Ensure that simulated errors (for fake log generation, network issues, etc.) are handled gracefully and logged using `newrelic.noticeError`.

- **Unit & Integration Testing:**
  - Write tests for critical endpoints, especially to verify that the simulated delays, errors, and custom events work as intended.

---

## 8. Summary of Developer Tasks

### **Backend Developer:**

1. **Project Setup:**
   - Set up the Node.js project with Express and Mongoose.
   - Configure and integrate the New Relic Node agent (ensure `newrelic.js` is loaded first).
2. **CRUD Endpoints:**
   - Implement RESTful endpoints for Todo items.
3. **Fake Data Endpoints:**
   - Create endpoints for `/fake-load`, `/simulate-apm`, `/simulate-infra`, `/simulate-synthetic`, `/fake-log`, `/simulate-tracing`, `/simulate-network`, and `/simulate-api`.
   - Instrument each endpoint with custom New Relic events and (where applicable) simulate delays, load, or errors.
4. **Distributed Tracing:**
   - For `/simulate-tracing`, implement internal calls ensuring proper propagation of distributed tracing headers.
5. **Logging & Error Reporting:**
   - Use New Relic’s logging/error methods to record simulated error conditions.

### **Frontend Developer:**

1. **Project Setup:**
   - Initialize a React project (e.g., using Create React App).
   - Add the New Relic Browser agent snippet to `public/index.html`.
2. **UI Development:**
   - Build the Todo application UI in the main area (list, add, edit, delete).
   - Build a left sidebar (or control panel) with buttons for each fake event.
3. **Event Handling:**
   - On button click, make the corresponding API call to the backend.
   - Provide user feedback (loading states, response messages) for each button press.
4. **Optional Enhancements:**
   - Create a logging or notification area to display results from the fake data generation endpoints.
   - Use React Router to simulate SPA navigation events if desired.

---

## Final Notes

- **Iteration & Experimentation:**
  - The goal is to have a “living” demo that you can use to experiment with and learn New Relic’s various monitoring features. Feel free to iterate on the simulation behaviors.
- **Make It Interesting:**
  - Consider adding configuration options (e.g., input fields to set delay durations or error probabilities) so you can tweak the behavior in real-time.
  - You might also add visual graphs or status indicators in the UI to represent simulated metrics (even if just for demo purposes).

Share these detailed instructions with your developers. They should have enough information to start building a robust demo application that not only functions as a Todo app but also serves as a playground for observability practices with New Relic.

Happy coding and observability learning!
