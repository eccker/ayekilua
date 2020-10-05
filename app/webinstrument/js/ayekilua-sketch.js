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


		let ayekiluaElement
		let ayekiluaPath

		let noiseScale = 0.02
		let xoff = 1.0
		let pointArrays
		let ayekiluaCommands

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
			canvasApp.position(0, 0, 'fixed')
			let paraph = p.select('#initialDiv')
			paraph.remove()

			p.frameRate(12)
			p.background(127) // clear the screen

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
				let result = rg.expand()
				words = RiTa.tokenize(`${result} tomo una mordida!`)
				glBandera = true
			}

			rg.loadFrom(`./../assets/ayekilua.json`, gramaticaLista)
			
			
			ayekiluaElement = document.getElementById('path10')
			ayekiluaPath = ayekiluaElement.getAttribute('d')
			ayekiluaCommands = ayekiluaPath.split(/(?=[lmcLMC])/)
			
			pointArrays = ayekiluaCommands.map((d) => {
				let pointsArray = d.slice(0, -1).split(' ')
				let pairsArray = []
				for (let i = 1; i < pointsArray.length; i += 1) {
					let pairToPush = pointsArray[i].split(',')
					if (pairToPush != 'z') {
						pairsArray.push(pairToPush)
					}
				}
				return pairsArray
			})

			let newPointArrays = []
			for (let jj = 0; jj < pointArrays.length; jj++) {
				newPointArrays[jj] = []
				for (let kk = 0; kk < pointArrays[jj].length; kk++) {
					newPointArrays[jj][kk] = []
					for (let ll = 0; ll < pointArrays[jj][kk].length; ll++) {
						xoff = xoff - 0.0618
						let n = p.noise(xoff) * 1.618382
						const thisPoint = parseFloat(pointArrays[jj][kk][ll])
						if (!isNaN(thisPoint)) {
							newPointArrays[jj][kk][ll] = (thisPoint + n)
						}
					}
				}
			}

			let ayekiluaPathModifiedArray = []
			for (let ii = 0; ii < ayekiluaCommands.length; ii++) {
				let commType = ayekiluaCommands[ii][0]
				let verifLast1 = ayekiluaCommands[ii][ayekiluaCommands[ii].length - 1]
				let verifLast2 = ayekiluaCommands[ii][ayekiluaCommands[ii].length - 2]
				let reconstructedCommand = commType // init with command type
				for (let i = 0; i < pointArrays[ii].length; i++) {
					reconstructedCommand += " " + (newPointArrays[ii][i].toString())
				}
				if (verifLast1 == 'z' || verifLast2 == 'z') {
					reconstructedCommand += " " + 'z'
				}
				ayekiluaPathModifiedArray.push(reconstructedCommand)
			}
			let ayekiluaPathModified = ayekiluaPathModifiedArray.join(' ')
			//console.log(ayekiluaPathModified)
			ayekiluaPath = ayekiluaElement.setAttribute('d', ayekiluaPathModified)

			document.getElementById('ayekilua_svg').setAttribute('width', p.width)
			document.getElementById('ayekilua_svg').setAttribute('height', p.height)



		}

		p.windowResized = () => {
			p.resizeCanvas(p.windowWidth, p.windowHeight)
			document.getElementById('ayekilua_svg').setAttribute('width', p.windowWidth)
			document.getElementById('ayekilua_svg').setAttribute('height', p.windowHeight)
		}

		p.draw = () => {
			if (started) {
				now = p.millis()
				p.background('rgba(0,110,0, 0.2618)')
				someHeartBeatPeriod = 1618 * 1.618 * 2
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
				modifyAyekilua()

			}
		}
		p.keyReleased = () => {
			if (p.key === ' ') {
				trace = !trace
				p.background(0)
			}
		}

		let modifyAyekilua = () => {
			let newPointArrays = []
			for (let jj = 0; jj < pointArrays.length; jj++) {
				newPointArrays[jj] = []
				for (let kk = 0; kk < pointArrays[jj].length; kk++) {
					newPointArrays[jj][kk] = []
					for (let ll = 0; ll < pointArrays[jj][kk].length; ll++) {
						xoff = xoff - 0.0618
						let n = p.noise(xoff) * 0.618382 * p.random(0, p.map(p.mouseY,0, p.height, -26, 26))
						const thisPoint = parseFloat(pointArrays[jj][kk][ll])
						if (!isNaN(thisPoint)) {
							newPointArrays[jj][kk][ll] = (thisPoint + n)
						}
					}
				}
			}

			let ayekiluaPathModifiedArray = []
			for (let ii = 0; ii < ayekiluaCommands.length; ii++) {
				let commType = ayekiluaCommands[ii][0]
				let verifLast1 = ayekiluaCommands[ii][ayekiluaCommands[ii].length - 1]
				let verifLast2 = ayekiluaCommands[ii][ayekiluaCommands[ii].length - 2]
				let reconstructedCommand = commType // init with command type
				for (let i = 0; i < pointArrays[ii].length; i++) {
					reconstructedCommand += " " + (newPointArrays[ii][i].toString())
				}
				if (verifLast1 == 'z' || verifLast2 == 'z') {
					reconstructedCommand += " " + 'z'
				}
				ayekiluaPathModifiedArray.push(reconstructedCommand)
			}
			let ayekiluaPathModified = ayekiluaPathModifiedArray.join(' ')
			//console.log(ayekiluaPathModified)
			ayekiluaPath = ayekiluaElement.setAttribute('d', ayekiluaPathModified)
			ayekiluaElement.setAttribute('d', ayekiluaPathModified)
			document.getElementById('ayekilua_svg').setAttribute('width', p.width)
			document.getElementById('ayekilua_svg').setAttribute('height', p.height)
		}

		p.mousePressed = () => {
			started = true
			socket.emit(`LED`, `${p.floor(p.map(p.mouseX, 0, p.width, 0, 255))},${p.floor(p.map(p.mouseY, 0, p.height, 0, 255))},${p.floor(p.map(p.mouseY + p.mouseX, 0, p.width + p.height, 0, 255))}`)
			if (ayekiluaElement.style.display === "flow-root") {
				ayekiluaElement.style.display = "block"
				ayekiluaElement.style.fill = "#ff3366"
			} else {
				ayekiluaElement.style.display = "flow-root"
				let tempcol = "#" + makeHexString(6)
				console.log(tempcol)
				ayekiluaElement.style.fill = tempcol
			}
			modifyAyekilua()
		}

	}
	let myp5 = new p5(sketch)
}
startSketch()