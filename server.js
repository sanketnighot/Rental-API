require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');
var cron = require('node-cron');
const { updateRewards } = require('./Controller/rentalController');


mongoose.connect(process.env.MONGODB_URL_CLOUD, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=> {
        console.log('Connected to LOL MongoDb Server ...')
    }).catch((err) =>{
        console.log(`MongoDb Connection Failed: ${err}`);
    });


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT} ...`);
});

// cron.schedule('*/5 * * * * *', () => {
//     console.log("Job Executed", "⌛️" ,new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
//   });