/**
 * Created by ASHUTOSH on 2/25/2016.
 */
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

http.listen(PORT, function(){
    console.log("Server Started");
});

function sendCurrentUsers(socket){
    var info = clientInfo[socket.id];
    var users = [];
    if(typeof info === 'undefined'){
        return;
    }

    Object.keys(clientInfo).forEach(function(socketId){
        var userinfo = clientInfo[socketId];
        if(info.room === userinfo.room){
            users.push(userinfo.name);
        }
    });

    socket.emit('message', {
        name: "System",
        text: "Current Users:" + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function(socket){
    console.log("user connected");
    socket.on('disconnect', function(){
       var userData = clientInfo[socket.id];
       if (typeof userData !== 'undefined'){
           socket.leave(userData.room);
           io.to(userData.room).emit('message', {
               name: "System",
               text: userData.name + ' has left',
               timestamp: moment().valueOf()
           });
           delete clientInfo[socket.id];
       }
    });

    socket.on('joinRoom', function(req){
        socket.join(req.room);
        clientInfo[socket.id] = req;
        socket.broadcast.to(req.room).emit('message', {
           name: "System",
           text: req.name + ' has joined',
           timestamp: moment().valueOf()
        });
    });
    socket.on('message', function(message){
       console.log('Message Recieved: ' + message.text);
       if(message.text === '@currentUsers'){
           sendCurrentUsers(socket);
       }else{
           message.timestamp = moment().valueOf();

           io.to(clientInfo[socket.id].room).emit('message', message);
       }


    });


    socket.emit('message', {
        name: "System",
        text: "Welcome to chat room",
        timestamp: moment().valueOf()
    });
});