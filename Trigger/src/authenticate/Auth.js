const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');

router.get('/auth', function (req, res) {
    try {
        // const token = auth.create();
        // res.status(200).json({
        //     status: 200,
        //     message: 'OK',
        //     token: token
        // });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})