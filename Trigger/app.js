const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const getUser = require('./src/routers/User/getUser');
// const auth = require('./Authenticate/Auth');
const rabbit = require('./src/rabbitMQ/rabbitMQ');
// const priceChange = require('./ContinuityPrice/priceChange');
const actionPush = require('./src/routers/actionPush/actionPush');
const otpAction = require('./src/routers/OTP_SMS/OTP_SMS');
const oneSignal = require('./src/pushNotify/oneSignal');
const alertSetting = require('./src/routers/Alert/setting');
const alertStock = require('./src/routers/Alert/stock');
const cronjob = require('./src/actions/getStockList');
const test = require('./src/test');

const port = 7002;
const hostname = '0.0.0.0';

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

//===================== run Init =================================
rabbit.install();
cronjob.run();
//===================== run Init =================================

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, hostname, async () => {
    // priceChange.actionApiTimeout();
    console.log(`Example app listening at ${hostname}:${port}`)
})

// app.use('/auth', auth);
app.use('/user-request', getUser);
app.use('/action-push', actionPush);
app.use('/otp-sms', otpAction);
app.use('/push-notify', oneSignal);
app.use('/alert-setting', alertSetting);
app.use('/alert-stock', alertStock);
app.use('/test', test);

app.get('/secretTest', async function (req, res) {
    await rabbit.sendMail(JSON.stringify({
        type: 'asbdsadsad'
    }))
    res.send('Hello World 3!')
})
