const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const process = require('dotenv').config();
const DATABASE_URL = process.parsed.DATABASE_MONGO_URL;

async function checkValue_OTP(idValue) {
    try {
        const client = await MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true });
        let db = client.db("vcsc_registration");
        let dbo = db.collection("otp_khanglv");
        let obj = await dbo.findOne({"key": idValue});
        client.close();
        return obj;
    } catch (error) {
        
    }
}

router.post("/confirm", auth.auth, [
    check('value_otp').isLength({ min: 1 }),
    check('key').isLength({ min: 1 })
], async function(req, res){
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }else{
            const data = req.body || {};
            let objFind = await checkValue_OTP(data.key);
            if(objFind){
                if(objFind.value_otp === parseInt(data.value_otp)){
                    res.status(200).json({
                        status: 200,
                        data: objFind,
                        message: "OTP is correct"
                    });
                }else{
                    res.status(404).json({
                        status: 404,
                        data: {},
                        message: "OTP is incorrect"
                    });
                }
            }else{
                res.status(404).json({
                    status: 404,
                    data: {},
                    message: "OTP is expired"
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});

module.exports = router;