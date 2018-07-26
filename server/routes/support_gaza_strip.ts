import { NextFunction, Request, Response, Router } from "express";
import {db} from "../dal/connection";
import {User, userSchema} from "../models/User";
import {pbkdf2, randomBytes} from "crypto";
import {sign} from "jsonwebtoken";
import {config} from "../../.configenv";
import {digest, length, secret} from "../config";
import {mongoose} from "../dal/connection";


const supportGazaStripRouter: Router = Router();
const loginRouter: Router = Router();
import * as moment from "moment";

const user = {
  hashedPassword: "6fb3a68cb5fe34d0c2c9fc3807c8fa9bc0e7dd10023065ea4233d40a2d6bb4a" +
  "7e336a82f48bcb5a7cc95b8a590cf03a4a07615a226d09a89420a342584a" +
  "a28748336aa0feb7ac3a12200d13641c8f8e26398cfdaf268dd68746982bcf" +
  "59415670655edf4e9ac30f6310bd2248cb9bc185db8059fe979294dd3611fdf28c2b731",
  salt: "OxDZYpi9BBJUZTTaC/yuuF3Y634YZ90KjpNa+Km4qGgZXGI6vhSWW0T91" +
  "rharcQWIjG2uPZEPXiKGnSAQ73s352aom56AIYpYCfk7uNsd+7AzaQ6dxTnd9AzCCdIc/J" +
  "62JohpHPJ5eGHUJJy3PAgHYcfVzvBHnIQlTJCQdQAonQ=",
  username: "john",
};
supportGazaStripRouter.post("/support", (request: Request, response: Response, next: NextFunction) => {
  let data;
  let secretToken;
  let condition;
  if (request.body.hasOwnProperty("phone_number") && (request.body.phone_number !== "")) {
    condition = {phone_number: request.body.phone_number};
  } else if (request.body.hasOwnProperty("facebook_id")) {
    condition = {facebook_id: request.body.facebook_id};
  } else {
    const err = new Error("No phone number nor facebook entered");
    response.send(err).status(400).end();
    return;
  }
  const newUser = {
    user_support_images: [request.body.hasOwnProperty("phone_number") ],
  };

  User.findOneAndUpdate(condition, {$set: newUser}, {upsert: true, new: true}, (err, user) => {
    console.log("X!!!");
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
    console.log("X2");
    if (process.env.NODE_ENV !== "production") {
      console.log("X3");
      secretToken = config.secretToken[1];
    } else {
      console.log("X4");
      secretToken = config.secretToken[0];
    }
    console.log(user)
    const stringToken = (sign({
      _id: user._doc._id,
      expiration: moment({}).add(200, "hours").valueOf(),
      fullName: user._doc.fullName,
      phoneNumber: user._doc.phoneNumber,
    }, secretToken));
    data = {
      token: stringToken,
    };
    console.log(data);
    response.send(data).status(200).end();
  });
});

// login method
loginRouter.post("/", (request: Request, response: Response, next: NextFunction) => {

  pbkdf2(request.body.password, user.salt, 10000, length, digest, (err: Error, hash: Buffer) => {
    if (err) {
      throw new Error(err.message);
    }

    // check if password is active
    if (hash.toString("hex") !== user.hashedPassword) {
      return response.json({message: "Wrong password"});
    }

    const toSign = Object.assign({}, {user: user.username, permissions: []});
    const token = sign(toSign, secret, {expiresIn: "7d"});

    return response.json({jwt: token});

  });
});
supportGazaStripRouter.get("/map", (request: Request, response: Response) => {
  User.find({}, ((err, data) => {
    
  if (request.body.lat && request.body.lng) {};
    if (err) {
      response.send(err).status(400).end();
      return;
    } else {
      response.send(data).status(200).end();
      return;
    }
  }));
});

export { supportGazaStripRouter };
