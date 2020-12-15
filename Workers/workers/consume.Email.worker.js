const appEmail = require('../src/mailer/emailSend');
exports.run = ()=>{
    appEmail.init();
}

exports.run();