const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rabbit = require('./rabbitMQ/rabbitMQ');
const cronjobStock = require('./src/actions/getStockList');
const cronjobMarket = require('./src/actions/getMarkets');
const redis = require('./src/listenStockExchanges/redis');

//================== router ===================
const listenExchanges = require('./src/listenStockExchanges/listenExchanges');
const alert = require('./src/routers/Alert/alert');
const redisAction = require('./src/routers/Alert/redisAction');
//=================== *** =====================

const port = 7005;
const hostname = '0.0.0.0';

//===================== run Init =================================
rabbit.install();
cronjobStock.run();
cronjobMarket.run();
redis.runInit();
//================================================================

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.listen(port, hostname, async () => {
    console.log(`Example app listening at ${hostname}:${port}`)
})

app.use('/*', (req, res, next)=>{
    setHeader(req, res, next);
});

app.use('/listen-exchanges', listenExchanges);
app.use('/alert', alert);
app.use('/redis-action', redisAction);

function setHeader(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept, Authorization, API_KEY');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}