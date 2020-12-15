const common = require('../../common/common');
const MongoClient = require('mongodb').MongoClient;
const process = require('dotenv').config();
const DATABASE_URL = process.parsed.DATABASE_MONGO_URL;
const crypto  = require("crypto");

async function insertOTPDatabase(keyId, valueOtp) {

    if(valueOtp){
        const client = await MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true });
        let db = client.db("vcsc_registration");
        let dbo = db.collection("otp_khanglv");
        let myobj = {value_otp: valueOtp, key: keyId, "createdAt": new Date()};
        dbo.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 300 } )
        await dbo.insertOne(myobj);
        client.close();
    }
}

async function generateOTP(phoneNumber) {
    try {
        if(phoneNumber){
            let isInsert = true;
            let valueOTP = common.randomNumber(100000, 999999);
            let keyId = crypto.randomBytes(20).toString('hex');
            if(valueOTP >= 100000){
                try {
                    await insertOTPDatabase(keyId, valueOTP);
                } catch (error) {
                    isInsert = false;
                    console.log('insertOTPDatabase error', error);
                }
            }
            return isInsert ? {otp_value: valueOTP, key: keyId} : null;
        }
        return null;
    } catch (error) {
        console.log("generateOTP error: ", error)
    }
}

module.exports = {
    generateOTP: generateOTP
}