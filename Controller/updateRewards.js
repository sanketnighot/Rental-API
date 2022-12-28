require('dotenv').config();
const axios = require('axios');

const updateRewards = async () => {
    console.log(Number(process.argv[2]));
    await axios.post('http://localhost:8000/api/updateRewards', {init: Number(process.argv[2])}).then((data) => {
        console.log(data);
    }).catch((err) => {console.log(err)})

}
updateRewards()