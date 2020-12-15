const process = require('dotenv').config();
const BASE__URL = process.parsed.BASE_SERVER_STOCK_LIST_URL;

const rs = require('redis');
const redis = rs.createClient(6379, BASE__URL);

async function setUserID(obj = {}) {
    try {
        if(obj){
            let keySet = `_${obj.msndt}_alert`;
            redis.set(keySet, JSON.stringify(obj));
            let getAll = await getAllUserID();
            let getAllUse = [];
            if(getAll){
                getAllUse = JSON.parse(getAll);
            }
            
            let newAll = [
                ...getAllUse,
                obj.msndt
            ]
            setAllUserID(newAll);
        }
    } catch (error) {
        
    }
}

async function setAllUserID(obj = []) {
    try {
        redis.set("_allUserIDConfigAlert", JSON.stringify(obj));
    } catch (error) {
        
    }
}

async function getAllUserID() {
    try {
        return new Promise((resolve, reject)=>{
            redis.get("_allUserIDConfigAlert", function(err, reply) {
                if(err) reject(err);
                resolve(reply);
            });
        });
    } catch (error) {
        
    }
}

function getUserID(msndt) {
    return new Promise((resolve, reject)=>{
        let keyGet = `_${msndt}_alert`;
        redis.get(keyGet, function(err, reply) {
            if(err) reject(err);
            resolve(reply);
        });
    });
}

function removeAllUersID() {
    redis.del("_allUserIDConfigAlert",function (err, reply) {
        console.log("Redis Del", reply);
    });
}

module.exports = {
    setUserID,
    getAllUserID,
    getUserID,
    removeAllUersID
}