const express = require('express');
const router = express.Router();
const axios = require('axios');

function getUser(userId){
    //function gọi lên api từ Tý lấy ra thông tin user
    return {
        name: 'Lê Viết Khang',
        accountNumber: '068C12345',
        token: 'daylataikhoankopass',
        role: 'admin'
    };
}

router.get('/', function(req, res){
    try {
        let userId = req.query.userId;
        //actionType: sendMail, SMS, OTP ...
        let actionType = req.query.actionType;
        const userInfo = getUser(userId);
        res.status(200).json({
            status: 200,
            data: {
                userInfo: userInfo,
                actionType: actionType,
                status: 'isOnline'
            },
            message: 'OK'
        });
    } catch (error) {
        
    }
})


module.exports = router;