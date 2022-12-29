const {Schema, model} = require('mongoose');

module.exports.RentalClaim = model("RentalClaim", Schema({
    rewardId: {
        type     : Number
    },
    claimed: {
        type     : Boolean
    },
    rewardAmount: {
        type     : Number,
    },
    totalReward: {
        type     : Number,
    }
}, { timestamps : true }));