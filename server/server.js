const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newServerMessage', {
        from: 'Chris',
        text: 'New server message from chris',
        createdAt: 513135
    });

    socket.on('createClientMessage', (message) => {
        console.log('Recieved message from client', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server up and listening on port ${port}.`);
});