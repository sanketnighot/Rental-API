const _ = require('lodash') 
const axios = require('axios');
require('dotenv').config();
const {Rental} = require('../Models/rentalModel');
const {RentalClaim} = require('../Models/rentalClaimModel');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
var Web3 = require('web3');
const {rental_abi} = require('./abi');

const rentalContractAddress = "0x8a01c21d7930af53D349717b198AF9238f0020E5"
const URL = "https://goerli.infura.io/v3/bf258c084e594e6ab866988363c31bf1";
const web3Pro = new Web3(new Web3.providers.HttpProvider(URL));

const RentalContract = new web3Pro.eth.Contract(rental_abi, rentalContractAddress);

const updateRewards = async () => {
    const currentRewardId = await RentalContract.methods.getCurrentRewrdId().call()
    if (currentRewardId > 0) {
        console.log(process.argv)
        for (let i = 1; i <= parseInt(currentRewardId); i++) {
            const getRental = await Rental.find({rewardId: i}).catch((err) => {return res.status(400).send({Error: err})})
            const getReward = await RentalContract.methods._rewardForPool(i).call()
            if (getRental.length === 0) {
                const rentalData = {
                    rewardId: i,
                    rewardAmount: getReward/10**18,
                    totalReward: getReward/10**18
                }
                const rental = new Rental(rentalData);
                const result = await rental.save()
            } else {
                const updateRental = await Rental.findOneAndUpdate({rewardId: i}, {rewardAmount: getRental[0].rewardAmount + getReward/10**18, totalReward: getRental[0].totalReward + getReward/10**18})
            }
        }        
    }
}


updateRewards()