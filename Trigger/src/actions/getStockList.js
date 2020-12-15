const axios = require('axios');
const CronJob = require('cron').CronJob;
const BASE_URL = 'https://tradex-vn.s3.ap-southeast-1.amazonaws.com/market_data/market_data_gzip.json';

function run() {
    const cronjob = new CronJob('00 48 10 * * 1-5', function() {
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
        if(res){
            stockList = res;
        }
        global.stockList = stockList;
    } catch (error) {
        console.log("callApiStockList ", error);
    }
}

module.exports = {run}
