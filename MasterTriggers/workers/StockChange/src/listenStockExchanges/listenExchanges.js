const express = require('express');
const router = express.Router();
const redis = require('./redis');

router.get("/", function(req, res) {
    redis.runInit();
    res.status(200).json({
        status: 200,
        message: "Ok",
        data: 'Interval stock price'
    });
});

module.exports = router;