var express = require('express');
var app = new express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(3000, function(){
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

var numUsers=0;

io.on('connection', function(socket){
  var addedUser = false;

  socket.on('new message', function(data){
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', function (username) {
    if (addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });



  
  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

