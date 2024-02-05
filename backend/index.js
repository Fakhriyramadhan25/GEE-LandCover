const express = require('express');
const bodyparser = require ('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const ee = require('@google/earthengine');
const GEE = require('./controllers/GetGEE.js');
const privateKey = require('./key/privateKey.json');


dotenv.config();

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(cors());

app.get('/',(req,res)=>{
    res.json({'mssg':'Hi there'})
})

app.listen(process.env.PORT,()=>{
    console.log("Working right at port "+process.env.PORT);
})

ee.data.authenticateViaPrivateKey(privateKey, ()=>{
    ee.initialize( null, null,
        () => {
          console.log('GEE is successfully initialized');
        },
        (err) => {
          console.log(err);
          console.log(
              `There is a problem with Oauth 2, kindly check the guidance again.`);
        });
})


app.use('/getGEE', GEE);
