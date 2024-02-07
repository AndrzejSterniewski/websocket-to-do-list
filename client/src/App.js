import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState();

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id, false));
    socket.on('updateData', (tasks) => updateTasks(tasks));

    return () => {
      socket.disconnect();
    };
  }, []);

  // addTask włącza się gdy server doda coś nowego - da znać że jest nowy task, 
  // a ja lokalnie dodaję taki poprzez input submitForm i wtedy emituję do serwera ze jest coś nowego
  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  // czyli jeśli nie ma drugiego argumentu to przyjmuje on domyślnie wartośc true
  const removeTask = (id, local = true) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (local) socket.emit('removeTask', id);
  };

  const updateTasks = (tasks) => {
    setTasks(tasks);
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (!taskName) { alert('Field is empty') } else {
      // tworzymy jeden obiekt z unikalnym id który potem przekazujemy do servera a ten emituje innym socketom
      // dobrze go było przypisać do stałej
      const task = { id: uuidv4(), name: taskName }
      addTask(task);
      socket.emit('addTask', task);
      setTaskName('');
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
            <li key={task.id} className='task'>{task.name}<button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={e => setTaskName(e.target.value)} value={taskName} />
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
