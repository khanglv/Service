const moment = require('moment');

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function splitStringDate(time){
    try {
        let hours = '111111'
        if(time){
            hours = moment(new Date(time), 'HH:mm:ss').format("HH:mm:ss");
        }
        let convert = hours.replace(/:/g, '');
        
        return convert || null;
    } catch (error) {
        
    }
}

    
function convertDDMMYYYY (date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
}

function setMinute(time, type, durationInMinutes ) { //type: 1 -> up, 2 -> down
    let timeConvert = new Date(time);
    let result = null;
    if(type === 1){
        result = timeConvert.setMinutes(time.getMinutes() + durationInMinutes )
    }
    if(type === 2){
        result = timeConvert.setMinutes(time.getMinutes() - durationInMinutes )
    }
    return result;
}

module.exports = {
    randomNumber: randomNumber,
    dateString: splitStringDate,
    setMinute: setMinute,
    convertDDMMYYYY: convertDDMMYYYY
}