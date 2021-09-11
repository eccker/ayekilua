let sketch = (p) => {
	let Greeter
	let AYEKIToken
	let greeting = `default greeting` 
	const greeterAddress = "0xF6bCB007b7E2840C6A999B75E00B5bF04Ff4c31D"
	const tokenAddress = "0x9c73f61a17Df027112482fe8CCc481D40D1d880E"

	
	let userAccount
	let amount

	let requestAccount = async () => {
		await window.ethereum.request({ method: 'eth_requestAccounts' });
	}
	
	let getBalance = async () => {
		if (typeof window.ethereum !== 'undefined') {
		  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
		  const provider = new ethers.providers.Web3Provider(window.ethereum);
		  const contract = new ethers.Contract(tokenAddress, AYEKIToken.abi, provider)
		  const balance = await contract.balanceOf(account);
		  console.log("Balance: ", balance.toString());
		}
	}

	let	sendCoins = async (userAccount, amount) => {
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
		  const provider = new ethers.providers.Web3Provider(window.ethereum);
		  const signer = provider.getSigner();
		  const contract = new ethers.Contract(tokenAddress, AYEKIToken.abi, signer);
		  const transation = await contract.transfer(userAccount, amount);
		  await transation.wait();
		  console.log(`${amount} Coins successfully sent to ${userAccount}`);
		}
	  }
	
	
	let fetchGreeting = async () => {
		if (typeof window.ethereum !== 'undefined') {
		  const provider = new ethers.providers.Web3Provider(window.ethereum)
		  const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
		  try {
			const data = await contract.greet()
			console.log('data: ', data)
		  } catch (err) {
			console.log("Error: ", err)
		  }
		}    
	  }
	
	  // call the smart contract, send an update
	let setGreeting = async () =>{
		if (!frase) return
		if (typeof window.ethereum !== 'undefined') {
			await requestAccount()
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner()
			const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
			const transaction = await contract.setGreeting(frase)
			await transaction.wait()
			fetchGreeting()
		}
	  }
	
	let trace = false // are we tracing?
	let rg
	let now = 0
	let lastTextgeneratedTime = 0
	let words
	let glBandera = false
	let frase = ` `
	let started = true
	let canvasApp
	let nft = `ayekilua_` 

	let ayekiluaElement
	let ayekiluaPath
	
	let fraseDiv
	let noiseScale = 0.02

	let xoff = 1.0
	let pointArrays
	let ayekiluaCommands
	let positionActual =0.0
	let elapsedTime
	let tempcol = `#33ffccff` 
	let someHeartBeatPeriod = 0
	let makeHexString = (length = 6) => {
		let result = ''
		let characters = 'ABCDEF0123456789'
		let charactersLength = characters.length
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	let modifyAyekilua = (addedDistortion) => {
		let newPointArrays = []
		
		for (let jj = 0; jj < pointArrays.length; jj++) {
			newPointArrays[jj] = []
			for (let kk = 0; kk < pointArrays[jj].length; kk++) {
				newPointArrays[jj][kk] = []
				for (let ll = 0; ll < pointArrays[jj][kk].length; ll++) {
					xoff = xoff - 0.618
					let n = p.noise(xoff) * 0.618382 * p.map(addedDistortion, 0, 2, -128,128) 
					// let n = p.noise(xoff) * addedDistortion
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
		ayekiluaPath = ayekiluaElement.setAttribute('d', ayekiluaPathModified)
		ayekiluaElement.setAttribute('d', ayekiluaPathModified)
		document.getElementById('ayekilua_svg').setAttribute('width', p.width)
		document.getElementById('ayekilua_svg').setAttribute('height', p.height)
	}

	p.preload = () => {
		rg = new RiGrammar()
		let gramaticaLista = () => {
			let result = rg.expand()
			words = RiTa.tokenize(`${result} tomo una mordida!`)
			glBandera = true
		}
		rg.loadFrom(`./../assets/ayekilua.json`, gramaticaLista)
		fetch("/assets/Greeter.json")
			.then(response => {
   				return response.json()
			})
			.then(jsondata => {
				Greeter = jsondata;
			})
		fetch("/assets/AYEKIToken.json")
			.then(response => {
   				return response.json()
			})
			.then(jsondata => {
				AYEKIToken = jsondata;
			})
	}

	p.setup = () => {
		canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
		canvasApp.style('display', 'block')
		canvasApp.id('canvas')
		canvasApp.position(0, 0, 'fixed')
		p.select('#initialDiv') ? p.select('#initialDiv').remove() : null
		p.frameRate(12)
		p.background(127) // clear the screen
		socket = io({ transports: ['websocket'] })
		socket.on('connect', () => {
			console.log(`Este cliente se ha conectado `);
		})
		socket.on('disconnect', () => {
			// socket.removeAllListeners()
		})
		socket.on('color',
			(data) => {
				if (ayekiluaElement.style.display === "flow-root") {
					ayekiluaElement.style.display = "block"
					ayekiluaElement.style.fill = data
					tempcol = data
				} else {
					ayekiluaElement.style.display = "flow-root"
					tempcol = data
					ayekiluaElement.style.fill = tempcol
				}
				
				// TODO do some stuff here
				flag2 = true
			}
		)

		socket.on('position',
			(data) => {
				// TODO do some stuff here
				let sum = data.map((v) => {
					return +v
				}).reduce((a, b) => {
					return a + b
				  })
				positionActual=parseFloat(sum)
				modifyAyekilua(positionActual)
				flag2 = false
			}
		)

		socket.on(`habitat`,
			(data) => {
				
			}
		)

		ayekiluaElement = document.getElementById('ayekiluaSVGPath')
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
					const thisPoint = parseFloat(pointArrays[jj][kk][ll])
					if (!isNaN(thisPoint)) {
						xoff = xoff - 0.0618
						let n = p.noise(xoff) * 1.1618382
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
		ayekiluaPath = ayekiluaElement.setAttribute('d', ayekiluaPathModified)

		document.getElementById('ayekilua_svg').setAttribute('width', p.width)
		document.getElementById('ayekilua_svg').setAttribute('height', p.height)

		someHeartBeatPeriod = 1000 *  (Math.floor(Math.random() * 32 ) + 1)	
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		document.getElementById('ayekilua_svg').setAttribute('width', p.windowWidth)
		document.getElementById('ayekilua_svg').setAttribute('height', p.windowHeight)
		p.background(p.random(19,28), p.random(26,28), p.random(26,35), 255)	
	}

	p.draw = () => {
		if (started) {
			now = p.millis()
			elapsedTime = now - lastTextgeneratedTime
			let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
			if (elapsedTime < someHeartBeatPeriod) {
				p.fill(tempcol)
				p.noStroke()
				p.rect(0,0,p.width/8,altura)
			}
			if (elapsedTime > (someHeartBeatPeriod/8)*7) {
				p.background(p.random(19,28), p.random(26,28), p.random(26,35), 12)	
			}
			if (elapsedTime > someHeartBeatPeriod) {
				p.background(p.random(19,28), p.random(26,28), p.random(26,35), 255)	
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
					p.textSize(22)
					p.fill(tempcol.substring(0, 7))
					positionActual =( (Math.floor(Math.random() * p.windowWidth) + 1) + (Math.floor(Math.random() * p.windowHeight) + 1) )/(p.windowWidth + p.windowHeight)
					ayekiluaElement.style.display = "flow-root"
					tempcol = "#" + makeHexString(8)
					ayekiluaElement.style.fill = tempcol
					someHeartBeatPeriod = 1000 *  (Math.floor(Math.random() * 48 ) + 6)
				}
				p.text(	frase, 
						( ( p.width/2  ) - ( p.width/4  )), 
						( ( p.height/2 ) - ( p.height/3 )), 
						( ( p.width/2  ) + ( p.width/8  )), 
						( ( p.height/2 ) + ( p.height/4 ))
					)
			}
			modifyAyekilua(positionActual)	
		}
	}

	p.keyReleased = () => {
		if (p.key === 'T') {
			html2canvas(document.body)
				.then(function(canvas) {
					const link = document.createElement('a')
					link.download = `${nft}${tempcol.substring(1)}_${positionActual}.png`
					link.href = canvas.toDataURL()
					link.click();
					link.delete;
				})
		} 
		if (p.key === 's') {
			greeting = `new greting.....${makeSecret(8)}`
			setGreeting()
		}
		if (p.key === 'b') {
			greeting = `new greting.....${makeSecret(8)}`
			getBalance()
		}
		if (p.key === 'X') {
			sendCoins('0x8bBd610542c67B355CC0152511ac2b3560F7d13c', 1618000000);
		}
		
	}

	p.mousePressed = () => {
		started = true
		ayekiluaElement.style.display = "flow-root"
		tempcol = "#" + makeHexString(8)
		ayekiluaElement.style.fill = tempcol
		positionActual = (p.mouseY + p.mouseX)/(p.width + p.height)
		modifyAyekilua(positionActual)
		let currentJWT = window.localStorage.getItem('userJWT')
		let oHeader = { alg: 'HS256', typ: 'JWT' }
		let oPayload = {
				"user": {
					"mouseX": `${p.mouseX/p.width}`,
					"mouseY": `${p.mouseY/p.height}`,
					"color": tempcol,
				}
		}
		let sHeader = JSON.stringify(oHeader)
		let sPayload = JSON.stringify(oPayload)
		let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
		socket.emit(`LED`, signedCommands+`;`+currentJWT)
		fetchGreeting()
	}
}