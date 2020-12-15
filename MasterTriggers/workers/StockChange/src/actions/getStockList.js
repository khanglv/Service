const axios = require('axios');
const CronJob = require('cron').CronJob;
const BASE_URL = 'https://tradex-vn.s3.ap-southeast-1.amazonaws.com/market_data/market_data_gzip.json';
const process = require('dotenv').config();
const TIME_CRONJOB_INIT = process.parsed.TIME_CRONJOB_INIT;

function run() {
    if(!global.stockList){
        callApiStockList();
    }
    const cronjob = new CronJob(TIME_CRONJOB_INIT, function() {
            callApiStockList();
        }, function () {
        /* This function is executed when the job stops */
        },
        true, /* Start the job right now */
        'Asia/Ho_Chi_Minh' /* Time zone of this job. */
    );
}
async function callApiStockList() {
    try {
        let stockList = [];
        const res = await axios({
            method: 'get',
            url: BASE_URL,
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if(res.data){
            stockList = res.data;
        }
        global.stockList = stockList;
    } catch (error) {
        console.log("callApiStockList ", error);
    }
}

module.exports = {run}
