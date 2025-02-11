// File: src/components/ControlPanel.jsx
import React, { useState } from "react";
import api from "../api/api"; // Updated import to use our centralized API instance

const buttons = [
  { endpoint: "/fake-load", label: "Fake Load Generator" },
  { endpoint: "/simulate-apm", label: "APM Simulation" },
  { endpoint: "/simulate-infra", label: "Infrastructure Monitoring" },
  { endpoint: "/browser-monitoring", label: "Browser Monitoring" },
  { endpoint: "/simulate-synthetic", label: "Synthetic Monitoring" },
  { endpoint: "/fake-log", label: "Fake Log Generation" },
  { endpoint: "/simulate-tracing", label: "Distributed Tracing" },
  { endpoint: "/simulate-network", label: "Network Performance Monitoring" },
  { endpoint: "/simulate-api", label: "API Tracking" },
];

const ControlPanel = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState({});

  const handleButtonClick = async (endpoint, label) => {
    console.log("Button pressed:", label);
    setLoading((prev) => ({ ...prev, [label]: true }));
    setStatus(`${label}: Processing...`);
    try {
      const response = await api.get(endpoint);
      setStatus(`${label}: Success!`);
      console.log(`${label} response:`, response.data);
    } catch (error) {
      setStatus(`${label}: Error occurred.`);
      console.error(`${label} error:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [label]: false }));
    }
  };

  return (
    <div className="control-panel">
      {buttons.map(({ endpoint, label }) => (
        <button
          key={label}
          onClick={() => handleButtonClick(endpoint, label)}
          disabled={loading[label]}
        >
          {loading[label] ? "Processing..." : label}
        </button>
      ))}
      {status && <div className="status-message">{status}</div>}
    </div>
  );
};

export default ControlPanel;
