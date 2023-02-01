const {Schema, model} = require('mongoose');

module.exports.Map = model("Map", Schema({
    tokenId: {
        type     : Number
    },
    x: {
        type     : Number,
        required : true,
    },
    y: {
        type     : Number,
        required : true,
    },
    size: {
        type     : Number,
        required : true,
        default  : 1
    },
    owner: {
        type     : String,
        default  : "None",
        required : true
    },
    price: {
        type     : String,
        default  : 0,
        required : true
    },
    landType: {
        type     : String,
        default  : "LAND",
        required : true
    },
    saleType: {
        type     : String,
        default  : "Main Sale"
    },
    transfers: {
        type     : Array, // {from, to, timestamp}
        default  : [],
        required : true
    },
    image : {
        type     : String,
        required : true,
        default  : ""
    },
    linkedTiles : {
        type     : Array,
        required : true,
        default  : []
    },
    name : {
        type     : String,
        required : true,
        default  : "LAND"
    },
    status : {
        type     : Object
    },
    metadata : {
        type     : String,
        default  : "NONE"
    },


}, { timestamps : true }));