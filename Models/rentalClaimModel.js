const {Schema, model} = require('mongoose');

module.exports.RentalClaim = model("RentalClaim", Schema({
    rewardId: {
        type     : Number
    },
    rewardAmount: {
        type     : Number,
    }
}, { timestamps : true }));