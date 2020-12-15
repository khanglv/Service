const axios = require('axios');
const CronJob = require('cron').CronJob;
const process = require('dotenv').config();
const BASE_URL_CORE = process.parsed.INVEST_API_CORE_URL;
const TIME_CRONJOB_INIT = process.parsed.TIME_CRONJOB_INIT;

function run() {
    if(!global.marketVN30 || !global.marketVN || !global.marketHNX30 || !global.marketHNX){
        getRequestMarket();
    }
    const cronjob = new CronJob(TIME_CRONJOB_INIT, function() {
            getRequestMarket();
        }, function () {
            /* This function is executed when the job stops */
        },
        true, /* Start the job right now */
        'Asia/Ho_Chi_Minh' /* Time zone of this job. */
    );
}

async function getRequestMarket() {
    try {
        let arrMarkets = ['VN30', 'HNX30', 'VN', 'HNX'];
        for(const property in arrMarkets){
            let arrData = await callApiMarkets(arrMarkets[property]);
            if(arrData.data){
                switch(arrMarkets[property]){
                    case 'VN30':
                        global.marketVN30 = arrData.data.stockList;
                        return;
                    case 'HNX30':
                        global.marketHNX30 = arrData.data.stockList;
                        return;
                    case 'VN':
                        global.marketVN = arrData.data.stockList;
                        return;
                    case 'HNX':
                        global.marketHNX = arrData.data.stockList;
                        return;
                    default:
                        return;
                }
                
            }
        }
    } catch (error) {
        
    }
}

async function callApiMarkets(market) {
    try {
        const res = await axios({
            method: 'get',
            url: `${BASE_URL_CORE}/market/indexStockList/${market}`,
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if(res){
            marketList = res;
        }
        return marketList;
    } catch (error) {
        console.log("callApiMarketList ", error);
    }
}

module.exports = {run}
