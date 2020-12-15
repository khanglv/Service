const process = require('dotenv').config();
const BASE__URL = process.parsed.BASE_SERVER_STOCK_LIST_URL;
const rabbit = require('../../rabbitMQ/rabbitMQ').function;
// const eventQueues = require('../../../rabbitMQ/eventQueue.json');
const rs = require('redis');
const redis = rs.createClient(6379, BASE__URL);
const common = require('../common/common');

const TIME_START = new Date().setHours(08,55,0,0)
const TIME_END = new Date().setHours(18,50,0,0)

//------------------------------------ demo get stock ------------------------------------------
// redis.on('message', (channel, message) => {
//     console.log(channel, message, "test");
// });
// redis.subscribe('FPT');

//------------------------------------------------------------------------------


function runInit(obj) {
    let interval = setInterval(()=> runStockUpdate(obj), 10000);

    function runStockUpdate(obj) {
        try {
            let startTimeSet = new Date(Date.now() - 10000);;
            let startTime = common.dateString(startTimeSet);
            let endTime = common.dateString(new Date().toISOString());
            let timeNow = new Date().getTime();
            if(TIME_START > timeNow || timeNow > TIME_END){
                clearInterval(interval);
            }else{
                if(obj){
                    startTime = obj.startTime || 1;
                    endTime = obj.endTime || 999999;
                }
                redis.ZRANGEBYSCORE('board', startTime, endTime, 'WITHSCORES', (error, result) => {
                    if(error) throw error ;
                    try {
                        console.log(JSON.parse(result));
                        
                        let resultT = [{
                                "s":"MLS","c":51900,"o":50000,"h":51900,"l":50000,"cl":57000,"fl":42200,"v":55706,"t":"075357","_t":"14537","m":"HOSE"
                            },
                            {
                                "s":"MLS","c":51900,"o":50000,"h":51900,"l":50000,"cl":57000,"fl":42200,"v":55706,"t":"075357","_t":"14537","m":"HOSE"
                            },
                            {
                                "s":"VCI","c":28000,"o":23000,"h":51900,"l":50000,"cl":57000,"fl":28000,"v":55706,"t":"075357","_t":"14537","m":"HOSE"
                            },
                            {
                                "s":"MWG","c":110000,"o":50000,"h":51900,"l":50000,"cl":110000,"fl":100000,"v":55706,"t":"075357","_t":"14537","m":"HOSE"
                            }
                        ]
                        if(resultT && resultT.length > 0){
                            for(let i = 0; i < resultT.length; i++){
                                let value = resultT[i];
                                if(value.c === value.cl){
                                    let payload = value;
                                    console.log(rabbit);
                                    rabbit.alert_pushNotify(payload);
                                    console.log("payload", payload);
                                }
                            }
                        }
                    } catch (error) {
                        console.log(error, ' errorfasflkfnl');
                    }
                });
            }
        } catch (error) {
            console.log("redis not available ", error);
        }
    }
}

function getMarkets(market) {
    switch(market){
        case 'VN30':
            return;
        case 'HNX30':
            return;
        default: 
            return;
    }
}

function signals(value) {
    switch(value){
        case 'isFloor': 
            return;
        default:
            return;
    }
}

module.exports = {
    runInit: runInit
};