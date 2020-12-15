const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const process = require('dotenv').config();
const DATABASE_URL = process.parsed.DATABASE_MONGO_URL

async function getAlertSetting(params) {
    try {
        const client = await MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true });
        let db = client.db("vcsc_investor");
        let dbo = db.collection("alert_setting");
        let obj = await dbo.findOne({});
        client.close();
        return obj;
    } catch (error) {
        
    }
}

router.get("/", async function (req, res) {
    try {
        const data = await getAlertSetting();
        res.status(200).json({
            status: 200,
            data: data,
            message: "success"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;