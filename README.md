# New Relic Observability Playground

An end-to-end observability demo application built with a three-tier MERN stack (MongoDB, Express/Node, React) that simulates various scenarios for modern monitoring, logging, and distributed tracing. This project is designed for learning and demonstrating Application Performance Monitoring (APM), OpenTelemetry instrumentation, Infrastructure Monitoring, Browser Monitoring, Synthetic Monitoring, Log Management, Distributed Tracing, and Network Performance Monitoring.

## Table of Contents

- [New Relic Observability Playground](#new-relic-observability-playground)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Technologies](#technologies)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
      - [For the Backend](#for-the-backend)
      - [For the Frontend](#for-the-frontend)
  - [Usage](#usage)
    - [Running Locally](#running-locally)
      - [Start the Backend Server](#start-the-backend-server)
      - [Start the Frontend Application](#start-the-frontend-application)
    - [Available API Endpoints](#available-api-endpoints)
    - [Frontend Dashboard](#frontend-dashboard)
  - [Configuration](#configuration)
  - [Docker \& Deployment](#docker--deployment)
    - [Dockerizing the Application](#dockerizing-the-application)
  - [Development Guidelines](#development-guidelines)
  - [Contributing](#contributing)

## Overview

The **Observability Demo App** is intended to provide a sandbox environment where you can simulate and study various observability scenarios:

- **Frontend (React):** A dashboard with buttons to trigger normal, slow, error, and synthetic API calls, plus a built-in load generator.
- **Backend (Express/Node):** Multiple endpoints that simulate different behaviors (immediate response, delayed response, errors, synthetic monitoring, and optional MongoDB interactions).
- **Database (MongoDB):** A sample collection to simulate database queries, optionally instrumented for performance monitoring.

Instrumentation is integrated using **OpenTelemetry** and optionally the **New Relic** agent for complete distributed tracing and performance insights.

## Features

- **Application Performance Monitoring (APM):** Simulated API endpoints with varying response times and error conditions.
- **Distributed Tracing:** End-to-end tracing across frontend, backend, and database.
- **OpenTelemetry Integration:** Instrumentation for capturing metrics and traces.
- **Browser Monitoring:** Integration of New Relic Browser Agent (or OpenTelemetry Browser SDK) for client-side performance tracking.
- **Synthetic Monitoring:** Dedicated endpoints to simulate synthetic transactions.
- **Log Management:** Structured JSON logging with trace context for correlating logs with trace data.
- **Network Performance Monitoring:** Simulated network delays and load generation.
- **Load Generator:** Trigger multiple parallel API requests to simulate high load.

## Architecture

The application is built as a three-tier system:

1. **Frontend:** A React application providing a user dashboard to interact with various observability scenarios.
2. **Backend:** An Express/Node.js server exposing multiple API endpoints to simulate different conditions.
3. **Database:** MongoDB is used as the data store to simulate database interactions.

Additional services and instrumentation are implemented to support:

- Distributed tracing (propagation of trace IDs across services)
- Synthetic monitoring and periodic load generation
- Container-based deployment (using Docker and Docker Compose)

## Technologies

- **Frontend:** React, JavaScript (or TypeScript)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Observability Tools:** OpenTelemetry, New Relic Agent / Browser Agent
- **Logging:** Winston/Bunyan (or your choice of JSON logger)
- **Containerization:** Docker, Docker Compose
- **Additional Tools:** Prometheus (for metrics, via `prom-client`), optional external load generators

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local installation or via Docker)
- [Docker & Docker Compose](https://www.docker.com/get-started) (if containerizing)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/yourusername/observability-demo-app.git
cd observability-demo-app
```

### Install Dependencies

#### For the Backend

```bash
cd backend
npm install
```

#### For the Frontend

```bash
cd ../frontend
npm install
```

## Usage

### Running Locally

#### Start the Backend Server

```bash
cd backend
npm start
```

#### Start the Frontend Application

```bash
cd frontend
npm start
```

The React app will open in your default browser (typically on `http://localhost:3000`), and the backend API will run on a specified port (e.g., `http://localhost:5000`).

### Available API Endpoints

- **`GET /api/normal`**  
  Returns a quick JSON response to simulate normal behavior.

- **`GET /api/slow`**  
  Introduces an artificial delay (e.g., 3–5 seconds) to simulate slow response times.

- **`GET /api/error`**  
  Returns an HTTP 500 error to simulate failures.

- **`GET /api/synthetic`**  
  Provides a fixed JSON payload for synthetic monitoring.

- **`GET /api/dbQuery`** (Optional)  
  Connects to MongoDB and fetches documents from a sample collection.

### Frontend Dashboard

The React dashboard provides buttons for triggering:

- Normal API call
- Slow API call
- Error simulation call
- Synthetic monitoring call
- A load generator to fire multiple requests concurrently

## Configuration

Create a `.env` file in the backend directory with the following sample variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/observability_demo

# New Relic Configuration (if used)
NEW_RELIC_LICENSE_KEY=your_new_relic_license_key
NEW_RELIC_APP_NAME=ObservabilityDemoApp

# OpenTelemetry or other exporter endpoints can also be configured here
```

Ensure you configure environment variables for both the backend and frontend as needed.

## Docker & Deployment

### Dockerizing the Application

A sample `Dockerfile` is provided for both the backend and frontend. Additionally, a `docker-compose.yml` file is available to run the entire stack (backend, frontend, and MongoDB) with a single command:

```bash
docker-compose up --build
```

This will spin up:

- The Express/Node backend
- The React frontend (optionally served via a Node or Nginx container)
- A MongoDB container

## Development Guidelines

- **Modular Code:** Keep components and routes modular for easy maintenance.
- **Instrumentation:** Ensure that distributed tracing headers and log trace IDs are consistently propagated.
- **Error Handling:** Implement robust error handling to simulate failure scenarios gracefully.
- **Comments & Documentation:** Comment the instrumentation points and configuration settings thoroughly.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or additional features.

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

Happy Observing!
