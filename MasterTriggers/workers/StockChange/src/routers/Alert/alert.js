const express = require('express');
const router = express.Router();
const auth = require('../../../../authenticate/auth');
const _ = require("lodash");
const { check, validationResult } = require('express-validator');
const dbo = require('./database');
const common = require('../../common/common');
const redisFunc = require('../../redisHandle/setRedis');

async function init() {
    await dbo.connectToServer(function (err, client) {
        if (err) console.log(err);
    });
}

init();

async function connectColection(colectionName) {
    if(colectionName){
        let db = dbo.getDb();
        let dbColection = await db.collection(colectionName);
        return dbColection;
    }
}

router.get('/configs', auth.auth, async function (req, res) {
    try {
        const dataColection = await connectColection("alert_setting");
        let msndt = req.query.msndt || null;
        let objMsndt = {};
        if(msndt){
            objMsndt = {msndt: msndt}
        }
        let objFind = await dataColection.find(objMsndt).toArray();
        res.status(200).json({
            status: 200,
            data: objFind,
            success: true,
            message: 'get data success!!!'
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/subContent', auth.auth, async (req, res) => {
    try {
        const dataColection = await connectColection("content");
        let msndt = req.query.msndt || null;
        let objMsndt = {};
        if(msndt){
            objMsndt = {msndt: msndt}
        }
        let result = await dataColection.find(objMsndt).toArray();

        res.status(200).json({
            status: 200,
            data: result,
            success: true,
            message: 'get data success!!!'
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/mainContent', auth.auth, async (req, res) => {
    try {
        const dataColection = await connectColection("content");
        let msndt = req.query.msndt || null;
        let objMsndt = {};
        if(msndt){
            objMsndt = {msndt: msndt}
        }
        let objFind = await dataColection.find(objMsndt).toArray();

        let result = _.chain(objFind)
        .groupBy(a => common.convertDDMMYYYY(a.createDate))
        .map((data, createDate) => ({ createDate, data }))
        .value();

        res.status(200).json({
            status: 200,
            data: result,
            success: true,
            message: 'get data success!!!'
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/content', auth.auth, [
    check('msndt').isLength({ min: 1 }),
], async (req, res) => {
const errors = validationResult(req)
if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
}else{
    const { arrData } = req.body;
    const dataColection = await connectColection("content");
    for (let y = 0; y < arrData.length; y++) {
        let newvalues = { "status": dataReq[y].status }
        let objUpdate = await dataColection.updateOne({"_id": new ObjectId(dataReq[y]._id)}, newvalues);
    }
    res.status(200).json({
        status: 200,
        //success: objUpdate.result.ok === 1,
        message: 'update success!!!'
    });
    // dataColection//if(!objFind){
        //res.status(404).json({error: 'msndt not found'});
    //}else{
        //try {
      
        //} catch (error) {
            
        //}
        
        // dataColection.updateOne({"msndt": dataReq.msndt}, objData);
    //}
}
});

router.put('/configs', auth.auth, [
        check('msndt').isLength({ min: 1 }),
        check("isFloorCeiling", "Invalid data").isBoolean(),
    ], async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }else{
        const dataReq = req.body;
        // const arrData = req.body.arrData;
        const dataColection = await connectColection("alert_setting");
        let objFind = true;
        let newvalues = { "$set": dataReq }
        let objUpdate = await dataColection.updateOne({"msndt": dataReq.msndt}, newvalues, {upsert: true});
        
        if(!objFind){
            res.status(404).json({error: 'msndt not found'});
        }else{
            try {
                //update lại redis
                redisFunc.setUserID(dataReq);
                res.status(200).json({
                    status: 200,
                    success: objUpdate.result.ok === 1,
                    message: 'update success!!!'
                });
            } catch (error) {
                
            }
            
            // dataColection.updateOne({"msndt": dataReq.msndt}, objData);
        }
    }
});

router.post('/configs', auth.auth, [
        check('msndt').isLength({ min: 1 }),
    ], async function (req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }else{
            const dataReq = req.body;
            const dataColection = await connectColection("alert_setting");
            let objFind = await dataColection.findOne({"msndt": dataReq.msndt});
            if(objFind){
                res.status(500).json({
                    status: 500,
                    data: 'msndt must not be duplicated',
                    message: 'failed'
                });
            }else{
                let objFind = {
                    msndt: dataReq.msndt,
                    isFloor: dataReq.msndt,
                    isCeiling: dataReq.isCeiling,
                    isLast: dataReq.isLast,
                    isOpen: dataReq.isOpen,
                    isActive: true
                };
                try {
                    dataColection.insertOne(objFind);
                    res.status(200).json({
                        status: 200,
                        data: 'data have been created',
                        message: 'successfully'
                    });
                } catch (error) {
                    res.status(500).json({
                        status: 500,
                        data: 'data not create',
                        message: `error: ${error}`
                    });
                }
            }
        }
});


module.exports = router;