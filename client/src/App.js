import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([
    { id: 1, name: 'walk a dog' },
    { id: 2, name: 'do shopping' },
    { id: 3, name: 'read a book' },
    { id: 4, name: 'watch a movie' }]
  );
  const [taskName, setTaskName] = useState();

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    // socket.on('updateData', (tasks) => updateTasks(tasks));
    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id));

    return () => {
      socket.disconnect();
    };
  }, []);

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
    socket.emit(tasks);
  };

  const removeTask = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    socket.emit('tasks', setTasks);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ id: uuidv4(), name: taskName });
    socket.emit({ id: uuidv4(), name: taskName })
    // how to clear input field after adding a task??
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
            <li key={task.id} className='task'>{task.name}<button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={e => setTaskName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
