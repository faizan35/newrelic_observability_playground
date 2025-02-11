import React from "react";
import ControlPanel from "./components/ControlPanel";
import TodoList from "./components/TodoList";
import "./styles/styles.css";

const App = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <ControlPanel />
      </aside>
      <main className="main-content">
        <TodoList />
      </main>
    </div>
  );
};

export default App;
