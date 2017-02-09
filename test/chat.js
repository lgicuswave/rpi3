/**
 * http://usejsdoc.org/
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});

/*
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});
*/

var value = 0.0;



io.on('connection', function(socket){
	console.log('a user connected');
	
	setInterval(function() {
		console.log('send data');
		io.emit('sensor message', value);
		value += 0.1;
	}, 1000);
	
	socket.on('chat message', function(msg){
		console.log('message : ' + msg);
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
