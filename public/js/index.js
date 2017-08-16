var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newServerMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var li = jQuery('<li></li>');
    var a = jQuery(`<a target="_blank">My current location</a>`);

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);

    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var $message = jQuery('[name=message');

    socket.emit('createClientMessage', {
        from: 'User',
        text: $message.val()
    }, function () {
        $message.val('');
    });
});

var $locationButton = jQuery('#send-location');

$locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    $locationButton.attr("disabled", "disabled").text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        $locationButton.removeAttr("disabled").text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function (error) {
        $locationButton.removeAttr("disabled").text('Send location');
        alert('Unable to fetch location');
    })
});