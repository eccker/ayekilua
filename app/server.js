let app = require('express')();
var expressWs = require('express-ws')(app);

let serveStatic = require('serve-static');
const rp = require('request-promise');


// var server = require('http').Server(app);
require('console-stamp')(console, '[HH:MM:ss.l]');
// gzip/deflate outgoing responses
let compression = require('compression');
app.use(compression({
	level: 9
}));
// store session state in browser cookie
let cookieSession = require('cookie-session');
app.use(cookieSession({
	keys: ['secret1', 'secret2']
}));
// parse urlencoded request bodies into req.body
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));

let fs = require('fs');
app.get('/privacy', (req, res) => {
	console.log(`privacy requested`)
	const privacy = require('./legal.js').privacy;
	res.send(privacy);
}).get('/terms', (req, res) => {
	console.log(`terms requested`)
	const terms = require('./legal.js').terms;
	res.send(terms);
}).ws('/planta', function (ws, req) {
	ws.on('message', function (msg) {
		//console.log(`A message: ${msg} was recived through websocket from ESP`)
		if (msg.includes(`touched`)) {
			let matches = msg.match(/(\d+)/);
			//console.log(matches[0])
			io.emit("noteOn", matches[0])
		} else if(msg.includes(`release`)){
			let matches = msg.match(/(\d+)/);
			//console.log(matches[0])
			io.emit("noteOff", matches[0])
		} else if(msg.includes(`habitat`)){
			let [habJson, jsonOBJ] = JSON.parse(msg.replace(/[^ -~]+/g, ""))
			console.log(`habJson is: ${habJson}`);
			console.log(`jsonOBJ is: ${JSON.stringify(jsonOBJ)}`);
			io.emit(habJson,jsonOBJ)
		} else if(msg.includes(`playNote`)){
			let [endpoint, dataObj] = JSON.parse(msg.replace(/[^ -~]+/g, ""))
			console.log(`endpoint is: ${endpoint}`);
			console.log(`dataObj is: ${JSON.stringify(dataObj)}`);
			io.emit(endpoint,dataObj)
		}

		ws.send(msg);
	});
});

let port = 9002;

// const server = app.use(serveStatic(__dirname + '/webinstrument/build/es6-bundled/')).listen(port, () => {
// 	console.log('\'Positio\' esta al aire desde un container con cicd por el puerto ' + port);
// });

const server = app.use(serveStatic(__dirname + '/webinstrument/')).listen(port, () => {
	console.log('\'Ayekilua\' esta al aire  el puerto ' + port);
});


// -------- socket io secction START
let io = require('socket.io')(server)
// io.listen(server)
io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado con id: ', socket.id);
	socket.on(`noteOn`, (data) => {
		console.log(`El cliente ${socket.id} envio un "noteOn" con data: `, data);
		io.emit(`noteOn received`)
	})
	socket.on(`LED`, (data) => {
		console.log(`El cliente ${socket.id} envio un "LED" con data: `, data);
		io.emit(`LED received`)
		//
		//console.log(expressWs.getWss().clients);
		expressWs.app.ws('/planta', function (ws, req) {
			ws.send(data)
		})		//
	})
})
// --------- socket io section END
