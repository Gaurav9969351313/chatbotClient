const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const schema = require('enigma.js/schemas/12.20.0.json');
const enigma = require('enigma.js');
var WebSocket = require('ws');

const QRS = require("./qrs");
const utils = require('../Utilities/utils');
const config = require('../config');
const RequestFactory = require('./Factories/RequestFactory');

const dataFetcher = require('./DataFetcher');

const readCert = filename =>
    fs.readFileSync(path.resolve(__dirname, config.QlikSense.CERTIFICATES_PATH, filename));



router.post('/login', function (req, res) {
    try {

        QRS.getTicket(req.body.username, function (err, ticket) {

            if (err) {
                utils.log('error|Error While generating Ticket');
                res.send(utils.ResponseToReturn(200, "Error", 0, { 'error': 'Error While generating Ticket' }));
            }
            else {
                utils.log('info|Ticket Genrated Sucessfully For User' + req.body.username);

                var ticketWithURl = "https://qsdev.mahindra.com:443/hub?qlikTicket=" + ticket.Ticket;

                obj = {
                    "url": ticketWithURl,
                    "ticketInfo": ticket
                }

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
                                    'X-Qlik-User': `UserDirectory=${encodeURIComponent(config.QlikSense.USER_DIRECTORY)}; UserId=${encodeURIComponent(req.body.username)}`
                                },
                            }),
                        });
                        resolve(session);
                    } catch (error) {
                        utils.log('error|error in getMetaDataAPI file while creating session');
                        return reject();
                    }

                });

                sessionPromise.then((session) => {
                    try {
                        session.open().then(async function (global) {
                            global.getDocList().then(function (docList) {
                                var appLevelAccessFlag = '0';
                                for (let i = 0; i < docList.length; i++) {
                                    const appId = docList[i].qDocId;
                                    if (appId == config.QlikSense.APP_ID) {
                                        appLevelAccessFlag = '1'
                                        break;
                                    } else {
                                        appLevelAccessFlag = '0'
                                    }
                                }

                                if (appLevelAccessFlag == '1') {
                                    console.log("Login Sucessful for (" + config.QlikSense.APP_ID + ") app");
                                    res.send(utils.ResponseToReturn(200, "Login & Ticket Generated Sucessfully", 1, obj));
                                } else {
                                    console.log("Login Failed (App Level Access is not Granted)");
                                    res.send(utils.ResponseToReturn(200, "Login Failed (App Level Access is not Granted Hence Login Failed)", 0, {}));
                                }
                            });
                        });
                    } catch (error) {
                        console.log("Error While Opening Login Session");
                        utils.log('error|Error While Opening Login Session')
                    }
                })
            }
        });
        // res.send("Login API...!");
    } catch (error) {
        utils.log('error|Error While Making Session For Login API Endpoint');
    }

});

module.exports = router