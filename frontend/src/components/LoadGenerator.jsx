import React, { useState } from "react";
import { apiCall } from "../services/apiService";

const LoadGenerator = ({ onResults }) => {
  const [iterations, setIterations] = useState(10);

  const startLoadTest = async () => {
    const promises = Array.from({ length: iterations }, () => apiCall("normal"));
    const results = await Promise.all(promises);
    onResults(results);
  };

  return (
    <div>
      <input
        type="number"
        value={iterations}
        onChange={(e) => setIterations(Number(e.target.value))}
      />
      <button onClick={startLoadTest}>Start Load Test</button>
    </div>
  );
};

export default LoadGenerator;
