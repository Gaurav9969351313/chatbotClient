var https = require('https'),
  fs = require('fs'),
  crypto = require('crypto');
var config = require('../config');
var QRS = "4242", QPS = "4243";

var certificatesPath = __dirname + '\\' + config.QlikSense.CERTIFICATES_PATH;

module.exports = {
  getTicket: function (user, callbackFn) {
    var data = {
      UserDirectory: config.QlikSense.USER_DIRECTORY,
      UserId: user
    }
    this.qPost(QPS, ("/qps/" + config.QlikSense.SENSE_PROXY) + "ticket/", data,
      function (err, ticketResponse) {
        if (err) {
          callbackFn(err);
        }
        else {
          var ticket = JSON.parse(ticketResponse);
          if (ticket.Ticket) {
            callbackFn(null, ticket);
          }
          else {
            callbackFn(null);
          }
        }
      });
  },
  generateXrfkey: function (size, chars) {
    size = size || 16;
    chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(size), value = new Array(size), len = chars.length;
    for (var i = 0; i < size; i++) {
      value[i] = chars[rnd[i] % len]
    };
    return value.join('');
  },
  qGet: function (api, url, callbackFn) {
    try {
      var cert = fs.readFileSync(certificatesPath + '/client.pem');
      var key = fs.readFileSync(certificatesPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate');
      return;
    }
    var xrfkey = this.generateXrfkey();

    var settings = {
      method: 'GET',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = config.QlikSense.SENSE_SERVER;
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    console.log(settings);
    var data = "";
    https.get(settings, function (response) {
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function () {
        callbackFn.call(null, null, data);
      });
    }).on('error', function (e) {
      callbackFn.call(null, e);
    });
  },
  qPost: function (api, url, data, callbackFn) {
    try {
     
      // console.log("certificatesPath:- "+ certificatesPath);
      var cert = fs.readFileSync(certificatesPath + '/client.pem');
      var key = fs.readFileSync(certificatesPath + '/client_key.pem');
    } catch (e) {
      callbackFn.call(null, 'Missing client certificate');
      return;
    }
    var xrfkey = this.generateXrfkey();
    var settings = {
      method: 'POST',
      headers: {
        'x-qlik-xrfkey': xrfkey,
        'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      key: key,
      cert: cert,
      rejectUnauthorized: false
    };

    if (url.indexOf("http") != -1) {
      settings.host = Url.parse(url).hostname;
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path + '?xrfkey=' + xrfkey;
    }
    else {
      settings.host = config.QlikSense.SERVER;
      settings.port = api;
      settings.path = url + '?xrfkey=' + xrfkey;
    }
    // console.log(settings);

    var output = "";
    var postReq = https.request(settings, function (postRes) {
      postRes.on('data', function (chunk) {
        output += ("" + chunk);
      });
      postRes.on('end', function () {
        callbackFn.call(null, null, output);
      });
    });

    postReq.write(JSON.stringify(data));
    postReq.end();

    postReq.on('error', function (e) {
      callbackFn.call(null, e);
    });
  }
};
