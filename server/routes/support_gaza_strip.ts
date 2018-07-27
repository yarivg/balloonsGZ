import { NextFunction, Request, Response, Router } from "express";
import { db } from "../dal/connection";
import { User, userSchema } from "../models/User";
import { pbkdf2, randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { config } from "../../.configenv";
import { digest, length, secret } from "../config";
import { mongoose } from "../dal/connection";
import * as moment from "moment";
import * as uuid from "uuid";
const supportRouter: Router = Router()

supportRouter.post("/support", (request: Request, response: Response, next: NextFunction) => {
  let data;
  let secretToken;
  let condition;
  if (request.body.hasOwnProperty("phone_number") && (request.body.phone_number !== "")) {
    condition = { phone_number: request.body.phone_number };
  } else if (request.body.hasOwnProperty("facebook_id")) {
    condition = { facebook_id: request.body.facebook_id };
  } else {
    const err = new Error("No phone number nor facebook entered");
    response.send(err).status(400).end();
    return;
  }
  const newUser = {
    user_support_images: [{
      image: request.body.image,
      lat: request.body.lat,
      lng: request.body.lng
    }],
  };
  console.log(newUser)
  User.findOneAndUpdate(condition, { $set: newUser }, { upsert: true, new: true }, (err, user) => {
    console.log(user);
    if (err) {
      console.log(err);
      console.log("X6!X");
      response.send(err).status(400).end();
      return;
    } else if (!user) {
      console.log("X5!X");
      response.send("Something went wrong, no user was created, sowwie").status(400).end();
      return;
    }
    response.send(user).status(200).end();
  });
});

export { supportRouter };
