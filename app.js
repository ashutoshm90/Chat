/**
 * Created by ASHUTOSH on 2/25/2016.
 */
var PORT = process.env.npm_package_config_port || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function(){
    console.log("Server Started");
});