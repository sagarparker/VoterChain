const express       =   require('express');
const bodyparser    =   require('body-parser');
const app           =   express();
const cors          =   require("cors");
const path          =   require('path');

const twilioVerification    =   require('./api/twilioVerification');
const votingAPI             =   require('./api/votingAPI');


//BODY PARSER PRESET

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.text({ limit: '200mb' }));


// EXPRESS STATIC FILE SERVER

// Media uploaded by the users
app.use('/media',express.static(path.join(__dirname,'/../../../JoynMedia')))

//Assets for sale via in-app store
app.use("/assets",express.static('assets'));




// CORS PRESETS

app.use(cors());

app.use(express.static("docs"));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


// Twilio Verification

app.use('/api',twilioVerification);


//Voting APIs

app.use('/api',votingAPI);



module.exports = app;