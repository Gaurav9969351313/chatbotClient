const redis = require('redis');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const utils = require('../Utilities/utils');
const config = require('../config');

// Maintaining The Global Connection Objcets And Their Statuses
var isRedisClientConnected = false, isMongoClientConnected = false, db;
var redisClient = {}, mongodClient = {};

try {
    if (config.db.dbChoice == 0) {
        try {
            isRedisClientConnected = false;
            console.log(config.db.dbChoiceConfig[config.db.dbChoice].port);
            redisClient = redis.createClient(parseInt(config.db.dbChoiceConfig[config.db.dbChoice].port),
                config.db.dbChoiceConfig[config.db.dbChoice].host);

            redisClient.on('connect', function () {
                isRedisClientConnected = true;
                utils.log('info|=============> Redis Server Connected Sucessfully <================');
                console.log('Redis Server Connected Sucessfully...');
            });
        } catch (error) {
            utils.log('error|=============> Error While Connecting Redis Server <================');
            console.log('Error While Connecting Redis Server...');
        }

    } else if (config.db.dbChoice == 1) {
        try {
            isMongoClientConnected = false;

            //MongoClient is Lib wala client 
            MongoClient.connect(config.db.dbChoiceConfig[config.db.dbChoice].url, { useNewUrlParser: true }, function (err, client) {

                assert.equal(null, err);
                isMongoClientConnected = true;
                utils.log('info|=============> Mongo Server Connected Sucessfully <================');
                console.log("Mongo Server Connected Sucessfully...");
                // here MongodClent We have Maintained
                mongodClient = client;
            });
        } catch (error) {
            utils.log('error|=============> Error While Connecting Mongo Server <================');
            console.log('Error While Connecting Mongo Server...');
        }
    }
} catch (error) {
    utils.log('error| *Unable To Start Redis');
}

function isDBConected() {
    if (config.db.dbChoice == 0) {
        return isRedisClientConnected;
    } else if (config.db.dbChoice == 1) {
        return isMongoClientConnected;
    }
}

function dbConnection() {
    if (config.db.dbChoice == 0) {
        return redisClient;
    } else if (config.db.dbChoice == 1) {
        return mongoClient;
    }
}

module.exports.dbInsert = function (data) {
    if (config.db.dbChoice == 0 && isRedisClientConnected) {
        try {
            redisClient.hmset(config.db.dbChoiceConfig[config.db.dbChoice].redisKeyForAppMetaData, { 'metaHashMap': JSON.stringify(data) });
            logger.info("info|Sucessfully Cached Data in Redis");
            console.log("Sucessfully Cached Data in Redis");
        } catch (error) {
            console.log("Error While inserting data into Redis");
            utils.log("error|Error While inserting data into Redis");
        }
    } else if (config.db.dbChoice == 1 && isMongoClientConnected) {
        try {
            // @_ToDo here might have to delete the existing documenets from collection
            // before inserting new one

            const db = mongodClient.db(config.db.dbChoiceConfig[config.db.dbChoice].dbName);
            var col = db.collection(config.db.dbChoiceConfig[config.db.dbChoice].collectionName);

            col.insert(JSON.parse(data), function (result) {
                utils.log('info|Sucessfully Cached Data in MongoDB');
                console.log("Sucessfully Cached Data in MongoDB");
            });

            mongodClient.close();
        } catch (error) {
            console.log("Error While inserting data into Mongo");
            utils.log("error|Error While inserting data into Mongo");
        }
    }
}

module.exports.dbSelect = function () {

    var selectdata = {};

    if (config.db.dbChoice == 0) {
        try {
            redisClient.exists(config.db.dbChoiceConfig[config.db.dbChoice].redisKeyForAppMetaData, function (err, reply) {
                if (err) {
                    console.log("Redis Error While Searching Key");
                    utils.log('error|Redis Error While Searching Key');
                }

                if (reply === 1) {
                    console.log("Redis Key Exists");
                    redisClient.hgetall(config.redisKeyForAppMetaData, function (err, appMetaData) {
                        if (err) {
                            console.log("Redis Error while fetching AppMetaData: ", err);
                            logger.error("error|Redis Error while fetching AppMetaData: ", err);
                        } else {
                            selectdata = appMetaData;
                        }
                    });
                }
            });
        } catch (error) {
            console.log("Error While Selecting Data in Mongo");
            utils.log("error|Error While Selecting Data in Mongo");
        }
        return selectdata;
    } else if (config.db.dbChoice == 1) {
        try {
            // @_ToDo check
            var db = mongodClient.db(config.db.dbChoiceConfig[config.db.dbChoice].dbName);
            var col = db.collection(config.db.dbChoiceConfig[config.db.dbChoice].collectionName);

            col.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found the following records");
            })
            mongodClient.close();
        } catch (error) {
            console.log("Error While Selecting Data in Mongo");
            utils.log("error|Error While Selecting Data in Mongo")
        }
        return selectdata;
    }
}