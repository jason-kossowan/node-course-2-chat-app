var socket = io();

function scrollToBottom() {
    // selectors
    var $messages = $('#messages'),
        $newMessage = $messages.children('li:last-child');

    // heights
    var clientHeight = $messages.prop('clientHeight'),
        scrollTop = $messages.prop('scrollTop'),
        scrollHeight = $messages.prop('scrollHeight'),
        newMessageHeight = $newMessage.innerHeight(),
        lastmessageHeight = $newMessage.prev().innerHeight();
    
    if (clientHeight + scrollTop + newMessageHeight + lastmessageHeight >= scrollHeight) {
        $messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function (error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newServerMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a'),
        $template = jQuery('#message-template').html(),
        html = Mustache.render($template, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });
    
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a'),
        $template = jQuery('#location-message-template').html(),
        html = Mustache.render($template, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });

    jQuery('#messages').append(html);
    scrollToBottom();
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