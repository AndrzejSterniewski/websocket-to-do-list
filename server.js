const express = require('express');
const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});
const socket = require('socket.io');
const io = socket(server);

let tasks = [];

io.on('connection', (socket) => {

    // przekazywanie użytkownikowi listy tasków, całej tablicy z taskami
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (id) => {
        tasks = tasks.filter(task => task.id !== id);
        socket.broadcast.emit('removeTask', id);
    });
});