// File: src/components/TodoList.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api"; // Use the centralized API instance

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch todos from the backend
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Error fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo item
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await api.post("/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Error adding todo.");
    }
  };

  // Delete a todo item
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Error deleting todo.");
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await api.put(`/todos/${id}`, updatedTodo);
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Error updating todo.");
    }
  };

  return (
    <div className="todo-container">
      <h2 className="todo-header">Todo Application</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <span
                className="todo-text"
                onClick={() => toggleComplete(todo._id)}
              >
                {todo.text}
              </span>
              <div className="todo-actions">
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
