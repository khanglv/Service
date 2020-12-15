const process = require('dotenv').config();
const BASE__URL = process.parsed.BASE_SERVER_STOCK_LIST_URL;
const channelEvent = require("./channelSubscribe.json");
const rabbit = require('../../rabbitMQ/rabbitMQ').function;
// const eventQueues = require('../../../rabbitMQ/eventQueue.json');
const rs = require('redis');
const redis = rs.createClient(6379, BASE__URL);
const common = require('../common/common');
const func = require('./functional');

//------------------------------------ demo get stock ------------------------------------------
// redis.on('message', (channel, message) => {
//     console.log(channel, message, "test");
// });
// redis.subscribe('FPT');

//------------------------------------------------------------------------------

function handleStockList() { //get all stock in market
    let arrGlobal = global.stockList;
    let arrStockList = [];
    if (arrGlobal) {
        arrStockList = arrGlobal.filter(item => item.t === 'STOCK').map(item => {
            return item.s
        })
    }
    
    for (const index in arrStockList) {
        redis.subscribe(arrStockList[index]);
    }
    return arrStockList;
}

async function runInit() {
    try {
        await handleStockList();
        redis.on('message', async(channel, message) => {
            try {
                // let data = {
                //     "s":"GAS","c":57000,"o":50000,"h":51900,"l":50000,"cl":57000,"fl":42200,"v":55706,"t":"075357","_t":"14537","m":"HOSE"
                // };
                let data = JSON.parse(message) || {};

                /* *********************************************** */
                if(data){
                    // let marketCheck = checkMarket(data.s);
                    // rabbit.alert_pushNotify({
                    //     ...data,
                    //     channelSubscribe: channelEvent.ceilingCrossChannel,
                    //     market: marketCheck
                    // });
                }
                func.__checkConfigsUser(data);
            } catch (error) {
                
            }
        });
    } catch (error) {
        console.log("redis not available ", error);
    }
}

module.exports = {
    runInit: runInit
};