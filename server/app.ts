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
var bodyParser = require('body-parser');

const loginToken = "thisisatoken"
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

console.log('started')
// New report
app.post('/report', (req, res) => {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query; 

  console.log(query)
  http.request({
    host: 'res-cue.com',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": '*'
    }
  })
  res.send(query)
  res.end()
})

var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": '*'
    }
}

const seeVUURL = "dev.res-cue.com"
const seeVUPort = 8081
const seeVUToken = "thisisatoken"

const new_app = express()
new_app.use(cors())
new_app.use(bodyParser.json({limit: '50mb'}));
new_app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
new_app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers","*")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

// CHECK ALIVE
new_app.get('/', (req, res) => res.send('Hello World!'))


// TODO api/token
const request = require('request')

// New report
new_app.post('/api/report', (req, res) => {
  let reqBody = {
    phone: req.body.phone,
    name: req.body.name,
    lng: req.body.lng,
    lat: req.body.lat,
    image: req.body.imageBase64,
    azimuth: req.body.azimuth,
    tag: req.body.tag,
    pitch: 0,
    token: seeVUToken
  }

request.post({
    headers: {'content-type': 'application/json'},
    url:     'http://dev.res-cue.com:8081/web/report',
    body:   JSON.stringify(reqBody)
  },(error, response, body) => {
    if(response.statusCode == 200) {
      res.send(body).status(200).end()
    } else {
      res.send("bad req").status(200).end()
    }
  }
);
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
