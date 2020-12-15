const express = require('express');
const router = express.Router();
// const axios = require('axios');
const eventQueues = require('../../rabbitMQ/eventQueue.json');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const rabbit = require('../../rabbitMQ/rabbitMQ').function;
const otpFunction = require("../functional/OTPFunction");

router.post('/', auth.auth, [
        check('actionType').isLength({ min: 1 }),
        check('payload').isLength({ min: 1 })
    ], async function(req, res){
    try {
        const data = req.body || {};
        let actionType = data.actionType;
        let isEnv = 1;
        if(data.isEnv){ //1: production, 2: dev
            isEnv = data.isEnv;
        } 
        //check action in list action
        let found = Object.keys(eventQueues).filter(function(key) {
            return key === actionType;
        });
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }else{
            if(found.length > 0){
                let dataRes = {};
                let isPush = true;
                let isSuccess = true;
                let OTPTmp = null;
                let mess = 'Message is sending to customer, please wait!!!';
                if(parseInt(isEnv) === 1){
                    if(actionType === 'OTP_SMS'){
                        let phoneNumber = JSON.parse(data.payload).Mobile || null;
                        if(phoneNumber){
                            let objOTP = await otpFunction.generateOTP(phoneNumber);
                            if(Object.keys(objOTP).length === 0){
                                isSuccess = false;
                            }else{
                                OTPTmp = objOTP.otp_value;
                                dataRes = {
                                    OTP: objOTP.otp_value,
                                    key: objOTP.key
                                };
                                mess = "OTP is access app!!!"
                            }
                        }else{
                            isSuccess = false;
                        }
                    }
                }
                if(!isSuccess){
                    res.status(404).json({ error: "Please contact the administrator" });
                }
                res.status(200).json({
                    status: 200,
                    data: dataRes,
                    message: mess
                });
                let payload = JSON.parse(data.payload) || {};
                if(isPush){
                    if(actionType === 'OTP_SMS'){
                        let message = payload.Message;
                        
                    console.log(message, 'message');
                        message = message.replace('#otp_code', OTPTmp);
                        payload = {
                            ...payload,
                            Message: message
                        }
                    }
                    sendQueue(actionType, payload);
                }
            }else{
                res.status(404).json({
                    status: 404,
                    data: {},
                    error: 'Keywords not found'
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

async function sendQueue (actionType, payload){
    switch(actionType){
        case 'sendMail':
            await rabbit.sendMail(payload)
            return;
        case 'OTP_SMS':
            await rabbit.SMSProvider(payload)
            return;
        case 'sendPrice':
            await rabbit.sendPrice(payload)
            return;
        case 'SMSProvider':
            await rabbit.SMSProvider(payload)
            return;
        default:
            return;
    }
}

module.exports = router;