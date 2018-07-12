import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";
import * as http from "http";

import { reportRouter } from "./routes/report"
var alonAPI = require('./routes/alon')

var util = require('util')
var https = require('https');
var url = require('url');
var bodyParser = require('body-parser');

var cors = require('cors')
const app: express.Application = express();

app.disable("x-powered-by");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())

// Add headers - enable cors
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});


app.use('/api/token', alonAPI.router)
app.use('/api/report', reportRouter)

var polygonFilter = require('./utils/polygonFilter')
console.log('started')

// if (app.get("env") === "production") {
  // in production mode run application from dist folder

  // PRODUCTION MODE
  app.use(express.static(path.join(__dirname, "/../client")));
// }

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  const err = new Error("Not Found");
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
