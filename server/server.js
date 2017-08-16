const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit differs from io.emit in that it is scoped to an individual socket    
    socket.emit('newServerMessage',
        generateMessage('Messaging app', 'Welcome to the messaging app!'));

    // socket.broadcast emits to everyone but sender
    socket.broadcast.emit('newServerMessage',
        generateMessage('Messaging app', 'New client connected to the messaging app'));

    socket.on('createClientMessage', (message, callback) => {
        console.log('Recieved message from client', message);
        // io.emit differs from socket.emit in that it is scoped globally
        io.emit('newServerMessage',
            generateMessage(message.from, message.text));
        
        callback('This is from the server.');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('ADMIN', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server up and listening on port ${port}.`);
});