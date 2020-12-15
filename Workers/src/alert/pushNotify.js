const amqp = require('amqplib');
const eventQueue = require('../../workers/eventQueue.json');
const channelEvent = require("./channelSubscribe.json");
const process = require('dotenv').config();
const rabbit_url = process.parsed.RABBIT_MQ_URL;
const socket = require('../socket/turnOn');
async function init(){
    try {
        let connection = await amqp.connect(rabbit_url);
        let channel = await connection.createChannel();
    
        channel.prefetch(1);
        channel.consume(eventQueue.alert_pushNotify, async function(msg) {
            try {
                let payload = JSON.parse(msg.content.toString());
                if(payload){
                    console.log(payload.msndt, 'payload.msndt')
                    socket.io.emit(`${payload.channelSubscribe}_${payload.msndt}`, payload);
                    // switch(payload.market){
                    //     case "marketVN30":
                    //         socket.io.emit("marketVN30", payload);
                    //         break;
                    //     case "marketHNX30":
                    //         socket.io.emit("marketHNX30", payload);
                    //         break;
                    //     default:
                    //         break;
                    // }
                }
                console.log('\x1b[32m', `- Alert`, payload)
                channel.ack(msg);
            }catch(error) {
                console.log("Fail SEND Lead", error)
            }
        });
    } catch (error) {
        
    }
}

module.exports={
    init: init
}