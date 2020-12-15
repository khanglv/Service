const api = require('../apiConfigs/api');
const process = require('dotenv').config();
const PROXY_SERVER_URL = process.parsed.PROXY_SERVER_URL;
const API_KEY_SMS_URL = process.parsed.API_KEY_SMS_URL;
// const PROXY_SERVER_URL = process.parsed.PROXY_SERVER_URL;

// let httpsProxyAgent = require("https-proxy-agent");
// const agent = new httpsProxyAgent (PROXY_SERVER_URL);

async function checkConnectionSMS(){
    const res = await api({
        url: `${PROXY_SERVER_URL}/api/sms`,
        headers: {
            API_KEY: API_KEY_SMS_URL
        },
        method: "GET"
    });
}

async function sendSMSProvider(data){
    const res = await api({
        url: `${PROXY_SERVER_URL}/api/sms/add`,
        method: "POST",
        headers: {
            API_KEY: API_KEY_SMS_URL
        },
        data: data
    });
}

module.exports = {
    checkConnectionSMS,
    sendSMSProvider
}