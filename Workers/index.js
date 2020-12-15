
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
// const server = http.createServer(app);

if (isMainThread) {
    // const worker = new Worker('./workers/w.js');
    try {
        const worker1 = new Worker('./workers/consume.Email.worker.js');
        const worker3 = new Worker('./workers/consume.smsProvider.js');
        const worker4 = new Worker('./workers/consume.Alert.worker.js');
    } catch (error) {
        
    }
    // worker.once('message', (message) => {
    //   console.log(message);  // Prints 'Hello, world!'.
    // });

    // worker.postMessage('Hello, world!');

} else {
    // When a message from the parent thread is received, send it back:
    // parentPort.once('message', (message) => {
    //   parentPort.postMessage(message);
    // });
}

// socket.turnOn(server);



