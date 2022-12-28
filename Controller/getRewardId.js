const axios = require('axios');
require('dotenv').config();
var Web3 = require('web3');
const {rental_abi} = require('./abi');

const rentalContractAddress = "0x8a01c21d7930af53D349717b198AF9238f0020E5"
const URL = "https://goerli.infura.io/v3/bf258c084e594e6ab866988363c31bf1";
const web3Pro = new Web3(new Web3.providers.HttpProvider(URL));

const RentalContract = new web3Pro.eth.Contract(rental_abi, rentalContractAddress);

const getRewardId = async () => {
    const currentRewardId = await RentalContract.methods.getCurrentRewrdId().call().catch((err) => {return res.status(400).send({Error: err})});
    console.log(10);
}

getRewardId()