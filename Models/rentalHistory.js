const {Schema, model} = require('mongoose');

module.exports.RentalHistory = model("RentalHistory", Schema({
    rewardId: {
        type     : Number
    },
    rewardAmount: {
        type     : Number,
    },
}, { timestamps : true }));