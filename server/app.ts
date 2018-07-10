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
var url = require('url');

const loginToken = "otdSlvsbPJvFfvQPWywbMDDm2Pyll8j4ZcDhNgqp"
var cors = require('cors')
const reporterID = 56
const app: express.Application = express();

app.disable("x-powered-by");

app.use(cors())

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

    res.header("Access-Control-Allow-Credentials", "true")
    next();
});
// api routes
app.use("/api/secure", protectedRouter);
app.use("/api/login", loginRouter);
app.use("/api/public", publicRouter);
app.use("/api/feed", feedRouter);
app.use("/api/user", userRouter);

var options = {
    host: 'res-cue.com',
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
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query; 

  console.log(query)
  res.send(query)
  res.end()
})

const new_app = express()
new_app.use(cors())
new_app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers","*")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})
new_app.get('/', (req, res) => res.send('Hello World!'))
// New report
new_app.get('/api/report', (req, res) => {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query; 
  console.log(query)
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

  var sendData = util.format('EmergencySubCatID=0&LocationX=%d&loginToken=%s&AddedTimeMilliseconds=%s&ReporterID=%s&LocationY=%s&EmergencyCatID=6',
              query.latitude,
              loginToken, 
              Date.now().toString(), 
              reporterID, 
              query.longitude)
  console.log(sendData)
  sayVURequest.write(sendData);
  sayVURequest.end();
})
new_app.listen(3000, () => console.log('Example app listening on port 3000!'))

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
