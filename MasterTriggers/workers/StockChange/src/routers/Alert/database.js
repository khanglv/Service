const MongoClient = require('mongodb').MongoClient;
const process = require('dotenv').config();
const DATABASE_URL = process.parsed.DATABASE_MONGO_URL;

let _db = [];
module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true }, function (err, client) {
            _db = client.db('vcsc_investor');
            return callback(err);
        });
    },
    getDb: function () {
        return _db;
    }
}