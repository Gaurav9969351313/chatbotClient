const log4js = require('log4js');
const config = require('../config');
const isDebugModeOn = config.IS_DEBUG_MODE_ON;

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'logfile.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});

const logger = log4js.getLogger();

module.exports.log = function (msg) {
    var logMsg = msg.split('|');
    if (isDebugModeOn) {
        console.log(logMsg[1]);
    } else if (logMsg[0] == 'info') {
        logger.info(logMsg[1]);
    } else if (logMsg[0] == 'warn') {
        logger.info(logMsg[1]);
    }
    else {
        logger.error(logMsg[1]);
    }
};

module.exports.ResponseToReturn = function ResponseToReturn(respCode = 200, respMsg = "", respStr = "", respObj = {}) {
    var obj = {
        "ResponseCode": respCode,
        "ResponseMessage": respMsg,
        "ResponseString": respStr,
        "ResponseObject": respObj
    }
    return obj;
}
