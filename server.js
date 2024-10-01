const express = require('express');
const app = express();
const socket = require('socket.io');

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);
let tasks = [];

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  socket.emit('updateData', tasks);
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  
  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});