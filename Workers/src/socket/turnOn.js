const event = require('./event.json');


function priceSocket(){
    // global.__socket.emit('priceStock', 'wow. such event. very real time.');
}

let __socket = {};

function turnOn(server) {
    const io = require("socket.io")(server);
    io.on("connection", function (socket) {
        console.log('socket connected');
        exports.rocket1h = socket;
        socket.join(room);
        __socket = socket;
        socket.on('disconnect', function () {
            console.log('socket disconnected');
        });
        socket.on('priceStock', function () {
            console.log('priceStock connected');
        });
        // socket.emit('text', 'wow. such event. very real time.');
    });
}

let sockets = {}
let io = null

function onDisconnect(socket) {
    console.log(socket.id, `is disconnected`)
}

function init(server) {
    return new Promise( (resolve, reject) => {
        try {
            const _io = require("socket.io")(server);
            _io.on("connect", function (socket) {
                sockets[socket.id] = socket;
                socket.on('disconnect', () => onDisconnect(socket));
            });
            io = _io;
            module.exports.io = _io;
            resolve({ sockets});
        }catch(er) {
            reject(er)
        }
    })
}


module.exports = {
    init: init
}