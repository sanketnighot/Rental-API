var Web3 = require("web3");
var fs = require('fs');
const path = require('path');
var cronJob = require('cron').CronJob;
const config = require('./config.json');
const bridgeAbi = require('./swapabi.json');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const crossSwapContractAddress = "";         //usdt token 

const URL = "https://rpc-mumbai.matic.today";
const web3BSC = new Web3(new Web3.providers.HttpProvider(URL));

const SWAP_INSTANCE = new web3BSC.eth.Contract(bridgeAbi,crossSwapContractAddress);
 
var cronJ1 = new cronJob("*/1 * * * *", async function () {
    checkPending()
}, undefined, true, "GMT");

async function checkPending() {
    fs.readFile(path.resolve(__dirname, 'bscBlock.json'), async (err, blockData) => {
        if (err) {
            console.log(err);
            return;
        }

        blockData = JSON.parse(blockData);
        let lastcheckBlock = blockData["lastblock"];
        const latest = await web3BSC.eth.getBlockNumber();
        console.log(lastcheckBlock,latest)
        blockData["lastblock"] = latest;
         
        SWAP_INSTANCE.getPastEvents({},
        {
            fromBlock: lastcheckBlock,
            toBlock: latest // You can also specify 'latest'          
        })
        .then(async function (resp) {
            for (let i = 0; i < resp.length; i++) {
                if (resp[i].event === "Transfer") {
                    console.log("TokenTransfer emitted");
                    let isAlreadyProcessed = false;
                    if(resp[i].returnValues.nonce) {
                        isAlreadyProcessed = await CROSS_SWAP_INSTANCE.methods.nonceProcessed(resp[i].returnValues.nonce).call();
                    }
                    console.log(resp[i].returnValues);
                    !isAlreadyProcessed && SwapRequest();
                }
            }
            fs.writeFile(path.resolve(__dirname, './bscBlock.json'), JSON.stringify(blockData), (err) => {
                if (err);
                console.log(err);
            });
        })
        .catch((err) => console.error(err));
    });
}

async function SwapRequest(to,amount){
   
    
}

cronJ1.start();
