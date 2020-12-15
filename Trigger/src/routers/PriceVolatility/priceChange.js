const express = require('express');
const router = express.Router();
const axios = require('axios');

const TIME_START = new Date().setHours(08,55,0,0)
const TIME_END = new Date().setHours(17,49,0,0)

function actionApiTimeout(){
    let timeNow = new Date().getTime();
    if(TIME_START < timeNow && timeNow < TIME_END){
        setTimeout(()=>{
            getApiPrice(['VNM', 'VCI', 'ACB']);
        }, 15000);
    }
}

async function getApiPrice (lstStock){
    try {
        //request để check giá có thay đổi hay không???
        console.log("check api price");
        const result = await axios.get('http://localhost:3000/random/dataSystem/price', {
            params: {
                listStock: lstStock
            }
        })
        return result.data;
    } catch (error) {
        console.log("catch " + error);
    }
}

exports.actionApiTimeout = actionApiTimeout; 