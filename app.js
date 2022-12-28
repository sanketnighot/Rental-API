const express = require('express');
const app = express();
var cors = require('cors');
const rentalRouter = require('./Routers/rentalRouter');
var bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); 
app.use('/api', rentalRouter);
app.get("/", (req, res) => { res.send("Welcome to LOL Rental API ... ('This is a root Path')") })
module.exports = app