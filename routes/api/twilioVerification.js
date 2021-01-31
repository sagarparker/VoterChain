const express = require('express')
const router  = express.Router();
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


//Sending OTP via twilio to users phone no

router.post('/sendOTP',
    body('phone_no').not().isEmpty(),
    async (req,res)=>{
        try{

            // Input field validation

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                error: errors.array()[0],
                });
            }

            //Generating an service id
            const service       =   await client.verify.services.create({friendlyName: 'VoterChain'})
            const serviceID     =   service.sid;
            const userPhoneNo   =   req.body.phone_no;


            //Sending OTP
            const verification = await client.verify.services(serviceID)
                .verifications.create({to: userPhoneNo, channel: 'sms'})
            if(verification){
                res.status(200).json({
                    result      :   true,
                    serviceID   :   serviceID,
                    msg         :   "OTP sent to the user"
                })
            }
            else{
                res.status(400).json({
                    result:false,
                    msg:"There was a problem sending an otp to the user."
                })
            }
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                result:false,
                msg:"Failed to send an otp to the user"
            })
        }
});


//Verifying OTP submited by the user.

router.post('/verifyOTP',
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
                    msg         :   "OTP verified"
                })
            }
            else{
                res.status(400).json({
                    result  :   false,
                    msg     :   "OTP is not valid."
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