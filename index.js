var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on('subscribe', function(room) { 
		console.log('joining room', room);
		socket.join(room); 
	})

	socket.on('unsubscribe', function(room) {  
		console.log('leaving room', room);
		socket.leave(room); 
	})

	socket.on('send', function(data) {
		console.log('sending message');
		io.sockets.in(data.room).emit('message', data);
	});
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
