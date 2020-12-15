const axios = require('axios');
const process = require('dotenv').config();
const BASE_LOCAL_URL = process.parsed.BASE_LOCAL_URL;
const SECRET_KEY = process.parsed.SECRET_KEY;
const redis = require('../redisHandle/setRedis');
const _w = require('../module/index');

let lstConfigsUser = [];

const lstConfigs = {
    isFloor: 'isFloor',
    isCeiling: 'isCeiling',
    upDownReference: 'upDownReference',
    ceilingFloorCross: 'ceilingFloorCross',
    marketVN30: 'marketVN30',
    marketHNX30: 'marketHNX30',
    marketVNALLShare: 'marketVNALLShare',
}

async function getAllConfigsAlert() {
    try {
        const res = await axios({
            method: "GET",
            url: `${BASE_LOCAL_URL}/alert/configs`,
            headers: {
                API_KEY: SECRET_KEY
            }
        });
        return res.data.data || []
    } catch (error) {
        
    }
}

async function __checkConfigsUser(data) {
    try {
        // const res = await redis.getUserID(data);
        _w.createWorker({
            objPrice: data,
            // lstConfigsUser: lstConfigsUser
        }, 'worker');
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
                arrData.push(data);
            }
        }
        lstConfigsUser = arrData;
    } catch (error) {
        
    }
}

function __handleConfig(objPrice, typeConfig) {
    try {
        if(objPrice){
            switch(typeConfig){
                case 'isFloor':
                    if(objPrice.c === objPrice.fl){
                        return {data: objPrice, type: 'isFloor' };
                    }
                    return;
                case 'isCeiling':
                    if(objPrice.c === objPrice.cl){
                        return {data: objPrice, type: 'isCeiling' };
                    }
                    return;
                case 'upDownReference':
                    if(typeConfig.upDownReferenceValue){
                        if(objPrice.c > objPrice.cl*0.02*typeConfig.upDownReferenceValue){
                            return {data: objPrice, type: 'upDownReference', a: typeConfig.upDownReferenceValue};
                        }
                    }
                    return;
                case 'ceilingFloorCross':
                    return;
                case 'marketVN30':
                    return;
                case 'marketHNX30':
                    return;
                case 'marketVNALLShare':
                    return;
                default:
                    return;
            }
            
        }
    } catch (error) {
        
    }
}

function init() {
    __findUserWithCondition();
    setInterval(()=>{
        __findUserWithCondition();
    }, 300000);
}

//init();

module.exports = {
    __checkConfigsUser,
    getAllConfigsAlert
}