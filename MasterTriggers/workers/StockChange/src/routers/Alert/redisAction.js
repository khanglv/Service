const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../../authenticate/auth');

const redisFunc = require('../../redisHandle/setRedis');
const func = require('../../listenStockExchanges/functional');

router.post('/', auth.auth, function(req, res) {
    redisFunc.setIdUser();
    res.status(200).json({
        status: 200,
        errorCode: 0,
    });
})

router.get('/', auth.auth, async function(req, res) {
    let msndt = req.query.msndt || null;
    let data = null;
    if(msndt){
        data = await redisFunc.getUserID(msndt);
    }else{
        data = await redisFunc.getAllUserID();
    }
    res.status(200).json({
        status: 200,
        errorCode: 0,
        data: JSON.parse(data) || null
    });
})

router.put('/setAllCurrentUser', auth.auth, [
    check("isConfirm", "Invalid data").isBoolean(),
], async function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }else{
        await redisFunc.removeAllUersID();
        const responseConfigs = await func.getAllConfigsAlert();
        let lstUsersId = [];
        if(responseConfigs.length > 0){
            lstUsersId = responseConfigs.map((item)=>{
                return item.msndt
            });
        }
        if(responseConfigs && lstUsersId){
            // await redisFunc.setAllUserID(lstUsersId);
            for(let i = 0; i < responseConfigs.length; i++){
                await redisFunc.setUserID(responseConfigs[i])
            }
        }

        res.status(200).json({
            status: 200,
            data: {
                arrMsndt: lstUsersId,
                arrConfigs: responseConfigs
            }
        })
    }
})

module.exports = router;
