const express = require('express');
const router = express.Router();
const axios = require('axios');
const process = require('dotenv').config();
const secretKey = process.parsed.SECRET_KEY;
const BASE_URL = 'http://localhost:7000/action-push'

async function getApi() {
    try {
        const res = await axios({
            method: 'post',
            url: BASE_URL,
            headers: {
                API_KEY: secretKey,
                // "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                actionType: "sendMail",
                payload: JSON.stringify({"Mobile": "0964666982","Message": "Ban da trung giai jakpot tri gia len toi 2 ty VND"})
            }
        });
        return res;
    } catch (error) {
        
    }
}

router.get('/', async(req, res)=>{
    try {
        const data = await getApi();
        if(data.status === 200){
            res.status(200).json({
                status: 200,
                // data: {
                //     payload: payload,
                //     actionType: actionType
                // },
                message: 'Test mail is success!!!'
            });
        }
    } catch (error) {
        
    }
})

module.exports = router;