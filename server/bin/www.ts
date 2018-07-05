#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import { app } from "../app";
import { serverPort } from "../config";

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || serverPort);
app.set("port", port);

/**
 * Create HTTP server.
 */
//const server = http.createServer(app);

/**
 * Create HTTPS server.
 */
var fs = require('fs')

var pathToEncrption = "../encryption/"
var key = fs.readFileSync(pathToEncrption + 'private.key');
var cert = fs.readFileSync(pathToEncrption + 'primary.crt' );

var options = {
  key: key,
  cert: cert
};

var https = require('https');
const server = https.createServer(options, app)

server.listen(443)

// Redirect from http port 80 to https
http.createServer(function (req, res) {
  if(req.url.indexOf('.well-known/acme-challenge/') > -1 ||
    req.url.indexOf('.well-known/pki-validation/')  > -1) {
    res.write(fs.readFileSync('../' + req.url))
    
  } else if(req.url.indexOf('/favicon.ico') == -1) {
    res.write(fs.readFileSync('src/favicon.ico'))
  }
  else{
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  } 

  res.end();
}).listen(80);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val): boolean | number {

  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // tslint:disable-next-line
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
}
