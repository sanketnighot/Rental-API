const _ = require('lodash') 
const axios = require('axios');
require('dotenv').config();
const {Rental} = require('../Models/rentalModel');
const {RentalClaim} = require('../Models/rentalClaimModel');
const {RentalHistory} = require('../Models/rentalHistory');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
var Web3 = require('web3');
const {rental_abi} = require('./abi');

const rentalContractAddress = "0xca63b89db5a634ad465927ff63e0fd1495928e23"
const URL = "https://eth-mainnet.g.alchemy.com/v2/4Yu3Crvr9V7owxJ-msc99y94RTQjKEB-";
const web3Pro = new Web3(new Web3.providers.HttpProvider(URL));
const { ethers } = require("ethers");

const RentalContract = new web3Pro.eth.Contract(rental_abi, rentalContractAddress);

module.exports.updateMainRewards = async (req, res) => {
    let init = 1
    let final = 66
    let count = 0
    for (let i = init; i <= final; i++) {
        const getRewardInfo = await RentalContract.methods.getLandLordsInfo(i).call()
        // .catch(err => {console.log(err)})
        if (getRewardInfo.status) {
            const getReward = await RentalContract.methods.getcalculateRewards(i).call()
            // .catch(err => {console.log(err)})
            console.log(i, ": ", getReward[0])
            const data = {
                rewardId: i,
                rewardAmount: getReward[0]/1000000000000000000
            }
            const rentalHis = new Rental(data)
            const result = await rentalHis.save()
            count += 1
        }
    }
    console.log("Count: ", count)
    return res.status(200).send("Done Update");    
}
 
module.exports.updateRewards = async (req, res) => {
    let init = Number(req.body.init)
    let final = init + 50
    const currentRewardId = Number(req.body.rewardId)
    if (final > currentRewardId) {
        final = currentRewardId;
    }
    for (let i = init; i <= final; i++) {
        const getRental = await Rental.find({rewardId: i}).catch((err) => {
            console.log(err)
            return res.status(400).send({Error: err})
        });
        const getReward = await RentalContract.methods._rewardForPool(i).call()
        if (getRental.length === 0) {
            const rentalData = {
                rewardId: i,
                rewardAmount: getReward/1000000000000000000,
                totalReward: getReward/1000000000000000000,
                currentPay: getReward/1000000000000000000
            }
            const rental = new Rental(rentalData);
            const result = await rental.save()
        } else {
            const updateRental = await Rental.findOneAndUpdate({rewardId: i}, {rewardAmount: getRental[0].rewardAmount + getReward/10**18, totalReward: getRental[0].totalReward + getReward/10**18, currentPay: getReward/10**18})
        }
    }
    return res.status(200).send("Done Update");
}

module.exports.claimRewards = async (req, res) => {
    const getRentalClaim = await RentalClaim.findOne({rewardId: req.body.rewardId}).catch((err) => {return res.status(400).send({Error: err})})
    const getRentalRwd = await Rental.findOne({rewardId: req.body.rewardId}).catch((err) => {return res.status(400).send({Error: err})})
    const getRental = await Rental.findOneAndUpdate({rewardId: req.body.rewardId}, {rewardAmount: getRentalRwd.rewardAmount - getRentalClaim.rewardAmount}).catch((err) => {return res.status(400).send({Error: err})})
    const getRentals = await RentalClaim.findOneAndUpdate({rewardId: req.body.rewardId}, {claimed: true}).catch((err) => {return res.status(400).send({Error: err})})
    return res.status(200).send({message: "Field Updated"});
}

module.exports.getRewards = async (req, res) => {
    const getRental = await RentalClaim.findOne({rewardId: req.query.rewardId}).then(async (data) => {
        return res.status(200).send(data);
    }).catch((err) => {return res.status(400).send({Error: err})})
} 

module.exports.getTotalRewards = async (req, res) => {
    const getRental = await Rental.findOne({rewardId: req.query.rewardId}).then(async (data) => {
        return res.status(200).send(data);
    }).catch((err) => {return res.status(400).send({Error: err})})
} 

module.exports.updateMerkleRoot = async (req, res) => {
    const deleteEntries = await RentalClaim.deleteMany({}).catch((err) => {return res.status(400).send({Error: err})})
    const getRental = await Rental.find().catch((err) => {return res.status(400).send({Error: err})})

    let data = []
    for (i in getRental) {
        const rentalData = _.pick(getRental[i],["rewardId", "rewardAmount", "totalReward"]);
        rentalData.claimed = false
        const rental = new RentalClaim(rentalData);
        const result = await rental.save().catch((err) => {return res.status(400).send({Error: err})})
        data.push(`${getRental[i].rewardId},${getRental[i].rewardAmount * 1000000000000000000}`)
    }
    console.log(data)
    let leaves = data.map(addr => keccak256(addr))
    let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
    const rootHash = merkleTree.getHexRoot()
    console.log(rootHash);
    return res.status(200).send(rootHash);
}

module.exports.getMerkleProof = async (req, res) => {
    const getRental = await RentalClaim.find().catch((err) => {return res.status(400).send({Error: err})})
    let data = []
    let getData = 0
    for (i in getRental) {
        data.push(`${getRental[i].rewardId},${(getRental[i].rewardAmount * 1000000000000000000)}`)
        console.log(data)
    }
    let leaves = await data.map(addr => keccak256(addr))
    let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
    const rootHash = merkleTree.getHexRoot()
    console.log(rootHash);

    const getProofData = await RentalClaim.findOne({rewardId: req.body.rewardId}).then(async (data) => {
        getData = `${data.rewardId},${data.rewardAmount * 1000000000000000000}`
    }).catch((err) => {return res.status(400).send({Error: err})})
    console.log(getData)
    let prove = getData // The input
    let hashedAddress = keccak256(prove)
    let proof = merkleTree.getHexProof(hashedAddress)
    console.log(proof);
    return res.status(200).send(proof);
}