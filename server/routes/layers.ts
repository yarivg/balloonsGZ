import { Request, Response, Router } from "express";
import * as uuid from "uuid";

const crypto = require("crypto");
const layerRouter: Router = Router();

const creatorKey = "c26d3a7046e4f929d3293121f10f3704";
const protocol = "https://";
const domain = "balloon.cf";
const refEndpoint = "/#/home?entry=";

const tokens = {};
