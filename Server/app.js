const express = require('express');
const app = express();
const utils = require('./Utilities/utils');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./PersistanceLayer/DAO');

const loginAPI= require('./Routers/loginAPI');
const getMetaDataAPI = require('./Routers/getMetaDataAPI');
const mashupAPI = require('./Routers/mashupAPI');
const logAPI = require('./Routers/logAPI');

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(getMetaDataAPI);
app.use(loginAPI);
app.use(mashupAPI);
app.use(logAPI);

var Server = app.listen(config.app.port, function () {
    utils.log('info|Generic Server Started');
    console.log('listen to port ' + config.app.port);
});
