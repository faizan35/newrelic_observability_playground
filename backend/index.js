// index.js

// Require New Relic first!
require("newrelic");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors package

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Alternatively, if you want to restrict it to a specific origin (e.g., your frontend):
// app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyParser.json());

// Import your routes
const todosRoute = require("./routes/todos");
const fakeEventsRoute = require("./routes/fakeEvents");

// Connect to MongoDB (ensure you have updated your connection code as needed)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/todos", todosRoute);
app.use("/", fakeEventsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
