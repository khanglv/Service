const appSMS = require('../src/SMSProvider/SMSProvider');
exports.run = ()=>{
    appSMS.init();
}

exports.run();