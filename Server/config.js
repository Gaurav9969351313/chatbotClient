const config = {
  app: {
    port: 7000,
    IS_DEBUG_MODE_ON: true
  },
  db: {
    dbChoice: 1,
    dbChoiceConfig: [{
      host: '127.0.0.1',
      port: 6379,
      name: 'db',
      redisKeyForAppMetaData:'QlikMetaData'
    },
    {
      url: 'mongodb://localhost:27017',
      dbName: 'qlikHrChatBot',
      collectionName:'qlikData'
    }
    ]
  },
  QlikSense: {
    SERVER: "qsdev.mahindra.com",
    ENGINE_HOST: "qliksensedev.corp.mahindra.com",
    ENGINE_PORT: 4747,
    PORT: 443,
    SENSE_PROXY:"",
    USER_DIRECTORY: "MAHINDRA",
    APP_ID: '4ba7bc03-3f85-4e2b-b33b-c6030da1f03d',
    CERTIFICATES_PATH: "Certificates/",
    SuperUserID: "11003"
  }
};

module.exports = config;
