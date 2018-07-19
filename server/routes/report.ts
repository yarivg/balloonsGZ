import {Request, Response, Router} from "express";
import * as uuid from "uuid";

const isInPolygon = require("../utils/polygonFilter").isInPolygon;
const _ = require("lodash");
const alonAPI = require("../routes/alon");
const request = require("request");
const seeVUToken = "leeroezpsnyoecdjvqofomqpwjvrjcybdvcpewkwhjbvkwdeqewlyfhtyprhxngbmhrdxzjupigeounbiwzgdbzuuydtykguzkxoghqjnjisazxwaswjwscpuyogdzgr";
const user_id = "1846";

const reportRouter: Router = Router();
reportRouter.get("/", (req: Request, res: Response) => {
  res.send("ok").end();
});

reportRouter.post("/", (req: Request, res: Response) => {
  console.log("send req to seeVU");

  if (req.body.lat && req.body.lng) {
    // if (req.body.lat && req.body.lng && isInPolygon([req.body.lat, req.body.lng])) {
    let phoneNumber;
    if (req.body.userToken) {
      phoneNumber = (_.invert(alonAPI.tokens))[req.body.userToken] || "XXX-XXXXXXX";
    }
    // TODO remove xxx-xxxxxxxx if alon way required
    // if (phoneNumber) {
    const reqBody = {
      phone: "+9725675454",
      name: req.body.name,
      lng: req.body.lng,
      lat: req.body.lat,
      image: req.body.imageBase64.split("base64,")[1],
      heading: req.body.azimuth ? req.body.azimuth.toString() : "0",
      category: req.body.category ? req.body.category.toString() : "0",
      description: req.body.description,
      pitch: "0",
      token: seeVUToken,
      user_id,
    };
    console.log(reqBody)
    request.post({
        headers: {"content-type": "application/json"},
        url: "https://res-cue.com/web/report/image",
        body: JSON.stringify(reqBody),
      }, (error, response, body) => {
        if (response && response.statusCode == 200) {
          console.log("ok res");
          res.send(body).status(200).end();
        } else {
          console.log(error);
          res.send("bad res").status(400).end();
        }
      },
    );

    // } else {
    //   console.log("no phone number detected");
    //   res.send("Call 107").status(200);
    //   res.end();
    // }
  } else { // If not in polygon
    res.send("עובדים על זה. תודה.").status(200).end();
  }
});

export {reportRouter};
