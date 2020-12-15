// const rabbit = require('./workers/StockChange/rabbitMQ/rabbitMQ');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
// const server = http.createServer(app);

// rabbit.install();

if (isMainThread) {
    // const worker = new Worker('./workers/w.js');
    try {
        const stockChange = new Worker('./workers/StockChange/app.js');
    } catch (error) {
        
    }

} else {
    
}



