let express = require('express');
var app = require('express')();
var http = require('http').Server(app);
let io = require('socket.io')(http);

//a user list
let users = [];
let names = [];

app.get('/', function(req, res){
  //https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http/29046869#29046869
  //res.sendFile(__dirname + '/script.js');
  //res.sendFile(__dirname + '/style.css');
  res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  console.log('A user connected.');
  console.log('rooms available:'+ socket.rooms);
  users.push(socket);
  names.push(null);
  socket.emit('id', users.length);  
  // Receive messages.
  socket.on('chat message', function(msg){
    
    // Send message to all users.
    io.emit('chat message', msg);
  });

  // Receive messages.
  socket.on('set name', function(name){
    console.log('looking for a name;')
    let i = users.indexOf(socket);
    names[i] = name;
    // Send message to all users.
    io.emit('chat message', "ROBO: Welcome "+name+"!");
    console.log('got name for user'+i+' :'+name);
  });

  socket.on('disconnect', function(){
    let i = users.indexOf(socket);
    console.log(names[i]+' disconnected');
    //remove their id from the users
    
    users.splice(i,1);
    names.splice(i,1);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});