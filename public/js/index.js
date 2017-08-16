var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createClientMessage', {
        to: 'Shafeeq',
        text: 'Sockets are Shafeeqing awesome!'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newServerMessage', function (message) {
    console.log('Received new message from server', message);
});