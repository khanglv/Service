const { Worker, isMainThread, MessageChannel } = require('worker_threads');

function createWorker(workerData = {}, actionType) {
    let _worker = new Worker(`${__dirname}/${actionType}.js`, { workerData });
    _worker.on('message', resolve);
    _worker.on('error', reject);
    _worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
}

module.exports = {
    createWorker
}