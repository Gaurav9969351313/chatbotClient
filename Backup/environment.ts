// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

var firstLevelFilters = ["Permanent", "Probationer", "Trainee", "Contract", "Others", "OTP"];
var secondLevelBtns = ["Sector", "Business Unit", "Division", "Sub Division", "Department", "Sub Department", "Business Function", "Location"];
var thirdLevelBtns = ["Gender", "Tenure", "Age", "Band"];

export const environment = {
  production: false,
  isDebugMode: true,

  apiUrl: "http://localhost:5000",
  urlForQlikAuthentication: "http://localhost:7000/login",
  urlForLogger: "http://localhost:7000/pushToServerLog",
  loginByTokenUrl: "https://mapps.mahindra.com/BMCRemedyBotTest/chatbot?tokens=",
  soapLoginUrl: "https://ep.mahindra.com/AuthenticateLDAPUsersWSService/AuthenticateLDAPUsersWS?wsdl",
  cachingMetaDataUrl: "http://localhost:7000/getWholeMetaData?forceFulRedisCacheUpdate=0",

  appId: "c23feec8-eb7d-412d-8498-2ce05695c7b5",
  cardHeader: "Please find below information for {% intent %} Number",

  engineApiWSS: 'wss://qsdev.mahindra.com/app/c23feec8-eb7d-412d-8498-2ce05695c7b5',

  apiForBtns: "getButtonsByIndent",
  nlpServiceEndpoint: "",

  loginFromADUrl: "http://mmkndmoprd.corp.mahindra.com:8080/OAuthOneSAML/client/tokenRequest",
  aesKey: "ABCDEFGHIJKLMNOP",
  aesIv: "0001000100010001",


  loginErrorMsg: "UserId Might Be Wrong.",
  loginSucessMsg: "User Logged In Sucessfully",

  welcomeUserTemplate: "Hi {% username %}, How may I help you ?",
  cardHeaderTemplate: "Please find below information for {% userIntent %} Number",

  userDataStorageKey: "jUserData",

  allowedObjectsWithSelectionBar: ['barchart', 'combochart', 'table',
    'pivot-table', 'waterfallchart', 'treemap',
    'map', 'linechart', 'scatterplot', 'piechart',
    'gauge', 'histogram', 'distributionplot', 'boxplot',
    'kpi', 'text-image', 'anychart-qlik', 'amCombo'
  ],


  landingPageLinks: {
    "headcount": { "name": "Head Count" },
    "attrition": { "name": "Attrition" },
    "newjoineereport": { "name": "New Joinee Report" },
    "rehirereport": { "name": "RE Hire Report" },
    "genderdiversity": { "name": "Gender diversity" },
    "seprationandretirement": { "name": "Separation And Retirement Report" },
    "retirement": { "name": "Retirement" },
    "managerwithhighestattrition": { "name": "Manager with highest attrition" },
    "milestoneworkanniverseryreport": { "name": "Milestone Work Anniversery Report" },
    "birthdayreport": { "name": "Birthday Report" },
    "educationalqualificationreport": { "name": "Educational Qualification Report" },
    "employeemovementreport": { "name": "Employee Movement Report" },
    "rwsanctionsreport": { "name": "RW Sanctions Report" },
    "employeeconfirmationreport": { "name": "Employee Confirmation Report" },
    "performancemanagementreport": { "name": "Performance Management Report" },
    "rewardsandrecognitionreport": { "name": "Rewards And Recognition Report" },
    "regrettableattrition": { "name": "Regrettable Attrition" }
  },

  firstLevelFilters: firstLevelFilters,
  
  btnsByIndent: {
    "headcount": { "btns": firstLevelFilters, "objId": "2d0143be-bc5a-446a-a125-a68af6bf927b" },
    "attrition": { "btns": firstLevelFilters, "objId": "BZmLC" },
    "newjoineereport": { "btns": firstLevelFilters, "objId": [{ "id": "PUzNyUY", "type": "datepicker" }, { "id": "max", "type": "table" }, { "id": "TauKNBw", "type": "x-style-list" }] },
    "rehirereport": { "btns": firstLevelFilters, "objId": [{ "id": "PUzNyUY", "type": "datepicker" }, { "id": "max", "type": "table" }] },
    "genderdiversity": { "btns": firstLevelFilters, "objId": "" },
    "seprationandretirement": { "btns": firstLevelFilters, "objId": [{ "id": "bTGknxE", "type": "datepicker" }, { "id": "SqQtwjm", "type": "table" }] },
    "retirement": { "btns": firstLevelFilters, "objId": "" },
    "managerwithhighestattrition": { "btns": firstLevelFilters, "objId": "" },
    "milestoneworkanniverseryreport": { "btns": firstLevelFilters, "objId": [{ "id": "EjDgZL", "type": "datepicker" }, { "id": "tVGU", "type": "table" }, { "id": "qNvZPr", "type": "x-style-list" }] },
    "birthdayreport": { "btns": firstLevelFilters, "objId": "" },
    "educationalqualificationreport": { "btns": firstLevelFilters, "objId": [{ "id": "LQRPe", "type": "x-style-list" }, { "id": "YxYJtfm", "type": "table" }] },
    "employeemovementreport": { "btns": firstLevelFilters, "objId": [{ "id": "LNuvYJS", "type": "datepicker" }, { "id": "XPppQM", "type": "table" }] },
    "rwsanctionsreport": { "btns": firstLevelFilters, "objId": [{ "id": "mDfHHTH", "type": "x-style-list" }, { "id": "epsF", "type": "Pivot table" }] },
    "employeeconfirmationreport": { "btns": firstLevelFilters, "objId": [{ "id": "FYPay", "type": "table" }, { "id": "JJkzejV", "type": "datepicker" }] },
    "performancemanagementreport": { "btns": firstLevelFilters, "objId": [{ "id": "vARLHm", "type": "x-style-list" }, { "id": "jLzVKW", "type": "anychart-qlik" }] },
    "rewardsandrecognitionreport": { "btns": firstLevelFilters, "objId": [{ "id": "HnpPHXc", "type": "variable" }, { "id": "FfqdRZr", "type": "barchart" }] },
    "regrettableattrition": { "btns": firstLevelFilters, "objId": "" },

    "permanent": { "btns": secondLevelBtns },
    "probationer": { "btns": secondLevelBtns },
    "trainee": { "btns": secondLevelBtns },
    "contract": { "btns": secondLevelBtns },
    "others": { "btns": secondLevelBtns },
    "OTP": { "btns": secondLevelBtns },

    "sector": { "Name":"Sector", "btns": thirdLevelBtns },
    "businessunit": { "Name":"Business Unit", "btns": thirdLevelBtns },
    "division": { "Name":"Division", "btns": thirdLevelBtns },
    "subdivision": { "Name":"Sub Division", "btns": thirdLevelBtns },
    "department": { "Name":"Department", "btns": thirdLevelBtns },
    "subdepartment": { "Name":"Sub Department", "btns": thirdLevelBtns },
    "businessfunction": { "Name":"Business Function", "btns": thirdLevelBtns },
    "location": { "Name":"Location", "btns": thirdLevelBtns },

    "gender": { "btns": [] },
    "tenure": { "btns": [] },
    "age": { "btns": [] },
    "band": { "btns": [] },
  }



};

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
