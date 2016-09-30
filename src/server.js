
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/static', express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

http.listen(3000, function () {
  console.log('Example app listening on port ' + 3000 + '!');
});

var allClients = [];
var privateRooms = [];
function getAllUsers(clients) {
	var names = [];
	clients.forEach(function(obj) {
		names.push(obj.user);
	});
	return names;
};

function roomAlreadyExists(privateRooms, users) {
	var roomExist = false;
	privateRooms.forEach(function(room) {
		console.log('room', room);
		console.log('users', users);
		if((room.users[0] === users[0] || room.users[0] === users[1]) &&
			(room.users[1] === users[0] || room.users[1] === users[1])) {
			roomExist = true;
		}
	});

	return roomExist;
}

io.on('connection', function(socket){
	allClients.push({socket: socket, user: socket.handshake.query.user});
	io.emit('users', getAllUsers(allClients));

	socket.on('disconnect', function() {
		console.log('Got disconnect!');
		console.log(socket.id);
    	allClients = allClients.filter((obj) => {
    		return obj.socket.id !== socket.id
    	});
    	io.emit('users', getAllUsers(allClients));
	});

	socket.on('subscribe', function(data) { 
		console.log('joining room', data.room);
		socket.join(data.room); 
	});

	socket.on('unsubscribe', function(room) {  
		console.log('leaving room', room);
		socket.leave(room); 
	});

	socket.on('send', function(data) {
		console.log('sending message');
		io.sockets.in(data.room).emit(data.room+'message', data);
	});

	socket.on('privatechat', function(users) {
		if(!roomAlreadyExists(privateRooms, users)) {
			var chatParticipants = allClients.filter((obj) => {
				return obj.user === users[0] || obj.user === users[1];
			});
			var newRoom = Math.random();
			var privateRoomObject = {
				users: []
			};
			chatParticipants.forEach((client) => {
				client.socket.emit('newChat', newRoom);
				privateRoomObject.users.push(client.user);
			});
			privateRooms.push(privateRoomObject);
		} else {
			console.log('room already exists');
		}
		
	});
  
});