const amqp = require('amqplib');
const eventQueue = require('../../workers/eventQueue.json');
const process = require('dotenv').config();
const rabbit_url = process.parsed.RABBIT_MQ_URL;
const mailer = require("./mailer");

async function init(){
    try {
        let connection = await amqp.connect(rabbit_url);
        let channel = await connection.createChannel();
        channel.prefetch(1);
        channel.consume('test_rabbit_sendMail', async function(msg) {
            try {
                console.log("start action send mail to email!!!")
                let payload = JSON.parse(msg.content.toString());
                let dataUpdate = null;
                if(payload){
                    dataUpdate = payload;
                }
                console.log("start action send mail to email!!!")
                mailer.main();
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