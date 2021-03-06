const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        
        // io.emit -> io.to(room).emit
        // socket.broadcast.emit -> socket.broadcast.to(room).emit
        // socket.emit

        // socket.emit differs from io.emit in that it is scoped to an individual socket    
        socket.emit('newServerMessage',
            generateMessage('Admin', 'Welcome to the messaging app!'));

        // socket.broadcast emits to everyone but sender
        socket.broadcast.to(params.room).emit('newServerMessage',
            generateMessage('Admin', `${params.name} joined the room`));

        callback();
    });

    socket.on('createClientMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newServerMessage',
                generateMessage(user.name, message.text));
        }

        // io.emit differs from socket.emit in that it is scoped globally
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newServerMessage', generateMessage('Admin', `${user.name} left the room.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server up and listening on port ${port}.`);
});