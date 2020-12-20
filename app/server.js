require('console-stamp')(console, '[HH:MM:ss.l]');

let app = require('express')();
let serveStatic = require('serve-static');
let compression = require('compression');
let cookieSession = require('cookie-session');
let fs = require('fs');
let bodyParser = require('body-parser')
let port = process.env.PORT || 9002;

let makeSecret = (length) => {
	let result           =  ``
	let characters       = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`  
	let charactersLength = characters.length
	for ( let i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
 }
 
let secret1 = makeSecret(32)
let secret2 = makeSecret(32)
console.log(`secret1: ${secret1}, secret2: ${secret2}`)
// gzip/deflate outgoing responses
app.use(compression({level: 9}))
// store session state in browser cookie
app.use(cookieSession({keys: [`${secret1}`, `${secret2}`]}))
// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded({extended: false}))

app.get('/privacy', (req, res) => {
	console.log(`privacy requested`)
	const privacy = require('./legal.js').privacy;
	res.send(privacy);
}).get('/terms', (req, res) => {
	console.log(`terms requested`)
	const terms = require('./legal.js').terms;
	res.send(terms);
})

const server = app.use(serveStatic(__dirname + '/webinstrument/')).listen(port, () => {
	console.log(`'Ayekilua' esta corriendo por el puerto ${port}`)
});

// -------- socket io section START
let io = require('socket.io')(server, { transports: ['websocket'] })
io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado con id: ', socket.id);	
	
	socket.on(`noteOn`, (data) => {
		console.log(`El cliente ${socket.id} envio un "noteOn" con data: ${data} from socker.id: ${socket.id}`);

	})

	socket.on(`LED`, (data) => {
		console.log(`El cliente ${socket.id} envio un "LED" con datos: `, data);
		io.emit(`habitat`, `LED recibido, contestando por habitat`);
		io.to(socket.id).emit(`habitat`,`LED recibido, contestando por mensaje privado al cliente ${socket.id}`)
	})
})
// --------- socket io section END
