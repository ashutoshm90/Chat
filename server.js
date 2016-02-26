/**
 * Created by ASHUTOSH on 2/25/2016.
 */
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));


http.listen(PORT, function(){
    console.log("Server Started");
});

io.on('connection', function(socket){
    console.log("user connected");
    socket.on('message', function(message){
       console.log('Message Recieved: ' + message.text);

        socket.broadcast.emit('message', message);
    });


    socket.emit('message', {
        text: "Welcome to chat room"
    });
});