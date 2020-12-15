const express = require('express');
const app = express();
const server = require('http').createServer(app);
const appAlert = require('../src/alert/pushNotify');
const socket = require('../src/socket/turnOn');

exports.run = async ()=>{
    const port = 7001;
    const hostname = '0.0.0.0';

    await socket.init(server);
    server.listen(port, hostname, () => {
        console.log(`Example app listening at ${hostname}:${port}`)
    });
    // console.log(socket);
    await appAlert.init();
}

exports.run();