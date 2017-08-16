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

    // socket.emit differs from io.emit in that it is scoped to an individual socket    
    socket.emit('youConnected', {
        from: 'Messaging app',
        text: 'Welcome to the messaging app!',
        createdAt: new Date() .getTime()
    });

    socket.broadcast.emit('newClientConnected', {
        from: 'Messaging app',
        text: 'New client connected to the messaging app',
        createdAt: new Date().getTime()
    });

    socket.on('createClientMessage', (message) => {
        console.log('Recieved message from client', message);
        io.emit('newServerMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newServerMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()                
        // });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server up and listening on port ${port}.`);
});