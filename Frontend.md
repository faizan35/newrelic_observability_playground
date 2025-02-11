# Frontend Developer Instructions for the MERN Observability Demo

**Project Overview:**  
Build a React-based frontend that serves two primary functions:

1. **Todo Application:** A standard CRUD interface (create, read, update, delete) for managing todo items.
2. **Observability Control Panel:** A left sidebar containing buttons for generating simulated events (e.g., fake load, APM, infrastructure, etc.). Each button will trigger a request to the corresponding backend endpoint (which your backend colleague will implement).

Your work will also include integrating New Relic’s Browser agent to capture page load and Single Page Application (SPA) navigation performance data.

---

## 1. Project Structure & Setup

### a. Recommended File/Folder Structure

Set up your React project (e.g., using Create React App). A suggested folder layout is:

```
/frontend
├── public
│    └── index.html        // Add New Relic Browser snippet here
├── src
│    ├── App.js            // Main layout: includes sidebar and main content area
│    ├── index.js          // React app entry point
│    ├── components
│    │    ├── ControlPanel.js  // Left sidebar with observability buttons
│    │    └── TodoList.js      // Todo application UI and CRUD interface
│    └── styles
│         └── styles.css   // Optional: CSS file for styling your app
└── package.json
```

### b. Project Initialization

- Use Create React App or your preferred React boilerplate.
- Install any necessary dependencies (e.g., Axios or Fetch API for HTTP calls, React Router if needed).
- Set up an environment variable (e.g., `REACT_APP_API_BASE_URL`) that holds the base URL for the backend endpoints (so the API endpoints can be easily configured).

---

## 2. New Relic Browser Agent Integration

### a. Adding the New Relic Snippet

- In the `/public/index.html` file, immediately after the opening `<head>` tag, add the New Relic Browser agent snippet. (Your company should provide the specific snippet; if not, see [New Relic’s documentation](https://docs.newrelic.com/docs/browser/browser-agent/installation/install-browser-monitoring-agent) for details.)

  **Example (pseudo-snippet):**

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- New Relic Browser Agent -->
      <script type="text/javascript">
        (function (n, e, w, r, i, c) {
          /* New Relic snippet code */
        })(window, document, "script", "https://example.com/newrelic.js");
      </script>
      <!-- End New Relic snippet -->
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MERN Observability Demo</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
  ```

- Verify that when you load the app in a browser, the New Relic Browser agent is activated (you can check your New Relic dashboard later).

---

## 3. UI Requirements

### a. Main Layout (App.js)

- **Two Main Sections:**

  1. **Left Sidebar (Control Panel):**
     - Contains buttons for triggering simulated observability events.
     - The buttons should include:
       - Fake Load Generator
       - Application Performance Monitoring (APM)
       - Infrastructure Monitoring
       - Browser Monitoring
       - Synthetic Monitoring
       - Fake Log Generation
       - Distributed Tracing
       - Network Performance Monitoring
       - API Tracking
  2. **Main Content Area:**
     - Displays the Todo application.
     - Should include a header, a list of todos, and a form/input for adding new todos.

- **Layout Suggestions:**
  - Use a flex layout (or a CSS grid) to place the sidebar on the left and the todo app on the right.
  - Ensure the design is responsive and clean.

### b. Control Panel Component (ControlPanel.js)

- **Responsibilities:**

  - Render all the observability buttons.
  - Each button should have an onClick event that calls the corresponding backend endpoint.
  - Use an HTTP client (like Axios or fetch) to send GET requests (or POST, as specified by your backend team) to these endpoints.
  - Provide visual feedback:
    - **Loading Indicator:** When a request is in progress.
    - **Success/Error Notification:** Display the backend response or error messages.

- **Example Button Component Pseudocode:**

  ```jsx
  import React, { useState } from "react";
  import axios from "axios";

  const ControlPanel = () => {
    const [status, setStatus] = useState("");

    const handleButtonClick = async (endpoint, label) => {
      setStatus(`${label}: Processing...`);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}${endpoint}`
        );
        setStatus(`${label}: Success!`);
        // Optionally, update a log or notification panel with response.data.
      } catch (error) {
        setStatus(`${label}: Error occurred.`);
        console.error(label, error);
      }
    };

    return (
      <div className="control-panel">
        <button
          onClick={() => handleButtonClick("/fake-load", "Fake Load Generator")}
        >
          Fake Load Generator
        </button>
        <button
          onClick={() => handleButtonClick("/simulate-apm", "APM Simulation")}
        >
          APM Simulation
        </button>
        <button
          onClick={() =>
            handleButtonClick("/simulate-infra", "Infrastructure Monitoring")
          }
        >
          Infrastructure Monitoring
        </button>
        <button
          onClick={() =>
            handleButtonClick("/browser-monitoring", "Browser Monitoring")
          }
        >
          Browser Monitoring
        </button>
        <button
          onClick={() =>
            handleButtonClick("/simulate-synthetic", "Synthetic Monitoring")
          }
        >
          Synthetic Monitoring
        </button>
        <button
          onClick={() => handleButtonClick("/fake-log", "Fake Log Generation")}
        >
          Fake Log Generation
        </button>
        <button
          onClick={() =>
            handleButtonClick("/simulate-tracing", "Distributed Tracing")
          }
        >
          Distributed Tracing
        </button>
        <button
          onClick={() =>
            handleButtonClick("/simulate-network", "Network Monitoring")
          }
        >
          Network Performance Monitoring
        </button>
        <button
          onClick={() => handleButtonClick("/simulate-api", "API Tracking")}
        >
          API Tracking
        </button>
        {/* Optional: A div to display the status message */}
        <div className="status-message">{status}</div>
      </div>
    );
  };

  export default ControlPanel;
  ```

  _Note: Adjust the endpoint URLs and HTTP methods (GET/POST) as required by your backend developer’s implementation._

### c. Todo Application Component (TodoList.js)

- **Responsibilities:**
  - Display a list of todo items fetched from the backend.
  - Provide an input field and button to add a new todo.
  - Allow users to mark todos as complete, edit, and delete them.
- **UI/UX Suggestions:**

  - Use a clean list view.
  - Provide confirmation messages or inline editing.
  - Optionally include filtering (e.g., All, Active, Completed).

- **Basic Flow:**
  - On component mount, fetch the todo list from the backend API (e.g., via `axios.get('/todos')`).
  - Update the list in the component’s state.
  - On adding a todo, POST to the backend and refresh the list.
  - On deleting or updating, perform the corresponding API call and update the UI accordingly.

---

## 4. API Communication

- **Base URL Configuration:**  
  Use an environment variable (e.g., `REACT_APP_API_BASE_URL`) so that the API endpoints can be easily reconfigured (for local development vs. production).  
  Example in `.env` file:

  ```env
  REACT_APP_API_BASE_URL=http://localhost:5000
  ```

- **Handling Responses & Errors:**

  - For every request initiated by the control panel buttons or the todo CRUD operations, handle success and error states gracefully.
  - Update the UI to inform the user about the progress (e.g., “Processing…”, “Success!”, “Error occurred”).

- **Optional Enhancements:**
  - Create a common API utility file to manage all API calls.
  - Implement retry logic or error boundary components for robustness.

---

Below is a detailed, day‐by‐day breakdown to help you build the MERN Observability Demo frontend. This plan assumes a one‐week timeline, but feel free to adjust the days according to your team’s pace. Each day includes specific tasks and checkpoints to ensure you build a production-ready application step by step.

---

## **Day 1: Project Initialization & Environment Setup**

### **Objectives:**

- Set up the project structure.
- Initialize version control.
- Install required dependencies.
- Configure environment variables.

### **Tasks:**

1. **Initialize the Project:**

   - Use Create React App (or your preferred React boilerplate) to set up the project.
   - Create a new repository (or branch) in your version control system (e.g., Git).

   ```bash
   npx create-react-app mern-observability-demo
   cd mern-observability-demo
   ```

2. **Setup File Structure:**

   - Organize your folders according to the recommended structure:
     ```
     /public
       └── index.html
     /src
       ├── api
       │    └── api.js         // (Optional) for centralizing API configuration
       ├── components
       │    ├── ControlPanel.js
       │    └── TodoList.js
       ├── styles
       │    └── styles.css
       ├── App.js
       └── index.js
     ```

3. **Install Dependencies:**

   - Install Axios (or your preferred HTTP client) and any other libraries you plan to use.

   ```bash
   npm install axios
   ```

4. **Configure Environment Variables:**

   - Create a `.env` file at the root of the project.
   - Add the base URL for the backend API:
     ```env
     REACT_APP_API_BASE_URL=http://localhost:5000
     ```

5. **Version Control & Documentation:**
   - Commit your initial project setup.
   - Update the README with basic project details and setup instructions.

---

## **Day 2: Basic Layout & New Relic Integration**

### **Objectives:**

- Integrate the New Relic Browser Agent.
- Build the main layout of the app with a sidebar and main content area.
- Create a basic CSS file for layout styling.

### **Tasks:**

1. **New Relic Integration:**

   - Open `public/index.html` and add the New Relic snippet immediately after the opening `<head>` tag.
   - Replace the placeholder snippet with your company’s snippet if available.

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <!-- New Relic Browser Agent -->
       <script type="text/javascript">
         (function (n, e, w, r, i, c) {
           /* Insert actual New Relic snippet code here */
         })(window, document, "script", "https://example.com/newrelic.js");
       </script>
       <!-- End New Relic Browser Agent -->
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>MERN Observability Demo</title>
     </head>
     <body>
       <div id="root"></div>
     </body>
   </html>
   ```

2. **Build the Main Layout (`src/App.js`):**

   - Create a simple layout using a flex (or grid) design to separate the sidebar from the main content area.
   - Import the two main components (Control Panel and Todo List).

   ```jsx
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
   ```

3. **Global Styling:**

   - Create `src/styles/styles.css` and add basic styles to ensure your layout displays correctly.

   ```css
   /* Example: */
   body,
   html,
   #root {
     height: 100%;
     margin: 0;
     padding: 0;
     font-family: Arial, sans-serif;
   }

   .app-container {
     display: flex;
     min-height: 100vh;
   }

   .sidebar {
     width: 250px;
     background-color: #f4f4f4;
     padding: 20px;
   }

   .main-content {
     flex: 1;
     padding: 20px;
   }
   ```

4. **Verification:**
   - Run the development server and verify that your layout displays properly.
   ```bash
   npm start
   ```

---

## **Day 3: Develop the Observability Control Panel**

### **Objectives:**

- Build the Control Panel component.
- Integrate buttons that will trigger simulated backend events.
- Add basic API call handling with Axios.

### **Tasks:**

1. **Create the ControlPanel Component (`src/components/ControlPanel.js`):**

   - Render the list of buttons with labels such as "Fake Load Generator", "APM Simulation", etc.
   - Set up onClick events for each button that trigger API calls.

   ```jsx
   import React, { useState } from "react";
   import axios from "axios";

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
       setLoading((prev) => ({ ...prev, [label]: true }));
       setStatus(`${label}: Processing...`);
       try {
         const response = await axios.get(
           `${process.env.REACT_APP_API_BASE_URL}${endpoint}`
         );
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
   ```

2. **Styling the Control Panel:**

   - Update `src/styles/styles.css` with styles for buttons and status messages.

   ```css
   .control-panel button {
     display: block;
     width: 100%;
     padding: 10px;
     margin-bottom: 10px;
     border: none;
     background-color: #007bff;
     color: #fff;
     font-size: 0.9rem;
     cursor: pointer;
     transition: background-color 0.3s ease;
   }

   .control-panel button:hover:not(:disabled) {
     background-color: #0056b3;
   }

   .control-panel button:disabled {
     background-color: #ccc;
     cursor: not-allowed;
   }

   .status-message {
     margin-top: 10px;
     font-weight: bold;
   }
   ```

3. **Testing:**
   - Verify each button triggers a simulated API call (you can use a mock API endpoint initially).
   - Check the console logs and status messages for feedback.

---

## **Day 4: Build the Todo Application Component**

### **Objectives:**

- Create the TodoList component.
- Implement CRUD operations (fetch, add, update, delete) for todos.
- Use Axios to integrate with the backend API endpoints.

### **Tasks:**

1. **Create the TodoList Component (`src/components/TodoList.js`):**

   - Manage local state for todos.
   - Fetch todos on component mount.
   - Add functionality for adding, deleting, and toggling the completion status of a todo.

   ```jsx
   import React, { useState, useEffect } from "react";
   import axios from "axios";

   const TodoList = () => {
     const [todos, setTodos] = useState([]);
     const [newTodo, setNewTodo] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");

     // Fetch todos from the backend
     const fetchTodos = async () => {
       setLoading(true);
       try {
         const response = await axios.get(
           `${process.env.REACT_APP_API_BASE_URL}/todos`
         );
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
         const response = await axios.post(
           `${process.env.REACT_APP_API_BASE_URL}/todos`,
           { text: newTodo }
         );
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
         await axios.delete(
           `${process.env.REACT_APP_API_BASE_URL}/todos/${id}`
         );
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
         await axios.put(
           `${process.env.REACT_APP_API_BASE_URL}/todos/${id}`,
           updatedTodo
         );
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
   ```

2. **Style the Todo Application:**

   - Update your `src/styles/styles.css` to include styles for the todo list.

   ```css
   /* Todo Application Styles */
   .todo-container {
     max-width: 600px;
     margin: 0 auto;
   }

   .todo-header {
     text-align: center;
   }

   .todo-form {
     display: flex;
     margin-bottom: 20px;
   }

   .todo-form input {
     flex: 1;
     padding: 10px;
     border: 1px solid #ccc;
     font-size: 1rem;
   }

   .todo-form button {
     padding: 10px 20px;
     border: none;
     background-color: #28a745;
     color: #fff;
     font-size: 1rem;
     cursor: pointer;
     transition: background-color 0.3s ease;
   }

   .todo-form button:hover {
     background-color: #218838;
   }

   .todo-list {
     list-style: none;
     padding: 0;
   }

   .todo-item {
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px solid #eee;
     padding: 10px 0;
   }

   .todo-item.completed .todo-text {
     text-decoration: line-through;
     color: #999;
   }

   .todo-actions button {
     margin-left: 5px;
     padding: 5px 10px;
     border: none;
     background-color: #dc3545;
     color: #fff;
     cursor: pointer;
     transition: background-color 0.3s ease;
   }

   .todo-actions button:hover {
     background-color: #c82333;
   }

   .error-message {
     color: red;
     margin-bottom: 10px;
   }
   ```

3. **Testing:**
   - Run your application and test all CRUD operations.
   - Use browser dev tools and console logs to verify API responses and state updates.

---

## **Day 5: API Integration & Utility Enhancements**

### **Objectives:**

- Refine API calls and centralize configuration.
- Enhance error handling and logging.
- Prepare for potential backend changes (e.g., switching endpoints or methods).

### **Tasks:**

1. **Create a Centralized API Utility (Optional):**

   - Create `src/api/api.js` to configure a reusable Axios instance.

   ```jsx
   import axios from "axios";

   const api = axios.create({
     baseURL: process.env.REACT_APP_API_BASE_URL,
     timeout: 10000, // 10 seconds timeout
   });

   // Optionally add interceptors for logging or error handling
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       console.error("API error:", error);
       return Promise.reject(error);
     }
   );

   export default api;
   ```

2. **Refactor API Calls:**

   - Update both the **ControlPanel** and **TodoList** components to use the centralized API instance instead of direct Axios calls.
   - This step makes it easier to manage changes to API configuration in one place.

3. **Improve Error Handling:**

   - Review and update the error messages shown to the user.
   - Consider adding retry logic or fallback notifications for a production-grade experience.

4. **Testing:**
   - Verify that all API calls work as expected.
   - Ensure that your logging (console logs or external logging tools) captures the necessary details.

---

## **Day 6: Styling, Responsiveness & UX Enhancements**

### **Objectives:**

- Polish the UI.
- Ensure responsiveness across devices.
- Refine user feedback (loading states, error messages, etc.).

### **Tasks:**

1. **Enhance the CSS:**

   - Review and update the CSS in `src/styles/styles.css` for a more polished look.
   - Ensure your layout (sidebar and main content) adapts well on mobile screens. You might add media queries:

   ```css
   @media (max-width: 768px) {
     .app-container {
       flex-direction: column;
     }
     .sidebar {
       width: 100%;
       padding: 10px;
     }
     .main-content {
       padding: 10px;
     }
   }
   ```

2. **Improve UX:**

   - Consider adding subtle animations (CSS transitions) for button states.
   - Improve form validation in the Todo application (e.g., disable the “Add Todo” button when the input is empty).

3. **Cross-browser Testing:**

   - Test your application in multiple browsers (Chrome, Firefox, Edge) to ensure consistent behavior.

4. **Accessibility:**
   - Verify that your buttons and inputs are accessible (using proper ARIA labels if needed).
   - Ensure that the contrast ratios and font sizes are adequate.

---

## **Day 7: Final Testing, Optimization & Documentation**

### **Objectives:**

- Conduct end-to-end testing.
- Optimize performance.
- Finalize documentation and prepare for production deployment.

### **Tasks:**

1. **Comprehensive Testing:**

   - Test all features (CRUD operations, observability endpoints) manually.
   - Check the integration of the New Relic Browser agent (by monitoring the New Relic dashboard).

2. **Performance Optimization:**

   - Use Chrome DevTools to review performance metrics.
   - Optimize images, code splitting, or other assets if needed.

3. **Code Review & Refactoring:**

   - Review your code for consistency, comments, and best practices.
   - Refactor any duplicate code or improve component reusability.

4. **Documentation:**

   - Update the README with setup instructions, API endpoints, and any other important notes.
   - Document how to run tests, build for production, and deploy the app.

5. **Final Commit & Deployment Preparation:**
   - Ensure that your environment variables are correctly set for production.
   - Create a production build using:
     ```bash
     npm run build
     ```
   - Prepare your deployment process (e.g., using services like Netlify, Vercel, or your company’s hosting solution).

---

## **Additional Tips:**

- **Daily Stand-ups:**  
  If working in a team, hold a brief meeting at the start of each day to confirm goals and address any blockers.

- **Version Control:**  
  Commit changes at the end of each day with clear messages (e.g., “Day 3: Implemented Control Panel with API integration”).

- **Testing & QA:**  
  Consider writing unit tests (with Jest/React Testing Library) for critical components once the basic functionality is in place.

This detailed day-wise plan should guide you through building the complete MERN Observability Demo frontend in a structured, step-by-step manner. Good luck, and happy coding!
