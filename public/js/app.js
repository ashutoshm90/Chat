/**
 * Created by ASHUTOSH on 2/26/2016.
 */
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();


console.log(name + ' wants to join ' + room);
jQuery('.room-title').text(room);

socket.on('connect', function(){
    console.log('connected to socket server');
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function(message){
    var momentTimestamp = moment.utc(message.timeStamp);
    var $messages = jQuery('.messages');
    var $message = jQuery('<li class="list-group-item"></li>')
    console.log("New Message");
    console.log(message.text);
    $message.append('<p><strong>' + message.name + '  ' + momentTimestamp.local().format('h:mm a') + ' </strong></p>');
    $message.append('<p>' + message.text + '</p>')
    $messages.append($message);

})

var $form = jQuery('#message-form');

$form.on('submit', function(event){
    event.preventDefault();
    var $message = $form.find('input[name=message]');
    socket.emit('message', {
       name: name,
       text: $message.val()
    });

    $message.val('');
});