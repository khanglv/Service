const amqp = require('amqplib');
const eventQueue = require('./eventQueue.json');
const process = require('dotenv').config();
const rabbit_url = process.parsed.RABBIT_MQ_URL;
const dbo = require('../databaseConnection/connection');
// const rabbitMQ = require('./rabbitMQ');

exports.run = async() => {
    await dbo.connectToServer(function (err, client) {
        if (err) console.log(err);
    });
    let connection = await amqp.connect(rabbit_url);
    let channel = await connection.createChannel();
    
    channel.prefetch(1);
    channel.consume(eventQueue.sendPrice, async function(msg) {
        try {
            console.log(JSON.parse(msg.content.toString()));
            let payload = JSON.parse(msg.content.toString());
            let dataUpdate = null;
            if(payload){
                dataUpdate = payload;
            }
            const db = dbo.getDb();
            db.collection("price").insertOne(dataUpdate, function(err, res) {
                if (err) throw err;
            });
            
            channel.ack(msg);
        }catch(error) {
            console.log("Fail SEND Lead", error)
        }
    });
}

exports.run();