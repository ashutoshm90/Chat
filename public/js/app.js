/**
 * Created by ASHUTOSH on 2/26/2016.
 */
var socket = io();

socket.on('connect', function(){
    console.log('connected to socket server');
});

socket.on('message', function(message){
   console.log("New Message");
   console.log(message.text);
});