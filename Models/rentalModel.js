const {Schema, model} = require('mongoose');

module.exports.Rental = model("Rental", Schema({
    rewardId: {
        type     : Number
    },
    currentPay: {
        type     : Number,
        default  : 0
    },
    rewardAmount: {
        type     : Number,
        default  : 0
    },
    totalReward: {
        type     : Number,
        default  : 0
    }

}, { timestamps : true }));