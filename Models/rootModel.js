const {Schema, model} = require('mongoose');

module.exports.Root = model("Root", Schema({
    root: {
        type     : String,
    },
    rootName: {
        type     : String,
    }
}, { timestamps : true }));