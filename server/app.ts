import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";
import * as http from "http";

import { feedRouter } from "./routes/feed";
import { loginRouter } from "./routes/login";
import { protectedRouter } from "./routes/protected";
import { publicRouter } from "./routes/public";
import { userRouter } from "./routes/user";

var util = require('util')
var https = require('https');

const loginToken = "otdSlvsbPJvFfvQPWywbMDDm2Pyll8j4ZcDhNgqp"
const reporterID = 56
const app: express.Application = express();

app.disable("x-powered-by");

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// Add headers - enable cors
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});
// api routes
app.use("/api/secure", protectedRouter);
app.use("/api/login", loginRouter);
app.use("/api/public", publicRouter);
app.use("/api/feed", feedRouter);
app.use("/api/user", userRouter);

var options = {
    host: 'www.res-cue.com',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": '*'
    }
}

console.log('started')
// New report
app.post('/report', (req, res) => {
  console.log('got req')
  let path = '/app/ws/report/new/report'
  let reqOptions = JSON.parse(JSON.stringify(options))
  reqOptions['path'] = path

  let sayVURequest = https.request(options, (sayVURes) =>
  {
      sayVURes.setEncoding('utf8');
      sayVURes.on('data', function (chunk) {
        console.log("body: " + chunk);
        res.send(chunk)
        res.end()
      })
  })

  util.format('EmergencySubCatID=0&LocationX={0}&loginToken={1}&AddedTimeMilliseconds={2}&ReporterID={3}&LocationY={4}&EmergencyCatID=6',
              req.body.location.latitude.toString(),
              loginToken, 
              reporterID, 
              Date.now().toString(), 
              req.body.location.longtitude.toString())
  sayVURequest.write('EmergencySubCatID=0&LocationX=31.508143&loginToken=otdSlvsbPJvFfvQPWywbMDDm2Pyll8j4ZcDhNgqp&AddedTimeMilliseconds=1531137892292&ReporterID=56&LocationY=34.592048&EmergencyCatID=6');
  sayVURequest.end();
})

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
