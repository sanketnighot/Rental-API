const {Schema, model} = require('mongoose');

module.exports.Rental = model("Rental", Schema({
    rewardId: {
        type     : Number
    },
    rewardAmount: {
        type     : Number,
    },
    totalReward: {
        type     : Number,
    }

}, { timestamps : true }));