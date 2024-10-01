import io from "socket.io-client";
import { useEffect, useState } from "react";
import shortid from "shortid"; 

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState(""); 
  useEffect(() => {
    const socket = io("ws://localhost:8000", { transports: ["websocket"] });
    setSocket(socket);

    socket.on("addTask", (task) => addTask(task));
    socket.on("removeTask", (id) => removeTask(id));
    socket.on("updateData", (data) => updateTasks(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTasks = (data) => {
    setTasks(data);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id)); 
    socket.emit("removeTask", id); 
  };

  const addTask = (task) => {
    setTasks([...tasks, task]); 
  };

  const submitForm = (event) => {
    event.preventDefault(); 

    if (taskName.trim() !== "") {
      const newTask = { id: shortid.generate(), text: taskName }; 
      addTask(newTask); 
      socket.emit("addTask", newTask); 
      setTaskName(""); 
    }
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              {task.text}
              <button
                className="btn btn--red"
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
