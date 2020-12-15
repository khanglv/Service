const axios = require('axios');

const TIME_OUT = 10000;

async function api(options){
    try {
        options = {
            ...options,
            timeout: TIME_OUT,
            headers: {
                ...options.headers,
                // Authorization: `Bearer ${accessTokenAuth}`
            },
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        }
        const response = await axios(options);
    
        if(response.status>= 200 && response.status < 300){
            return response.data;
        }
    }catch(err){
        console.log(err.response, " err.response -----------------");
        if(err.response)
            return {
                status: err.response.status,
                data: err.response.data
            };
        return {message: "Server is not connection!!!"};
    }
}

module.exports = api;