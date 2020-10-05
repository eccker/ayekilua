let startSketch = () => {
	let sketch = (p) => {
		let trace = false // are we tracing?
		let socket
		let rg
		let now = 0
		let lastTextgeneratedTime = 0
		let words
		let glBandera = false
		let frase = ` `
		let started = false
		let canvasApp

		let makeHexString = (length = 6) => {
			let result = ''
			let characters = 'ABCDEF0123456789'
			let charactersLength = characters.length
			for (var i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength))
			}
			return result
		}


		p.preload = () => {

			console.log(`preloaded...`)
		}

		p.setup = () => {
			canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
			canvasApp.style('display', 'block')
			canvasApp.id('canvas')

			let paraph = p.select('#initialDiv')
			paraph.remove()

			p.frameRate(12)
			p.background(0) // clear the screen

			socket = io()
			socket.on('noteOn',
				(data) => {
					console.log(`noteOn was received from nodejs: ${data}`)
					// TODO do some stuff here
					flag2 = true
				}
			)

			socket.on('noteOff',
				(data) => {
					console.log(`noteOff was received from nodejs: ${data}`)
					// TODO do some stuff here

					flag2 = false
				}
			)

			socket.on('habitat',
				(data) => {
					console.log(`habitat was received from nodejs: ${JSON.stringify(data)}`)
				}
			)

			rg = new RiGrammar()

			let gramaticaLista = () => {
				console.log(`gramatica lista`)
				let result = rg.expand()
				console.log(result)
				words = RiTa.tokenize(`${rg.expand()} tomo una mordida!`)
				glBandera = true
			}

			rg.loadFrom(`./../assets/ayekilua.json`, gramaticaLista)

		}

		p.windowResized = () => {
			p.resizeCanvas(p.windowWidth, p.windowHeight)
		}

		p.draw = () => {
			if (started) {
				now = p.millis()
				p.background('rgba(0,0,0, 0.2618)')
				someHeartBeatPeriod = 1618 * 1.618 * 5
				if (now - lastTextgeneratedTime > someHeartBeatPeriod) {
					if (glBandera) {
						words = RiTa.tokenize(`${rg.expand()}`)
						lastTextgeneratedTime = now
						frase = ``
						for (let i = 0; i < words.length; i++) {
							if (words[i] === `,` && words[i] === `.`) {
								frase = frase + words[i]
							} else {
								frase = frase + ` ` + words[i]
							}
						}
						console.log(frase)
					}
				}


			}
		}
		p.keyReleased = function (key) {
			if (key == ' ') {
				trace = !trace
				r = p.random(20, 160)
				p.background(0)
			}
		}

		p.mousePressed = function () {
			started = true
			socket.emit(`LED`, `${p.floor(p.map(p.mouseX, 0, p.width, 0, 255))},${p.floor(p.map(p.mouseY, 0, p.height, 0, 255))},${p.floor(p.map(p.mouseY + p.mouseX, 0, p.width + p.height, 0, 255))}`)
		}

	}
	let myp5 = new p5(sketch)
}
startSketch()