import { Request, Response, Router } from "express";
import * as uuid from "uuid";

const request = require('request')
const seeVUToken = "thisisatoken"
const reporterID = 56

const reportRouter: Router = Router();
reportRouter.get("/", (req: Request, res: Response) => {
    res.send('ok').end()
})

reportRouter.post("/", (req: Request, res: Response) => {
    let reqBody = {
        phone: req.body.phone,
        name: req.body.name,
        lng: req.body.lng,
        lat: req.body.lat,
        image: req.body.imageBase64,
        azimuth: req.body.azimuth,
        tag: req.body.tag,
        description: req.body.description,
        pitch: 0,
        token: seeVUToken
    }

    request.post({
        headers: { 'content-type': 'application/json' },
        url: 'http://dev.res-cue.com:8081/web/report',
        body: JSON.stringify(reqBody)
    }, (error, response, body) => {
        console.log(response)
        console.log(body)
        if (response && response.statusCode == 200) {
            console.log('ok res')
            res.send(body).status(200).end()
        } else {
            res.send("bad res").status(400).end()
        }
    }
    );

});

export { reportRouter }