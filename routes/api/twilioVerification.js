const express = require('express')
const router  = express.Router();
const { body, validationResult } = require("express-validator");
const { votersData } = require('./voterDetails')
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


//Sending OTP via twilio to users phone no

router.post('/sendOtpForlogin',
    body('voter_id').not().isEmpty(),
    async (req,res)=>{
        try{
            // Input field validation

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                error: errors.array()[0],
                });
            }


            //Checkin if the voter_id is valid

            const voter_id = req.body.voter_id;
            
            if(!votersData.hasOwnProperty(voter_id)){
                return res.status(404).json({
                    result      :   false,
                    msg         :   "Voter ID is invalid"
                })
            }

            //Generating an service id
            const service       =   await client.verify.services.create({friendlyName: 'VoterChain'})
            const serviceID     =   service.sid;
            const userPhoneNo   =   votersData[voter_id];


            //Sending OTP
            const verification = await client.verify.services(serviceID)
                .verifications.create({to: userPhoneNo, channel: 'sms'})
            if(verification){
                res.status(200).json({
                    result      :   true,
                    serviceID   :   serviceID,
                    phone_no    :   votersData[voter_id],
                    msg         :   "OTP sent to your registered phone no."
                })
            }
            else{
                res.status(400).json({
                    result:false,
                    msg:"There was a problem sending an otp."
                })
            }
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                result:false,
                msg:"Failed to send an otp."
            })
        }
});


//Verifying OTP submited by the user.

router.post('/verifyOtpForLogin',
    body('phone_no').not().isEmpty(),
    body('otp').not().isEmpty(),    
    body('serviceID').not().isEmpty(),
    async (req,res)=>{
        try{

            // Input field validation

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                error: errors.array()[0],
                });
            }

            const userPhoneNo   =   req.body.phone_no;
            const userOTP       =   req.body.otp;
            const serviceID     =   req.body.serviceID;

            //Verifying OTP send by the user
            const verification = await client.verify.services(serviceID)
                        .verificationChecks.create({to: userPhoneNo, code: userOTP})

            if(verification.status == 'approved' && verification.valid == true){
                res.status(200).json({
                    result      :   true,
                    msg         :   "OTP verified",
                    otpVerified :   true    
                })
            }
            else{
                res.status(400).json({
                    result      :   false,
                    msg         :   "OTP is not valid.",
                    otpVerified :   false
                })
            }
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                result:false,
                msg:"Failed to verify voters OTP"
            })
        }
});


module.exports = router;