import React, { useState } from "react";
import ButtonControls from "./ButtonControls";
import LoadGenerator from "./LoadGenerator";
import { apiCall } from "../services/apiService";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);

  const handleApiCall = async (endpoint) => {
    const result = await apiCall(endpoint);
    setLogs((prevLogs) => [...prevLogs, { endpoint, ...result }]);
  };

  return (
    <div>
      <h1>Observability Dashboard</h1>
      <ButtonControls onCall={handleApiCall} />
      <LoadGenerator onResults={(results) => setLogs([...logs, ...results])} />
      
      <h2>Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {log.endpoint}: {log.time.toFixed(2)}ms {log.error ? `❌ ${log.error}` : "✅"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
