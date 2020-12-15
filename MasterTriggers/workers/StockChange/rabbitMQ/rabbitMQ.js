const amqp = require('amqplib');
const { sendOTP } = require('./test');
const eventQueue = require('./eventQueue.json');
const process = require('dotenv').config();
const rabbit_url = process.parsed.RABBIT_MQ_URL;

let properties = {}; //a

async function init () {
    try {
        let connection = await amqp.connect(rabbit_url);
        let channel = await connection.createChannel();
        connection.on("error", function(err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        for(const property in eventQueue){
            channel.assertQueue(eventQueue[property], {
                durable: true
            });
            properties[property] = async (message) => {
                //console.log(`send ${eventQueue[property]} with message ax ax`, message)
                return await channel.sendToQueue(eventQueue[property], Buffer.from(JSON.stringify(message)), {
                    persistent: false
                })
            }
        }
        
        exports.channel = channel;
    }catch (error) {
        console.error("QUEUE", error);
    }
}

exports.install = init;
exports.name = "rabbit";
exports.function = properties;