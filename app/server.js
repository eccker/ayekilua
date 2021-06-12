// -------- cloud infrastructure, setting and configurations
require('console-stamp')(console, '[HH:MM:ss.l]')
let app = require('express')()
let serveStatic = require('serve-static')
let compression = require('compression')
let cookieSession = require('cookie-session')
let fs = require('fs')
let bodyParser = require('body-parser')
let port = process.env.PORT || 9002
const jsonwebtoken = require('jsonwebtoken')
const cors = require('cors')

let makeSecret = (length) => {
	let result = ``
	let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
	let charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

let secret1 = makeSecret(32)
let secret2 = makeSecret(32)

app.use(cors());
app.use(compression({ level: 9 }))
// store session state in browser cookie
app.use(cookieSession({ keys: [`${secret1}`, `${secret2}`] }))
// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/privacy', (req, res) => {
	console.log(`privacy requested`)
	const privacy = require('./legal.js').privacy;
	res.send(privacy);
}).get('/terms', (req, res) => {
	console.log(`terms requested`)
	const terms = require('./legal.js').terms;
	res.send(terms);
}).get('/token/:tokenStr', (req, res) => {
	console.log(`token requested`)
	let decoded
	try {
		decoded = jsonwebtoken.verify(req.params.tokenStr, 'zZHxtFcGrlychfSLKzv1Kg80uaK4zAM8')
	} catch (err) {
		console.error(`{"error":"unauthorized access or error token request"}`)
		res.send({"error":"unauthorized access or error request"})
		return null
	}

	const uname=decoded.credentials.username
	const hpssd=decoded.credentials.hashedpassword
	const hashid = `${makeSecret(32)}_${decoded.user.id}`
	const hashname = `${makeSecret(32)}_${decoded.user.name}`
	const hashnounce = `${makeSecret(32)}_${decoded.user.nounce}`

	let oPayload = {
			"user": {
				"id": hashid ,
				"name": hashname,
				"nounce": hashnounce,
		}
	}
	
	//TODO check if user exists in DB, if not generate user in DB
	let sPayload = JSON.stringify(oPayload, null, 4)
	let token = jsonwebtoken.sign(sPayload, 'OnUIZy0GMvZNzjnrYdp2ltRbl3irQDj1')

	// TODO send token by email when is registering
	res.send(token)
}).get('/auth/:authTokenStr', (req, res) => {
	let decoded
	try {
		decoded = jsonwebtoken.verify(req.params.authTokenStr, 'OnUIZy0GMvZNzjnrYdp2ltRbl3irQDj1')
	} catch (err) {
		console.error(`{"error":"unauthorized access or error auth request"}`)
		res.send({"error":"unauthorized access or error request"})
		return null;
	}
	res.send(decoded)
})

// -------- RUN SERVER
const server = app.use(serveStatic(__dirname + '/webinstrument/build/es6-bundled/')).listen(port, () => {
// const server = app.use(serveStatic(__dirname + '/webinstrument/')).listen(port, () => {
	console.log(`'Ayekilua' esta corriendo por el puerto ${port}`)
})

// -------- Cloud App, business logic 
let io = require('socket.io')(server, {
	transports: ['websocket'], allowRequest:
		(handshake, callback) => {
			var cookie, token, authPair, parts;
			// check for headers
			if (handshake.headers.cookie &&
				handshake.headers.cookie.split('=')[0] == 'ayekiluaapp') {
				// found request cookie, parse it
				cookie = handshake.headers.cookie
				token = cookie.split(/=(.+)/)[1] || ''
				authPair = new Buffer(token, 'base64').toString()
				parts = authPair.split(/:/)
				if (parts.length >= 1) {
					for (let index = 0; index < parts.length; index++) {
						let decoded
						try {
							decoded = jsonwebtoken.verify(parts[index], 'OnUIZy0GMvZNzjnrYdp2ltRbl3irQDj1')
						} catch (err) {
							return null;
						}
					}
					callback(null, true);
				} else {
					console.log(`Condition parts.length<1 happened, parts is:${parts}`)
					// not what we were expecting
					callback(null, false)
				}
			}
			else {
				// auth failed
				callback(null, false)
			}
		}
});
let allClients = []
io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado con id: ', socket.id)
	allClients.push(socket)
	socket.on(`disconnect`, ()  => {
	   console.log(`Got disconnect!`)
	   let i = allClients.indexOf(socket)
	   allClients.splice(i, 1)
	})
	socket.on(`noteOn`, (data) => {
		console.log(`El cliente ${socket.id} envio un "noteOn" con data: ${data} from socker.id: ${socket.id}`)
	})
	socket.on(`LED`, (data) => {
		const elements = data.split(";")
		const commands = elements[0]
		const uJWT = elements[1]
		let decoded
		let decoded2
		let id
		let name
		let nounce 
		try {
			decoded = jsonwebtoken.verify(uJWT, 'OnUIZy0GMvZNzjnrYdp2ltRbl3irQDj1')
			id = decoded.user.id
			name = decoded.user.name
			nounce = decoded.user.nounce
			//look for this in DB
		} catch (err) {
			console.error(`{"error":"unauthorized access or error auth request"}`)
			return null;
		}
		try {
			decoded2 = jsonwebtoken.verify(commands, uJWT)
		} catch (err) {
			return null;
		}
		// console.log(`El cliente ${socket.id} envio un "LED" con datos decodificados: `, decoded2)
		// console.log(`ID del cliente es: ${id} `)
		io.emit(`color`, decoded2.user.color)
		io.emit(`position`, [decoded2.user.mouseX, decoded2.user.mouseY])
		
		io.to(socket.id).emit(`habitat`, `Good job user ID: `+id)
	})
})