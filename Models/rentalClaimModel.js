const {Schema, model} = require('mongoose');

module.exports.RentalClaim = model("RentalClaim", Schema({
    rewardId: {
        type     : Number
    },
    claimed: {
        type     : Boolean
    },
    rewardAmount: {
        type     : String,
        default  : 0
    },
    totalReward: {
        type     : Number,
        default  : 0
    }
}, { timestamps : true }));