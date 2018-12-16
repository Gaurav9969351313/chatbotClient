const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const utils = require('../Utilities/utils');

router.post('/pushToServerLog', function (req, res) {
    try {
        utils.log('error|'+ JSON.stringify(req.body.logBody));
    } catch (error) {
        console.log('error|Error While Logging Log');
    }
});

module.exports = router