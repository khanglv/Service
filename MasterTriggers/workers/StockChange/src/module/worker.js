const { workerData, parentPort } = require('worker_threads')
const redis = require('../redisHandle/setRedis');
// const rabbit = require('../../rabbitMQ/rabbitMQ').function;
const channelEvent = require("../listenStockExchanges/channelSubscribe.json");
const rabbit = require('../../rabbitMQ/rabbitMQ');
const axios = require('axios');
const dbo = require('../routers/Alert/database');
const e = require('express');

async function initConnect() {
    await dbo.connectToServer(function (err, client) {
        if (err) console.log(err);
    });
}

async function connectColection(colectionName) {
    if(colectionName){
        let db = dbo.getDb();
        let dbColection = await db.collection(colectionName);
        return dbColection;
    }
}

async function __handlePrice(configs = {}) {
    try {
        let dataPrice = workerData;
        let objPrice = dataPrice.objPrice;
        // const res = await redis.getUserID('068C000007');
        const lstConfigsUser = await __findUserWithCondition();
        //console.log(lstConfigsUser, "lstConfigsUser")
        if(objPrice) {
            // let func = rabbit.function;
            // func.alert_pushNotify({
            //     ...objPrice,
            //     channelSubscribe: channelEvent.ceilingCrossChannel,
            //     market: "VNALLShare"
            // });
            //Kiểm tra đụng trần, chạm sàn của mã cổ phiếu
            // let checkFC = 'isCeiling';
            // //const checkFC = objPrice.c === objPrice.fl ? 'isFloor' : 'isCeiling';
            // for(let i = 0; i < lstConfigsUser.length; i++) {
            //     let msndt = lstConfigsUser[i].msndt;
            //     // check KH đăng ký nhận alert chạm trần/sàn
            //     if(lstConfigsUser[i].isFloorCeiling) {
            //         console.log(objPrice, "objPrice")
            //         let dataColection = await connectColection("content");
            //         //Tần suất cảnh báo.
            //         let market = lstConfigsUser[i].market;
            //         let content = checkFC === 'isFloor' ? `Mã ${objPrice.s} giảm sàn ${objPrice.c}! Tìm cơ hội đầu tư ngay thôi.` : `Mã ${objPrice.s} tăng trần ${objPrice.c}! Chốt lời thì đặt lệnh ngay thôi`;

            //         //console.log(typeof lstConfigsUser[i].onceTimeWarning, lstConfigsUser[i].onceTimeWarning);
            //         if(lstConfigsUser[i].onceTimeWarning === '1') { // Báo 1 lần
            //             let objFind = await dataColection.findOne({
            //                 "msndt": msndt,
            //                 'stockCode': objPrice.s,
            //                 'createDate': {
            //                     $gte: new Date()
            //                 }
            //             });

            //             if(objFind === null) {
            //                 if(market.indexOf('vnallshare') > 1) {
            //                     let func = rabbit.function;
            //                     func.alert_pushNotify({
            //                         ...objPrice,
            //                         channelSubscribe: channelEvent.ceilingCrossChannel,
            //                         msndt: lstConfigsUser[i].msndt, 
            //                         content: content
            //                     });
                                
            //                     dataColection.insertOne({
            //                         "msndt": lstConfigsUser[i].msndt,
            //                         "content": content,
            //                         "stockCode": objPrice.s,
            //                         "checkFC": (checkFC === 'isFloor' ? 0 : 1),
            //                         "createDate": new Date()
            //                     });
            //                 } else {
            //                     const checkMarket = await _checkMarket(stockCode = objPrice.s, market = market);
            //                     if(checkMarket) {
            //                         let func = rabbit.function;
            //                         func.alert_pushNotify({
            //                             ...objPrice,
            //                             channelSubscribe: channelEvent.ceilingCrossChannel,
            //                             msndt: lstConfigsUser[i].msndt,
            //                             content: content
            //                         });
                                    
            //                         dataColection.insertOne({
            //                             "msndt": lstConfigsUser[i].msndt,
            //                             "content": content,
            //                             "stockCode": objPrice.s,
            //                             "checkFC": (checkFC === 'isFloor' ? 0 : 1),
            //                             "createDate": new Date()
            //                         });
            //                     }
            //                 }
            //             }
            //         } else if (lstConfigsUser[i].onceTimeWarning === '0') { // Báo nhiều lần / phút
            //             if(market.indexOf('vnallshare') > 1) {
            //                 let func = rabbit.function;
            //                 func.alert_pushNotify({
            //                     ...objPrice,
            //                     channelSubscribe: channelEvent.ceilingCrossChannel,
            //                     msndt: lstConfigsUser[i].msndt, 
            //                     content: content
            //                 });
                            
            //                 dataColection.insertOne({
            //                     "msndt": lstConfigsUser[i].msndt,
            //                     "content": content,
            //                     "stockCode": objPrice.s,
            //                     "type": 1,
            //                     "checkFC": (checkFC === 'isFloor' ? 0 : 1),
            //                     "createDate": new Date()
            //                 });
            //             } else {
            //                 const checkMarket = await _checkMarket(stockCode = objPrice.s, market = market);
            //                 if(checkMarket) {
            //                     let func = rabbit.function;
            //                     func.alert_pushNotify({
            //                         ...objPrice,
            //                         channelSubscribe: channelEvent.ceilingCrossChannel,
            //                         msndt: lstConfigsUser[i].msndt,
            //                         content: content
            //                     });
                                
            //                     dataColection.insertOne({
            //                         "msndt": lstConfigsUser[i].msndt,
            //                         "content": content,
            //                         "type": 1,
            //                         "stockCode": objPrice.s,
            //                         "checkFC": (checkFC === 'isFloor' ? 0 : 1),
            //                         "createDate": new Date()
            //                     });
            //                 }
            //             }
            //             // await _checkConfigAlert(
            //             //     dataColection = dataColection, 
            //             //     stockCode = objPrice.s, 
            //             //     market = market, 
            //             //     content = content, 
            //             //     msndt = msndt, 
            //             //     checkFC = checkFC
            //             // );
            //         } else {
                        
            //         }
            //     }
            // }

            if(objPrice.c === objPrice.fl || objPrice.c === objPrice.cl) {
                const checkFC = objPrice.c === objPrice.fl ? 'isFloor' : 'isCeiling';
                for(let i = 0; i < lstConfigsUser.length; i++) {
                    // check KH đăng ký nhận alert chạm trần/sàn
                    if(lstConfigsUser[i].isFloorCeiling) {
                        //Tần suất cảnh báo.
                        let market = lstConfigsUser[i].market;
                        let content = checkFC === 'isFloor' ? `Mã ${objPrice.s} giảm sàn ${objPrice.c}! Tìm cơ hội đầu tư ngay thôi.` : `Mã ${objPrice.s} tăng trần ${objPrice.c}! Chốt lời thì đặt lệnh ngay thôi`;

                        if(lstConfigsUser[i].onceTimeWarning === 1) { // Báo 1 lần
                             const dataColection = await connectColection("content");
                             let objFind = await dataColection.findOne({
                                "msndt": lstConfigsUser[i].msndt,
                                'stockCode': objPrice.s,
                                'createDate': {
                                    $gte: new Date()
                                }
                            });

                            if(!objFind) {
                                if(market.indexOf('vnallshare') > 1) {
                                    let func = rabbit.function;
                                    func.alert_pushNotify({
                                        ...objPrice,
                                        channelSubscribe: channelEvent.ceilingCrossChannel,
                                        msndt: lstConfigsUser[i].msndt, 
                                        content: content
                                    });
                                    
                                    dataColection.insertOne({
                                        "msndt": lstConfigsUser[i].msndt,
                                        "content": content,
                                        "stockCode": objPrice.s,
                                        "type": 1,
                                        "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                        "createDate": new Date()
                                    });
                                } else {
                                    const checkMarket = await _checkMarket(stockCode = objPrice.s, market = market);
                                    if(checkMarket) {
                                        let func = rabbit.function;
                                        func.alert_pushNotify({
                                            ...objPrice,
                                            channelSubscribe: channelEvent.ceilingCrossChannel,
                                            msndt: lstConfigsUser[i].msndt,
                                            content: content
                                        });
                                        
                                        dataColection.insertOne({
                                            "msndt": lstConfigsUser[i].msndt,
                                            "content": content,
                                            "type": 1,
                                            "stockCode": objPrice.s,
                                            "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                            "createDate": new Date()
                                        });
                                    }
                                }
                                // await _checkConfigAlert(
                                //     dataColection = dataColection, 
                                //     stockCode = objPrice.s, 
                                //     market = market, 
                                //     content = content, 
                                //     msndt = lstConfigsUser[i].msndt, 
                                //     checkFC = checkFC
                                // );
                                // if(market.indexOf('vnallshare') > 1) {
                                //     let func = rabbit.function;
                                //     func.alert_pushNotify({
                                //         ...objPrice,
                                //         channelSubscribe: channelEvent.ceilingCrossChannel,
                                //         msndt: lstConfigsUser[i].msndt, 
                                //         content: content
                                //     });
                                    
                                //     dataColection.insertOne({
                                //         "msndt": lstConfigsUser[i].msndt,
                                //         "content": content,
                                //         "stockCode": objPrice.s,
                                //         "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                //         "createDate": new Date()
                                //     });
                                // } else {
                                //     const checkMarket = await _checkMarket(stockCode = objPrice.s, market = market);
                                //     if(checkMarket) {
                                //         let func = rabbit.function;
                                //         func.alert_pushNotify({
                                //             ...objPrice,
                                //             channelSubscribe: channelEvent.ceilingCrossChannel,
                                //             msndt: lstConfigsUser[i].msndt,
                                //             content: content
                                //         });
                                        
                                //         dataColection.insertOne({
                                //             "msndt": lstConfigsUser[i].msndt,
                                //             "content": content,
                                //             "stockCode": objPrice.s,
                                //             "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                //             "createDate": new Date()
                                //         });
                                //     }
                                // }
                            }
                        } else if (lstConfigsUser[i].onceTimeWarning === '0') { 
                            if(market.indexOf('vnallshare') > 1) {
                                let func = rabbit.function;
                                func.alert_pushNotify({
                                    ...objPrice,
                                    channelSubscribe: channelEvent.ceilingCrossChannel,
                                    msndt: lstConfigsUser[i].msndt, 
                                    content: content
                                });
                                
                                dataColection.insertOne({
                                    "msndt": lstConfigsUser[i].msndt,
                                    "content": content,
                                    "stockCode": objPrice.s,
                                    "type": 1,
                                    "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                    "createDate": new Date()
                                });
                            } else {
                                const checkMarket = await _checkMarket(stockCode = objPrice.s, market = market);
                                if(checkMarket) {
                                    let func = rabbit.function;
                                    func.alert_pushNotify({
                                        ...objPrice,
                                        channelSubscribe: channelEvent.ceilingCrossChannel,
                                        msndt: lstConfigsUser[i].msndt,
                                        content: content
                                    });
                                    
                                    dataColection.insertOne({
                                        "msndt": lstConfigsUser[i].msndt,
                                        "content": content,
                                        "type": 1,
                                        "stockCode": objPrice.s,
                                        "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                                        "createDate": new Date()
                                    });
                                }
                            }
                            // await _checkConfigAlert(stockCode = objPrice.s, market = market, content = content, msndt = lstConfigsUser[i].msndt, checkFC = checkFC);
                        } else { // Báo nhiều lần / phút
                            
                        }
                    }
                }
            }
        }
    } catch (error) {
        
    }
}

async function _checkConfigAlert(stockCode = '', market = [], content = '', checkFC = '', msndt = '') {
   
    try {
        let dataColection = await connectColection("content");
        
        if(market.indexOf('vnallshare') > 1) {
            let func = rabbit.function;
            func.alert_pushNotify({
                ...objPrice,
                channelSubscribe: channelEvent.ceilingCrossChannel,
                msndt: msndt, 
                content: content
            });
            
            dataColection.insertOne({
                "msndt": msndt,
                "content": content,
                "stockCode": stockCode,
                "type": 1,
                "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                "status": 0,
                "createDate": new Date()
            });
            console.log(rs);
        } else {
            const checkMarket = await _checkMarket(stockCode = stockCode, market = market);
            if(checkMarket) {
                let func = rabbit.function;
                func.alert_pushNotify({
                    ...objPrice,
                    channelSubscribe: channelEvent.ceilingCrossChannel,
                    msndt: msndt,
                    content: content
                });
                
                dataColection.insertOne({
                    "msndt": msndt,
                    "content": content,
                    "stockCode": stockCode,
                    "type": 1,
                    "checkFC": (checkFC === 'isFloor' ? 0 : 1),
                    "status": 0,
                    "createDate": new Date()
                });
            }
        }
    } catch (error) {
        
    }
}


async function _checkMarket(stockCode = '', market = []) {
    try {
        let result = false;
        if(market.indexOf('vn30') > 1 || market.indexOf('hnx30') > 1) {
            let _checkVN30 = await axios.get(`https://rest.vcsc.com.vn/api/v1/market/indexStockList/VN30`);
            let _checkHNX30 = await axios.get(`https://rest.vcsc.com.vn/api/v1/market/indexStockList/HNX30`);
            if(_checkVN30.data.stockList.indexOf(stockCode) === 0 || _checkHNX30.data.stockList.indexOf(stockCode) === 0) {
                result = true;
            }
        }
        return result;
    } catch (error) {
        
    }
}

async function __findUserWithCondition(obj = {}) {
    try {
        let arrData = [];
        let dataTmp = await redis.getAllUserID();
        if(dataTmp.length > 0){
            const lstIdUser = JSON.parse(dataTmp);
            for (const property in lstIdUser) {
                let data = await redis.getUserID(lstIdUser[property]);
                arrData.push(JSON.parse(data));
            }
        }
        return arrData;
        //lstConfigsUser = arrData;
    } catch (error) {
        
    }
}


async function init() {
    await rabbit.install();
    initConnect();
    setTimeout(()=>{
        __handlePrice();
    }, 500);
}

init();