const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const process = require('dotenv').config();
const ONE_SIGNAL_URL = process.parsed.ONE_SIGNAL_URL;

async function getApi() {
    try {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        })
        const res = await axios({
            method: 'post',
            url: `${ONE_SIGNAL_URL}/api/v1/notifications`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Basic MTRjZDg4ZWMtYTY3YS00MjZhLTg0ZGYtMGU0MmJkMzgwYjhh"
            },
            data: JSON.stringify({
                app_id: "d5418589-a908-4ae6-b92c-ac6500c86625", 
                included_segments: ["All"],
                contents: {en: "You are accessing unauthorized! Get out a here"},
                chrome_web_icon: "https://image.flaticon.com/icons/png/512/2331/2331966.png",
                // buttons: [],
                // web_buttons: []
            }),
            httpsAgent: httpsAgent
        });
        
        if(res.status === 200){
            return res.data;
        }
        return false;
    } catch (error) {
        console.log("error ", error);
    }
}

router.post('/', async function(req, res) {
    try {
        const data = await getApi();
        res.status(200).json({
            status: 200,
            data: data,
            message: 'Push notify success!!!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;