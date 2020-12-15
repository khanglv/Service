const amqp = require('amqplib');

async function init () {
    try {
        let connection = await amqp.connect('amqp://10.11.0.113/');
        let channel = await connection.createChannel();
        connection.on("error", function(err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        let config = {
            queue_1: 'test_rabbit_sendMail',
            // queue_2: 'test_rabbit_OTP',
            queue_3: 'test_rabbit_sendPrice'        }
        await channel.assertQueue(config.queue_1, {
            durable: true
        });
        // await channel.assertQueue(config.queue_2, {
        //     durable: true
        // });
        await channel.assertQueue(config.queue_3, {
            durable: true
        });
        exports.sendMail = async (message) => {
            console.log('sendMail with message', message)
            return await channel.sendToQueue(config.queue_1, Buffer.from(message), {
                persistent: false
            })
        }
        exports.sendOTP = async (message) => {
            console.log('send OTP with message', message)
            return await channel.sendToQueue(config.queue_2, Buffer.from(message), {
                persistent: false
            })
        }
        exports.sendPrice = async (message) => {
            console.log('send OTP with message', message)
            return await channel.sendToQueue(config.queue_3, Buffer.from(message), {
                persistent: false
            })
        }
        exports.channel = channel;
    }catch (error) {
        console.error("QUEUE",error);
    }
}
exports.install = init;
exports.name = "rabbit";