const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const schema = require('enigma.js/schemas/12.20.0.json');
const enigma = require('enigma.js');

const config = require('../config');
const utils = require('../Utilities/utils');
const dataFetcher = require('./DataFetcher');

const readCert = (filename) =>
    fs.readFileSync(path.resolve(__dirname, config.QlikSense.CERTIFICATES_PATH, filename));


const sessionPromise = new Promise((resolve, reject) => {
    try {
        const session = enigma.create({
            schema,
            url: `wss://${config.QlikSense.ENGINE_HOST}:${config.QlikSense.ENGINE_PORT}/app/${config.QlikSense.APP_ID}`,

            createSocket: url => new WebSocket(url, {
                ca: [readCert('root.pem')],
                key: readCert('client_key.pem'),
                cert: readCert('client.pem'),
                headers: {
                    'X-Qlik-User': `UserDirectory=${encodeURIComponent(config.QlikSense.USER_DIRECTORY)}; UserId=${encodeURIComponent(config.QlikSense.SuperUserID)}`
                },
            }),
        });
        resolve(session);
    } catch (error) {
        utils.log('error|error in getMetaDataAPI file while creating session');
        return reject();
    }

});



// http://localhost:3000/getWholeMetaData?forceFulDbCacheUpdate=1
// if 0 then get data from redis 
// if 1 then get data from qlik server and overwrite fetched data into redis
router.get('/getWholeMetaData', function (req, res) {
    try {
        var forceCachingFlag;
        
        if (req.query.forceFulDbCacheUpdate == '0')
            forceCachingFlag = false;
        else if (req.query.forceFulDbCacheUpdate == '1')
            forceCachingFlag = true;

        if (!forceCachingFlag) {
            // get dara from DB
        } else {
            // get data from Qlik
            try {
                sessionPromise.then((session)=>{
                    session.open().then(async function (global) {
                        var resp = await dataFetcher.getGlobalLevelData(global,res);
                       // res.send(resp);
                    });
                });
            } catch (error) {
                console.log('error while resolving');
            }
        }


    } catch (error) {

    }
    // res.send("Shree Swami Samartha...")
});

module.exports = router