const express = require('express');
const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});
const socket = require('socket.io');
const io = socket(server);

let tasks = [];

io.on('connection', (socket) => {

    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (id) => {
        const tasksToDo = tasks.filter(task => task.id !== id);
        socket.broadcast.emit('removeTask', id);
    });

    socket.on('updateData', () => {
        socket.broadcast.emit('updateData', {
        });
    });
});