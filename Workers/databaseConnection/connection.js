const MongoClient  = require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017';
let _db = [];

module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            _db = client.db('demo');
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};