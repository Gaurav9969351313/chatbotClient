const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

const utils = require('../Utilities/utils');
const config = require('../config');
const dumpFactory = require('./Factories/DumpFactory');

// if obj id not present create on the fly --> you have to send objId = false
router.get('/getObjDataForMashup', function (req, res) {
    try {
        var resp = dumpFactory.getObjectStructure(req.query.strContext, req.query.strDim);
        res.send(resp);
    } catch (error) {
        utils.log('error|Error While Making Session For Login API Endpoint');
    }
});

module.exports = router