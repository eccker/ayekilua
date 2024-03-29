let sketch = (p) => {
	let Stamper
	let Token
	let NFT
	let NFTMarket

	let forMint_ayekiluaModifiedPathArray
	let forMint_ayekiluaModifiedPathString


	
	let forMintName
    let forMintDescription
	let forMintColor
	let forMintPrice
	let nfts

	const marketAddress = "0x6806eCB13d6c826A95B69Cbc83258aC3612A3521"
	const NFTAddress = "0x2f3F71167EFa74b55DCd04bE82C68d3ad5a4fACC"
	// const tokenAddress = "0x54333c974b791399D043756DBC077F956aeA6978"
	// const stamperAddress = "0xF08DcdBb279175cf0742075b13990E878Bb35506"

	let b64_to_utf8 = (str) => {
		return decodeURIComponent(escape(window.atob(str)));
	}

	let generateDistortedAyekiluaInDOM = (_distortion, _SVGPoints3DArray, _ayekiluaCommands, SVGDOMElement) => {
		let ayekiluaModifiedPathArray = modifyShapeByDistortion(_distortion, _SVGPoints3DArray)
		let ayekiluaModifiedPathString = convert3DArrayToDPathString(ayekiluaModifiedPathArray, _ayekiluaCommands)
		SVGDOMElement.setAttribute('d', ayekiluaModifiedPathString)
		document.getElementById('ayekilua_svg').setAttribute('width', p.width)
		document.getElementById('ayekilua_svg').setAttribute('height', p.height)
	}

	let requestAccount = async () => {
		return await window.ethereum.request({
			method: 'eth_requestAccounts'
		});
	}

	let getBalance = async () => {
		// if (typeof window.ethereum !== 'undefined') {
		// 	const [account] = await window.ethereum.request({
		// 		method: 'eth_requestAccounts'
		// 	})
		// 	const provider = new ethers.providers.Web3Provider(window.ethereum);
		// 	const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
		// 	const balance = await contract.balanceOf(account);
		// 	console.log("Balance: ", balance.toString());
		// }
	}

	let sendCoins = async (userAccount, amount) => {
		// if (typeof window.ethereum !== 'undefined') {
		// 	await requestAccount()
		// 	const provider = new ethers.providers.Web3Provider(window.ethereum);
		// 	const signer = provider.getSigner();
		// 	const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
		// 	const transation = await contract.transfer(userAccount, amount);
		// 	await transation.wait();
		// 	console.log(`${amount} Coins successfully sent to ${userAccount}`);
		// }
	}

	// let fetchStamp = async () => {
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		const provider = new ethers.providers.Web3Provider(window.ethereum)
	// 		const contract = new ethers.Contract(stamperAddress, Stamper.abi, provider)
	// 		try {
	// 			const data = await contract.getStamp()
	// 			console.log('data: ', data)
	// 		} catch (err) {
	// 			console.log("Error: ", err)
	// 		}
	// 	}
	// }

	// call the smart contract, send an update
	// let setStamp = async () => {
	// 	if (!frase) return
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		await requestAccount()
	// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
	// 		const signer = provider.getSigner()
	// 		const contract = new ethers.Contract(stamperAddress, Stamper.abi, signer)
	// 		const transaction = await contract.setStamp(frase)
	// 		await transaction.wait()
	// 		fetchStamp()
	// 	}
	// }

	String.prototype.replaceWithUtf8 = function() {
		function r(r) {
		  for (var t, n, e = "", i = 0; !isNaN(t = r.charCodeAt(i++)); ) n = t.toString(16), 
		  e += 256 > t ? "\\\\x" + (t > 15 ? "" :"0") + n :"\\u" + ("0000" + n).slice(-4);
		  return e;
		}
		var a, c, o, u, s, e = "", i = this, t = [ "/", '"' ], n = [ "\\/", '\\"' ];
		for (a = 0; a < i.length; a++) c = i.charCodeAt(a), o = i.charAt(a), u = t.indexOf(o), 
		u > -1 ? e += n[u] :c > 126 && 65536 > c ? (s = r(o), e += s) :e += o;
		return e;
	  };

	  String.prototype.decodeEscapeSequence = function() {
		return this.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
			return String.fromCharCode(parseInt(arguments[1], 16));
		});
	};
	

	// call the smart contract, send an update
	let createNFTItem = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const [account] = await requestAccount();
			console.dir(account)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)
			// Generate SVG Path
			
			// console.log(ayekiluaModifiedPathString.length)
			console.log(`____________________________________________________________` )
			p.noLoop()

			// Generate NFT
			// let requestId = await contract.createRandomSVGNFT(ayekiluaModifiedPathString, _name.replaceWithUtf8(), _description.replaceWithUtf8(), _color, {gasLimit: 5000000})
			// let tx = await requestId.wait(10);
			// '25000000000000000'
			
			const _mintprice = ethers.utils.parseUnits('0.02618', 'ether')
			tx = await contract.create({ gasLimit: 3000000, value: _mintprice})

			await new Promise(r => setTimeout(r, 180000))
			p.loop()
    		let receipt = await tx.wait(1)
    		// let tokenId = receipt.events[3].topics[2]

			// console.dir(requestId)
			console.log(`****____________________________________________________________` )
			console.dir(`El tokenId es: ${receipt}`)
			// console.log(`++++++++____________________________________________________________` )
		}
	}

	let finishMinting = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const [account] = await requestAccount();
			console.dir(account)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)

			// let ayekiluaModifiedPathArray = modifyShapeByDistortion(positionActual, ayekiluaPoints3DArray)
			// let ayekiluaModifiedPathString = convert3DArrayToDPathString(ayekiluaModifiedPathArray, ayekiluaCommands)

			// forMintDescription
			// forMintColor 
			// forMint_ayekiluaModifiedPathString
			let selectedTokenId = parseInt(prompt("Select tokenId: "))
			let transaction = await contract.finishMint(selectedTokenId, forMint_ayekiluaModifiedPathString, forMintName.replaceWithUtf8(), forMintDescription.replaceWithUtf8(), forMintColor);
			await transaction.wait()
			console.log(`You can view the tokenURI here ${await contract.tokenURI(selectedTokenId)}`)
			p.loop()
		}
	}

	
	


	let saleNFTItem = async (_price, _tokenId) => {
		if (typeof window.ethereum !== 'undefined') {
			await requestAccount()
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner()
			const price = ethers.utils.parseUnits(_price, 'ether')
			let contract = new ethers.Contract(marketAddress, NFTMarket.abi, signer)
			let listingPrice = await contract.getListingPrice()
			transaction = await contract.createMarketItem(NFTAddress, _tokenId, price, {
				value: listingPrice
			})
			await transaction.wait()
		}
	}

	let loadNFTs = async () => {
		// const provider = new ethers.providers.JsonRpcProvider()
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
		const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider)
		console.log(`You can view the tokenURI here ${await tokenContract.tokenURI(2)}`)

		const data = await marketContract.fetchItemsCreated()
		// const data = await marketContract.fetchMarketItems()
		// await data.wait()

		const items = await Promise.all(data.map(async i => {
			const tokenUri = await tokenContract.tokenURI(i.tokenId)
			let splitedToken = `${b64_to_utf8(tokenUri.split(',')[1])}`
			const meta = JSON.parse(splitedToken.decodeEscapeSequence())
			let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
			let item = {
				price,
				tokenId: i.tokenId.toNumber(),
				seller: i.seller,
				owner: i.owner,
				image: meta.image,
				name: meta.name,
				description: meta.description,
			}
			return item
		}))

		console.log(items)
		return items
	}

	let loadMyNFTs = async () => {
		// const provider = new ethers.providers.JsonRpcProvider()
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
		const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider)
		const data = await marketContract.fetchMyNFTs()

		const items = await Promise.all(data.map(async i => {
			const tokenUri = await tokenContract.tokenURI(i.tokenId)
			let splitedToken = `${b64_to_utf8(tokenUri.split(',')[1])}`
			const meta = JSON.parse(splitedToken.decodeEscapeSequence())
			let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
			let item = {
				price,
				tokenId: i.tokenId.toNumber(),
				seller: i.seller,
				owner: i.owner,
				image: meta.image,
				name: meta.name,
				description: meta.description,
			}
			return item
		}))
		return items
	}
	async function buyNft() {
		// const web3Modal = new Web3Modal()
		// const connection = await web3Modal.connect()
		// const provider = new ethers.providers.Web3Provider(connection)

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner()
		const contract = new ethers.Contract(marketAddress, NFTMarket.abi, signer)

		const price = ethers.utils.parseUnits('0.09', 'ether')
		const transaction = await contract.createMarketSale(NFTAddress, 0, {
			value: price
		})
		await transaction.wait()
		await loadNFTs()
	}


	let trace = false // are we tracing?
	let rg
	let now = 0
	let lastTextgeneratedTime = 0
	let words
	let glBandera = false
	let frase = ` `
	let started = false
	let canvasApp
	let nft = `ayekilua_`

	let ayekiluaElement
	let ayekiluaPath

	let fraseDiv
	let noiseScale = 0.02

	let xoff = 0.0
    let yoff = 0.0
	let ayekiluaPoints3DArray
	let ayekiluaCommands
	let pathObj01
    let pathObj02
	let pathObj03
	let pathObj04
	let pathObj05
	let pathObj06
	let pathObj07
	let pathObj08
	let pathObj09
	let pathObj10
	let pathObj11
	let pathObj12
	let pathObj13
	let pathObj14
	let pathObj15
	let pathObj16
	let pathObj17
	let pathObj18
	let pathObj19
	let pathObj20
	let pathObj21
	let pathObj22
	let pathObj23
	let pathObj24
	let pathObj25
	let pathObj26
	let pathObj27
	let pathObj28
	let pathObj29
	let pathObj30
	let pathObj31
	let pathObj32
	let pathObj33
	let pathObj34


	let positionActual = 0.0
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
    
	let modifyShapeByDistortion = (_distortion, _shapeData3DArray) => {
        const dimensions = [
            _shapeData3DArray.length,
            _shapeData3DArray.reduce((x, y) => Math.max(x, y.length), 0)
        ];

        //  console.log(`dimensions0`, dimensions)
        //  console.log(`dimensions1`, _shapeData3DArray.length)
        //  console.log(`dimensions2`, _shapeData3DArray[0].length)
        //  console.log(`dimensions3`, _shapeData3DArray[0])

		let modifiedShapeData3DArray = []
        
		for (let jj = 0; jj < _shapeData3DArray.length; jj++) {
			modifiedShapeData3DArray[jj] = []
			for (let kk = 0; kk < _shapeData3DArray[jj].length; kk++) {
				modifiedShapeData3DArray[jj][kk] = []
				for (let ll = 0; ll < _shapeData3DArray[jj][kk].length; ll++) {
					const currentPoint = parseFloat(_shapeData3DArray[jj][kk][ll])
					if (!isNaN(currentPoint)) {
						if(ll === 0) {
                            xoff = xoff + 0.5
                            let n = p.noise(xoff) + currentPoint + p.map(_distortion, 0, 1, -10,10) 
                            // let n = p.noise(xoff) * currentPoint
                            // let n = 0;
                            // if(jj<1 && kk < 1){
                            //     console.log(`xoff        : `, xoff)
                            //     console.log(`punto actual: `, currentPoint)
                            //     console.log(`punto n     : `, n)
                            // }
                            
                            let volado = p.random(p.random(-256, 0), 1)
                            volado>0?modifiedShapeData3DArray[jj][kk][ll] = parseFloat(n):modifiedShapeData3DArray[jj][kk][ll] = parseFloat(currentPoint)
                        } else {
                            yoff = yoff + 0.5
                            let n = p.noise(yoff) + currentPoint + p.map(_distortion, 0, 1, -10,10) 
                            let volado = p.random(p.random(-256, 0), 1)
                            volado>0?modifiedShapeData3DArray[jj][kk][ll] = parseFloat(n):modifiedShapeData3DArray[jj][kk][ll] = parseFloat(currentPoint)
                        }
					}
				}
			}
		}
        // console.log(`modifiedShapeData3DArray`, modifiedShapeData3DArray)
        // return _shapeData3DArray
		return modifiedShapeData3DArray
	}

	let convert3DArrayToDPathString = (shapeData3DArrayToConvert, _DPathCommands) => {
		let ayekiluaPathModifiedArray = []
		for (let ii = 0; ii < _DPathCommands.length; ii++) {
			let commType = _DPathCommands[ii][0]
			let verifLast1 = _DPathCommands[ii][_DPathCommands[ii].length - 1]
			// let verifLast2 = _DPathCommands[ii][_DPathCommands[ii].length - 2]
			let reconstructedCommand = commType // init with command type
			for (let i = 0; i < shapeData3DArrayToConvert[ii].length; i++) {
				reconstructedCommand += " " + (shapeData3DArrayToConvert[ii][i].toString())
			}
			if (verifLast1 === 'z' || verifLast1 === 'Z') {
				reconstructedCommand += " " + 'z'
			}
			ayekiluaPathModifiedArray.push(reconstructedCommand)
		}
		let ayekiluaPathModified = ayekiluaPathModifiedArray.join(' ')

		return ayekiluaPathModified
	}

	let getPathDataFromDOMById = (svgPathId) => {
        
		let element = document.getElementById(svgPathId)
		let path = element.getAttribute('d')
		let commandsArgsArray = path.replace(/-/g,' -').replace(/,/g,' ').split(/(?=[lmcLMCvVhHzZsSqQTtaA])/)
        // console.log(`commandsArray::::::::::::`, commandsArgsArray)
        let commands = []
		let result = commandsArgsArray.map((cmd, index) => {
            let pairsArray = []
            const regexZero = /[zZ]/;
            const regex = /-?\d+(\.\d+)?/g;
            commands[index] = cmd[0]
            // console.log(`cmd is: `, cmd)

    		let elementToPush
            if(regexZero.test(cmd[0])){
                elementToPush = ' '
            }else{
                elementToPush = cmd.slice(1).match(regex).map(Number)

            }
            // console.log(`elemento to PUSH`, elementToPush)
            pairsArray.push(elementToPush)

			// let pointsArray = cmd.slice(1).split(' ')
			// let pairsArray = []
			// for (let i = 0; i < pointsArray.length; i += 1) {
            //     if(cmd[0] === 'Z' || cmd[0] === 'z'){
            //         continue;
            //     }
			// 	const elementToPush = cmd.slice(1).match(regex).map(Number)
            //     console.log(`elementoTOPUSH`, elementToPush)
            //     const regexTwo = /[lLmM]/;
            //     const regexFour = /[sSqQ]/;
            //     const regexSix = /[cC]/;
            //     const regexOne = /[vVhH]/;
            //     if(regexZero.test(cmd[0])){
            //         elementToPush = ' '
            //     }
            //     pairsArray[index] = elementToPush
			// }
			return pairsArray
		})
		return {
			"data":result,
			"commands": commands, 
			"element": element
		}
	}

	p.preload = () => {
		rg = new RiGrammar()
		let gramaticaLista = () => {
			let result = rg.expand()
			words = RiTa.tokenize(`${result} tomo una mordida!`)
			glBandera = true
		}
		rg.loadFrom(`./../assets/ayekilua_en.json`, gramaticaLista)
		// fetch("/assets/Stamper.json")
		// 	.then(response => {
		// 		return response.json()
		// 	})
		// 	.then(jsondata => {
		// 		Stamper = jsondata;
		// 	})
		// fetch("/assets/Token.json")
		// 	.then(response => {
		// 		return response.json()
		// 	})
		// 	.then(jsondata => {
		// 		Token = jsondata;
		// 	})
		fetch("/assets/NFT.json")
			.then(response => {
				return response.json()
			})
			.then(jsondata => {
				NFT = jsondata;
			})
		fetch("/assets/NFTMarket.json")
			.then(response => {
				return response.json()
			})
			.then(jsondata => {
				NFTMarket = jsondata;
			})
	}

	p.setup = () => {
		canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
		canvasApp.style('display', 'block')
		canvasApp.id('canvas')
		canvasApp.position(0, 0, 'fixed')
		p.select('#initialDiv') ? p.select('#initialDiv').remove() : null
		p.frameRate(6)
		p.background(127) // clear the screen
		socket = io({
			transports: ['websocket']
		})
		socket.on('connect', () => {
			console.log(`Este cliente se ha conectado `);
		})
		socket.on('disconnect', () => {
			socket.removeAllListeners()
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
				positionActual = parseFloat(sum)
				generateDistortedAyekiluaInDOM(positionActual, ayekiluaPoints3DArray, ayekiluaCommands, ayekiluaElement)
				flag2 = false
			}
		)

		socket.on(`habitat`,
			(data) => {

			}
		)

		pathObj01 = getPathDataFromDOMById('AyekiluaSVGBrazoIzquierdo')
		pathObj02 = getPathDataFromDOMById('AyekiluaSVGPiernaIzquierda')
		pathObj03 = getPathDataFromDOMById('AyekiluaSVGPiernaDerecha')

		pathObj04 = getPathDataFromDOMById('AyekiluaSVGRellenoCara')
		pathObj05 = getPathDataFromDOMById('AyekiluaSVGParpadoDerecho')
		pathObj06 = getPathDataFromDOMById('AyekiluaSVGSombraUnoParpadoDerecho')
		pathObj07 = getPathDataFromDOMById('AyekiluaSVGSombraParpadoDerecho')
		pathObj08 = getPathDataFromDOMById('AyekiluaSVGOjoDerecho')
        pathObj09 = getPathDataFromDOMById('AyekiluaSVGParpadoIzquierdo')
		pathObj10 = getPathDataFromDOMById('AyekiluaSVGOjoIzquierdo')
		// pathObj11 = getPathDataFromDOMById('AyekiluaSVGNarizIzquierda')
		// pathObj12 = getPathDataFromDOMById('AyekiluaSVGLabioInferior')
		pathObj13 = getPathDataFromDOMById('AyekiluaSVGCejaPomuloLabioSuperior')
        pathObj14 = getPathDataFromDOMById('AyekiluaSVGNarizDerecha')
		pathObj15 = getPathDataFromDOMById('AyekiluaSVGBranquiaSuperiorIzquierda')
		pathObj16 = getPathDataFromDOMById('AyekiluaSVGBranquiaSuperiorIzquierdaSombra')
		pathObj17 = getPathDataFromDOMById('AyekiluaSVGBranquiaMediaIzquierdaSombra')
		pathObj18 = getPathDataFromDOMById('AyekiluaSVGBranquiaMediaIzquierda')
        pathObj19 = getPathDataFromDOMById('AyekiluaSVGBranquiaInferiorIzquierdaSombra')
		pathObj20 = getPathDataFromDOMById('AyekiluaSVGBranquiaInferiorIzquierda')
		pathObj21 = getPathDataFromDOMById('AyekiluaSVGAletaDorsal')
		pathObj22 = getPathDataFromDOMById('AyekiluaSVGAbdomen')
		pathObj23 = getPathDataFromDOMById('AyekiluaSVGCola')
        pathObj24 = getPathDataFromDOMById('AyekiluaSVGPlieguesAbdomen')
		pathObj25 = getPathDataFromDOMById('AyekiluaSVGCuerpoCompleto')
		pathObj26 = getPathDataFromDOMById('AyekiluaSVGPiernaDerecha')
		pathObj27 = getPathDataFromDOMById('AyekiluaSVGLuzPiernaDerecha')
		pathObj28 = getPathDataFromDOMById('AyekiluaSVGBrazoDerecho')
        pathObj29 = getPathDataFromDOMById('AyekiluaSVGBranquiaSuperiorDerechaSombra')
		pathObj30 = getPathDataFromDOMById('AyekiluaSVGBrankiaSuperiorDerecha')
		pathObj31 = getPathDataFromDOMById('AyekiluaSVGBranquiaMediaDerechaSombra')
		pathObj32 = getPathDataFromDOMById('AyekiluaSVGBranquiaMediaDerecha')
		pathObj33 = getPathDataFromDOMById('AyekiluaSVGBranquiaInferiorDerechaSombra')
        pathObj34 = getPathDataFromDOMById('AyekiluaSVGBranquiaInferiorDerecha')



		ayekiluaPoints3DArray = pathObj01.data
        console.log(`AQUI ayekiluaPoints3DArray: `, ayekiluaPoints3DArray)
		ayekiluaCommands = pathObj01.commands
		ayekiluaElement = pathObj01.element

		generateDistortedAyekiluaInDOM( 1, ayekiluaPoints3DArray, ayekiluaCommands, ayekiluaElement)
		generateDistortedAyekiluaInDOM( 1, pathObj02.data, pathObj02.commands, pathObj02.element)
		generateDistortedAyekiluaInDOM( 1, pathObj03.data, pathObj03.commands, pathObj03.element)

        generateDistortedAyekiluaInDOM( 1, pathObj04.data, pathObj04.commands, pathObj04.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj05.data, pathObj05.commands, pathObj05.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj06.data, pathObj06.commands, pathObj06.element)
        generateDistortedAyekiluaInDOM( 1, pathObj07.data, pathObj07.commands, pathObj07.element)
        generateDistortedAyekiluaInDOM( 1, pathObj08.data, pathObj08.commands, pathObj08.element)
        generateDistortedAyekiluaInDOM( 1, pathObj09.data, pathObj09.commands, pathObj09.element)
        generateDistortedAyekiluaInDOM( 1, pathObj10.data, pathObj10.commands, pathObj10.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj11.data, pathObj11.commands, pathObj11.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj12.data, pathObj12.commands, pathObj12.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj13.data, pathObj13.commands, pathObj13.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj14.data, pathObj14.commands, pathObj14.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj15.data, pathObj15.commands, pathObj15.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj16.data, pathObj16.commands, pathObj16.element)
        generateDistortedAyekiluaInDOM( 1, pathObj17.data, pathObj17.commands, pathObj17.element)
        generateDistortedAyekiluaInDOM( 1, pathObj18.data, pathObj18.commands, pathObj18.element)
        generateDistortedAyekiluaInDOM( 1, pathObj19.data, pathObj19.commands, pathObj19.element)
        generateDistortedAyekiluaInDOM( 1, pathObj20.data, pathObj20.commands, pathObj20.element)
        generateDistortedAyekiluaInDOM( 1, pathObj21.data, pathObj21.commands, pathObj21.element)
        generateDistortedAyekiluaInDOM( 1, pathObj22.data, pathObj22.commands, pathObj22.element)
        generateDistortedAyekiluaInDOM( 1, pathObj23.data, pathObj23.commands, pathObj23.element)
        generateDistortedAyekiluaInDOM( 1, pathObj24.data, pathObj24.commands, pathObj24.element)
        generateDistortedAyekiluaInDOM( 1, pathObj25.data, pathObj25.commands, pathObj25.element)
        generateDistortedAyekiluaInDOM( 1, pathObj26.data, pathObj26.commands, pathObj26.element)
        generateDistortedAyekiluaInDOM( 1, pathObj27.data, pathObj27.commands, pathObj27.element)
        generateDistortedAyekiluaInDOM( 1, pathObj28.data, pathObj28.commands, pathObj28.element)
        generateDistortedAyekiluaInDOM( 1, pathObj29.data, pathObj29.commands, pathObj29.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj30.data, pathObj30.commands, pathObj30.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj31.data, pathObj31.commands, pathObj31.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj32.data, pathObj32.commands, pathObj32.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj33.data, pathObj33.commands, pathObj33.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj34.data, pathObj34.commands, pathObj34.element)

		someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 32) + 1)

	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		document.getElementById('ayekilua_svg').setAttribute('width', p.windowWidth)
		document.getElementById('ayekilua_svg').setAttribute('height', p.windowHeight)
		p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
	}

	p.draw = () => {
		if (started) {
			now = p.millis()
			elapsedTime = now - lastTextgeneratedTime
			let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
			if (elapsedTime < someHeartBeatPeriod) {
				p.fill(tempcol)
				p.noStroke()
				p.rect(0, 0, p.width / 8, altura)
			}
			if (elapsedTime > (someHeartBeatPeriod / 8) * 7) {
				p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 12)
			}
			if (elapsedTime > someHeartBeatPeriod) {
				p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
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
					positionActual = ((Math.floor(Math.random() * p.windowWidth) + 1) + (Math.floor(Math.random() * p.windowHeight) + 1)) / (p.windowWidth + p.windowHeight)
					ayekiluaElement.style.display = "flow-root"
					tempcol = "#" + makeHexString(8)
					ayekiluaElement.style.fill = tempcol
					someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 48) + 6)
				}
				p.text(frase,
					((p.width / 2) - (p.width / 4)),
					((p.height / 2) - (p.height / 3)),
					((p.width / 2) + (p.width / 8)),
					((p.height / 2) + (p.height / 4))
				)
			}
			generateDistortedAyekiluaInDOM(positionActual, ayekiluaPoints3DArray, ayekiluaCommands, ayekiluaElement)
			generateDistortedAyekiluaInDOM( positionActual, pathObj02.data, pathObj02.commands, pathObj02.element)
			generateDistortedAyekiluaInDOM( positionActual, pathObj03.data, pathObj03.commands, pathObj03.element)

            generateDistortedAyekiluaInDOM( positionActual, pathObj04.data, pathObj04.commands, pathObj04.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj05.data, pathObj05.commands, pathObj05.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj06.data, pathObj06.commands, pathObj06.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj07.data, pathObj07.commands, pathObj07.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj08.data, pathObj08.commands, pathObj08.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj09.data, pathObj09.commands, pathObj09.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj10.data, pathObj10.commands, pathObj10.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj11.data, pathObj11.commands, pathObj11.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj12.data, pathObj12.commands, pathObj12.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj13.data, pathObj13.commands, pathObj13.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj14.data, pathObj14.commands, pathObj14.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj15.data, pathObj15.commands, pathObj15.element)
            // generateDistortedAyekiluaInDOM( 1, pathObj16.data, pathObj16.commands, pathObj16.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj17.data, pathObj17.commands, pathObj17.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj18.data, pathObj18.commands, pathObj18.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj19.data, pathObj19.commands, pathObj19.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj20.data, pathObj20.commands, pathObj20.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj21.data, pathObj21.commands, pathObj21.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj22.data, pathObj22.commands, pathObj22.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj23.data, pathObj23.commands, pathObj23.element)
            generateDistortedAyekiluaInDOM( positionActual/2, pathObj24.data, pathObj24.commands, pathObj24.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj25.data, pathObj25.commands, pathObj25.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj26.data, pathObj26.commands, pathObj26.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj27.data, pathObj27.commands, pathObj27.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj28.data, pathObj28.commands, pathObj28.element)
            generateDistortedAyekiluaInDOM( positionActual, pathObj29.data, pathObj29.commands, pathObj29.element)
		}
	}

	p.keyReleased = async () => {
		if (p.key === 'T') {
			html2canvas(document.body)
				.then(function (canvas) {
					const link = document.createElement('a')
					link.download = `${nft}${tempcol.substring(1)}_${positionActual}.png`
					link.href = canvas.toDataURL()
					link.click();
					link.delete;
				})
		}

		if (p.key === 'f') {
			finishMinting()
		}
        if (p.key === 'R') {
            someHeartBeatPeriod = 0
		}
        
		if (p.key === 's') {
			// setStamp()
			let userSelectedToken = prompt(`Which tokenId do you want to buy?`)
			saleNFTItem(forMintPrice,0)
		}
		if (p.key === 'b') {
			getBalance()
			nfts = await loadNFTs()
			console.dir(nfts)
		}
		if (p.key === 'm') {
			mynfts = await loadMyNFTs()
			console.dir(mynfts)
		}
		if (p.key === 'B') {
			console.dir(nfts)
			let userSelectedToken = prompt(`Which tokenId do you want to buy?`)
			buyNft()
			nfts = await loadNFTs()
		}
		if (p.key === 'X') {
			sendCoins('0x8bBd610542c67B355CC0152511ac2b3560F7d13c', 10000000000);
		}
		if (p.key === 'N') {
			p.noLoop()
			let user_name = prompt("Define a Name for this NFT?")
			let user_price = prompt("Set a price for this NFT?")
			while (isNaN(parseFloat(user_price))) {
				user_price = prompt("What is the price you pay for this NFT?")
			}

			forMintName = user_name
			forMintDescription = frase
			forMintColor = tempcol.substring(1)
			forMintPrice = user_price
			forMint_ayekiluaModifiedPathArray = modifyShapeByDistortion(positionActual, ayekiluaPoints3DArray)
			forMint_ayekiluaModifiedPathString = convert3DArrayToDPathString(forMint_ayekiluaModifiedPathArray, ayekiluaCommands)

			createNFTItem(parseFloat(user_price))
		}
		if (p.key === 'k') {
			p.noLoop()
			let user_name = prompt("Define a Name for this NFT?")
			let user_price = prompt("Set a price for this NFT?")
			while (isNaN(parseFloat(user_price))) {
				user_price = prompt("What is the price you pay for this NFT?")
			}

			forMintName = user_name
			forMintDescription = frase
			forMintPrice = user_price
			forMintColor = tempcol.substring(1)
			forMint_ayekiluaModifiedPathArray = modifyShapeByDistortion(positionActual, ayekiluaPoints3DArray)
			forMint_ayekiluaModifiedPathString = convert3DArrayToDPathString(forMint_ayekiluaModifiedPathArray, ayekiluaCommands)
		}
	}

	p.mousePressed = () => {
		started = true
		ayekiluaElement.style.display = "flow-root"
		tempcol = "#" + makeHexString(8)
		pathObj02.element.style.fill = "#" + makeHexString(8)
		pathObj03.element.style.fill = "#" + makeHexString(8)
		ayekiluaElement.style.fill = tempcol
		positionActual = p.random( ((p.mouseY) / (p.height))-.1, ((p.mouseY) / (p.height))+.12)
        // console.log(`DEBUG: positionActual: `,positionActual)
		// modifyAyekilua(positionActual)
		generateDistortedAyekiluaInDOM(positionActual, ayekiluaPoints3DArray, ayekiluaCommands, ayekiluaElement)
		generateDistortedAyekiluaInDOM(positionActual, pathObj02.data, pathObj02.commands, pathObj02.element)
		generateDistortedAyekiluaInDOM(positionActual, pathObj03.data, pathObj03.commands, pathObj03.element)

        generateDistortedAyekiluaInDOM( positionActual, pathObj04.data, pathObj04.commands, pathObj04.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj05.data, pathObj05.commands, pathObj05.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj06.data, pathObj06.commands, pathObj06.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj07.data, pathObj07.commands, pathObj07.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj08.data, pathObj08.commands, pathObj08.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj09.data, pathObj09.commands, pathObj09.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj10.data, pathObj10.commands, pathObj10.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj11.data, pathObj11.commands, pathObj11.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj12.data, pathObj12.commands, pathObj12.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj13.data, pathObj13.commands, pathObj13.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj14.data, pathObj14.commands, pathObj14.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj15.data, pathObj15.commands, pathObj15.element)
        // generateDistortedAyekiluaInDOM( 1, pathObj16.data, pathObj16.commands, pathObj16.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj17.data, pathObj17.commands, pathObj17.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj18.data, pathObj18.commands, pathObj18.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj19.data, pathObj19.commands, pathObj19.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj20.data, pathObj20.commands, pathObj20.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj21.data, pathObj21.commands, pathObj21.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj22.data, pathObj22.commands, pathObj22.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj23.data, pathObj23.commands, pathObj23.element)
        generateDistortedAyekiluaInDOM( positionActual/2, pathObj24.data, pathObj24.commands, pathObj24.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj25.data, pathObj25.commands, pathObj25.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj26.data, pathObj26.commands, pathObj26.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj27.data, pathObj27.commands, pathObj27.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj28.data, pathObj28.commands, pathObj28.element)
        generateDistortedAyekiluaInDOM( positionActual, pathObj29.data, pathObj29.commands, pathObj29.element)
		let currentJWT = window.localStorage.getItem('userJWT')
		let oHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}
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
		socket.emit(`LED`, signedCommands + `;` + currentJWT)
		
	}
}