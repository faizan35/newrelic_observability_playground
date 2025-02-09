import React from "react";

const ButtonControls = ({ onCall }) => {
  return (
    <div>
      <button onClick={() => onCall("normal")}>Normal Call</button>
      <button onClick={() => onCall("slow")}>Slow Call</button>
      <button onClick={() => onCall("error")}>Error Call</button>
      <button onClick={() => onCall("synthetic")}>Synthetic Call</button>
    </div>
  );
};

export default ButtonControls;
