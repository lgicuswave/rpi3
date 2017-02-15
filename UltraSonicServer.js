/**
 * http://usejsdoc.org/
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var wpi = require('wiring-pi');

var sp = require("serialport");
var serialPort = new sp('/dev/ttyACM0', {
		baudrate: 9600,
		parser: sp.parsers.readline("\n")
});

serialPort.on("open", function () {
    console.log('open');
});

serialPort.on('data', function(data) {
    //console.log('data received: ' + data.toString());    
	//console.log('input data' + input);
	io.emit('sensor message', data.toString());
});

var led_pin = 25;
var btn_pin = 29;
var sensor_pin = 26;

wpi.setup('wpi');

wpi.pinMode(led_pin, wpi.OUTPUT);
wpi.pinMode(btn_pin, wpi.INPUT);
wpi.pinMode(sensor_pin, wpi.INPUT);

var value = 0.1;

app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});

app.get('/on.html', function(req, res){
	//res.send('<h1>Hello world</h1>');	
	//res.send('Hello /');
	wpi.digitalWrite(led_pin, 1);
});

app.get('/off.html', function(req, res){
	//res.send('<h1>Hello world</h1>');	
	//res.send('Hello /');
	wpi.digitalWrite(led_pin, 0);
});


setInterval(function() {
	
	var input = wpi.digitalRead(btn_pin);
	
	if(input) {
		console.log('input data' + input);
		io.emit('sensor message', value);
		value += 0.1;
	}
	
}, 500);


var value = 0.0;

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
