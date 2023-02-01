const _ = require('lodash') 
const axios = require('axios');
require('dotenv').config();
const Tiles = require('../Tiles.json');
const {Map} = require('../Models/mapModel');
const Address = require('./Address.json');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

module.exports.getMapMerkleProof = async (req, res) => {
    checkAddress = req.body
    final_data = `${checkAddress.x},${checkAddress.y},${checkAddress.price},${checkAddress.category},${checkAddress.url}`;
    console.log(final_data);
    let leaves = Address.map(addr => keccak256(addr))
    let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
    const rootHash = merkleTree.getHexRoot()
    console.log(rootHash)
    let prove = final_data // The input
    let hashedAddress = keccak256(prove)
    let proof = merkleTree.getHexProof(hashedAddress)
    if (Address.includes(final_data)) {
        res.send(proof);
    } else {
        res.send("Invalid Address")
    }
    
}

module.exports.addTile = async (req, res) => {
    const getMap = await Map.find({x: req.body.x, y: req.body.y});
	if (getMap.length === 0) {
		const mapData = _.pick(req.body,["x", "y", "owner", "size", "price", "landType", "transfers", "image", "linkedTiles", "status", "metadata"]);
		const map = new Map(mapData);
		const result = await map.save().then((data) => {
			return res.status(200).send({data: data, message: "Field Added to Map"});
		}).catch((err) => {res.status(400).send({Error: err})})
	} else { 
		return res.status(400).send({message: "Error", data: "Field Already Exists"})
	}
}

module.exports.getMap = async (req, res) => {
    const mapCopy = await Map.find({}).then((map) => {
        return res.status(200).send(map);
    }).catch((err) => {res.status(400).send({Error: err})
});
}

module.exports.getTile = async (req, res) => {
    console.log({x: req.query.x, y: req.query.y})
    const tileCopy = await Map.findOne({x: parseInt(req.query.x), y: parseInt(req.query.y)});
    if (tileCopy) {
        return res.status(200).send(tileCopy);
    } else {
        return res.status(404).send({message: 'Tile not found'})
    }
}

module.exports.updateTile = async (req, res) => {
    const tile = await Map.findOneAndUpdate({x: req.body.x, y: req.body.y}, req.body.update).catch((err) => {
        return res.status(404).send({message: "Error", Error: err})
    });
    const getTileData = await Map.findOne({x: req.body.x, y: req.body.y});
    return res.status(200).send({data: getTileData})
}

module.exports.addTransfer = async (req, res) => {
    const tile = await Map.findOne({x: req.body.x, y: req.body.y}).catch((err) => {
        return res.status(404).send({message: "Error", Error: err})
    }); 
    const transfers = tile.transfers;
    transfers.push(req.body.transfers); 
    const getTileData = await Map.findOneAndUpdate({x: tile.x, y: tile.y}, {transfers: transfers, owner: req.body.transfers.to, price: req.body.price}).catch((err) => {
        return res.status(404).send({message: "Error", Error: err})
    })
    const tileUpdate = await Map.findOne({x: req.body.x, y: req.body.y}).catch((err) => {
        return res.status(404).send({message: "Error", Error: err})
    });
    return res.status(200).send({message: "Success", data: tileUpdate})
}


module.exports.addAllTiles = (req, res) => {
    var result = Tiles.map( async (tile) => {
        const getTile = await Map.find({x: tile.x, y: tile.y});
        if (getTile.length === 0) {
            const map = new Map(tile);
            const results = await map.save().then((data) => {
                return console.log(tile.x, tile.y);
            }).catch((err) => {return console.log({Error: err})})
        } else {
            return console.log("Duplicate:", tile.x, tile.y)
        }
		
    });
    return res.send("Done");
}


module.exports.getTileById = async (req, res) => {
    const tileData = await Map.findOne({_id: req.query.id}).then((data) => {
        return res.send(data)
    }).catch((err) => {
            res.status(400).send("error")
            return console.log(err)});
}


module.exports.addIPFS = async (req, res) => {
    const IPFS = require('ipfs-mini');
    const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    let info = req.body;
    console.log("info: ", info);
    await ipfs.addJSON(info).then(async (cidData) => {
        console.log("cid: ", cidData);
        const tileData = await Map.findOneAndUpdate({name: info.name}, {metadata: `https://ipfs.io/ipfs/${cidData}`, status: "MINTED"})
        return res.send(cidData)
    }).catch(console.log);

}

 
module.exports.rename = async (req, res) => {
    const getMap = await Map.find({});
    console.log(getMap.length);
    await getMap.map( async (tile, index) => {
        const tileData = await Map.findOne({x: tile.x, y: tile.y});
        if  (tileData.landType === `PREMIUM_LAND`) {
            const updateTile = await Map.findOneAndUpdate({x: tileData.x, y: tileData.y}, {landType: `PREMIUM LAND`});
        };
        console.log(index);
    })
    console.log("DONE");
    res.send("DONE");
}

module.exports.getStatus = async (req, res) => {
    const currentStatus = await Map.find({x: req.query.x, y: req.query.y}).then((nowStatus)=> {
        const currStatus = nowStatus.status
        console.log(currStatus);
        res.status(200).send({status: currStatus});
    }).catch( (err) => {
        res.status(404).send({message: "Error", error: err});
    });
}

module.exports.setStatus = async (req, res) => {
    const tile = req.body.data;
    const updateStatus = await Map.findOneAndUpdate({x: tile.x, y: tile.y}, {status: req.body.status}).then(() => {
        res.status(200).send("Done");
    }).catch((err) => {
        res.status(400).send({message: "Error", error: err});
    })
}