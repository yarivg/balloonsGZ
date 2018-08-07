import {Logger} from "../utils/logger/logger";
import {Request, Response, Router} from "express";
import * as uuid from "uuid";
import * as environment from "../../.configenv";

"../utils/logger/logger";
const isInPolygon = require("../utils/polygonFilter").isInPolygon;
const _ = require("lodash");
const alonAPI = require("../routes/alon");
const request = require("request");
const uuidv4 = require("uuid/v4");

const reportRouter: Router = Router();
reportRouter.get("/", (req: Request, res: Response) => {
  res.send("ok").end();
});

reportRouter.post("/", (req: Request, res: Response) => {
  console.log("send req to seeVU");
  Logger.info("send req to seeVU");
  Logger.info(req.body);
  if (req.body.lat && req.body.lng) {
    Logger.info("REACHED!");
    let token, userID, serverReportsURL;
    sendToDrones(req.body.lat, req.body.lng, req.body.name);

    // if (req.body.lat && req.body.lng && isInPolygon([req.body.lat, req.body.lng])) {
    let phoneNumber;
    if (req.body.userToken) {
      phoneNumber = (_.invert(alonAPI.tokens))[req.body.userToken] || "XXX-XXXXXXX";
    }
    if (process.env.NODE_ENV !== "production") {
      token = environment.config.serverLayersToken[1];
      serverReportsURL = environment.config.serverLayersURL[1];
      userID = "790";
    } else {
      token = environment.config.serverLayersToken[0];
      serverReportsURL = environment.config.serverLayersURL[0];
      userID = "1846";
    }

    // TODO remove xxx-xxxxxxxx if alon way required
    // if (phoneNumber) {
    Logger.info(token);
    Logger.info(serverReportsURL);
    const reqBody = {
      category: req.body.category ? req.body.category.toString() : "0",
      description: req.body.description,
      heading: req.body.azimuth ? req.body.azimuth.toString() : "0",
      // image: req.body.imageBase64.split("base64,")[1],
      image: "",
      lat: req.body.lat,
      lng: req.body.lng,
      name: req.body.name,
      phone: "+972504841981",
      pitch: "0",
      token,
      user_id: userID,
    };
    Logger.debug(JSON.stringify(reqBody));
    request.post({
      body: JSON.stringify(reqBody),
      headers: {"content-type": "application/json"},
      url: serverReportsURL + "/web/report",
      }, (error, response, body) => {
        if (response && response.statusCode == 200) {
          Logger.info("ok res");
          res.send(body).status(200).end();
        } else {
          Logger.error(error);
          Logger.info(body);
          res.send("bad res").status(400).end();
        }
      },
    );

    // } else {
    //   Logger.info("no phone number detected");
    //   res.send("Call 107").status(200);
    //   res.end();
    // }
  } else { // If not in polygon
    res.send("עובדים על זה. תודה.").status(200).end();
  }
});

function sendToDrones(lat: string, long: string, text: string) {
  const timestamp = new Date().getTime();
  const uniqueId = uuidv4();
  const reqBody = {
    data: [{
      accuracy: 0.1,
      active: true,
      address: "",
      code: "g48fe",
      color_index: 0,
      created: timestamp,
      elevation: 0,
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      mission_id: "aabccbbdfdfhdgfhhfdggdghdghdfhngd",
      modified: timestamp,
      owner_id: "7b172f10-e609-4f5a-a03f-4a8e05ce9e38",
      owner_name: "pilot",
      pitch: 0,
      projected_fov: [],
      text,
      type: "tracker",
      unique_id: uniqueId,
      user_stopped_tracking: true,
      version: 1,
      visible_off_screen: true,
      yaw: 0,
    }],
  };
  Logger.info(JSON.stringify(reqBody));
  Logger.info("sending request to Edgybees...");
  request.post({
    body: JSON.stringify(reqBody),
    headers: {"content-type": "application/json"},
    url: "https://backend.edgybees.us/10027/virtual_obj/tracker_insert/",
    }, (error, response, body) => {
      if (response && response.statusCode == 200) {
        Logger.info("request to Edgybees passed successfully");
      } else {
        Logger.info("request to Edgybees did not pass");
      }
    },
  );
}

export {reportRouter};
