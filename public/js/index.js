var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('youConnected', function (message) {
    console.log(message);
});

socket.on('newClientConnected', function (message) {
    console.log(message);
});

socket.on('newServerMessage', function (message) {
    console.log('Received new message from server', message);
});