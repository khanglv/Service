const amqp = require('amqplib');
const eventQueue = require('../../workers/eventQueue.json');
const process = require('dotenv').config();
const rabbit_url = process.parsed.RABBIT_MQ_URL;
const api = require('./api');

async function init(){
    try {
        let connection = await amqp.connect(rabbit_url);
        let channel = await connection.createChannel();
        
        api.checkConnectionSMS();
        channel.prefetch(1);
        channel.consume(eventQueue.SMSProvider, async function(msg) {
            try {
                let payload = JSON.parse(msg.content.toString());
                let smsContent = null;
                if(payload){
                    smsContent = payload;
                }
                api.sendSMSProvider(smsContent);
                console.log('\x1b[32m', `- queue change SMS Provider success`)
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