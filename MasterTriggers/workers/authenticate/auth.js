const jwt = require('jsonwebtoken')
const process = require('dotenv').config();
const secretKey = process.parsed.SECRET_KEY;

const tokenMaster = 'Khanglv';
function createToken(){
    return jwt.sign({ data: tokenMaster }, 'secretkey', { expiresIn: 180 });
}

async function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    if(req.headers.api_key){
        const token = req.headers.api_key;
        if (token === null) return res.status(500).json({ error: error.message }) // if there isn't any token
        if(token === secretKey){
            next()
        }else{
            res.status(403).json({ error: "Token is not correct!!!" })
        }
    }else{
        return res.status(403).json({ error: "Token not avalible!!!" })
    }
}

module.exports = {
    auth: authenticateToken,
    create: createToken
}