const nodemailer = require("nodemailer");
const tpl = require("./template");

const configsToMailVCSC = {
    host: '10.11.0.77',
    port: 25,
    secure: false,
    auth: {
        user: 'csvcsc',
        pass: '67domino@'
    },
}

async function main() {
    try {
        let lstCC = [];
        let transporter = nodemailer.createTransport({ // config mail server
            ...configsToMailVCSC,
            tls:{
                rejectUnauthorized: false
            }
        });

        const emailTemplate = await tpl.template();
        let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'VCSC Customer Services <customer.service@vcsc.com.vn>',
            to: 'lvkkhang@gmail.com',
            bcc: lstCC,
            subject: 'Mailer by KhangLv',
            text: 'You recieved message from ',
            html: emailTemplate
        }

        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                console.log('Mail is send ' +  info.response);
                res.redirect('/');
            }
        });
    } catch (error) {
        
    }
}

module.exports = {
    main: main
}