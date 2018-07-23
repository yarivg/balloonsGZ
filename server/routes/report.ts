import {Request, Response, Router} from 'express';

const uuidv4 = require('uuid/v4');
import {isNullOrUndefined} from 'util';

const isInPolygon = require('../utils/polygonFilter').isInPolygon;
const _ = require('lodash');
const alonAPI = require('../routes/alon');
const request = require('request');
const seeVUToken = 'leeroezpsnyoecdjvqofomqpwjvrjcybdvcpewkwhjbvkwdeqewlyfhtyprhxngbmhrdxzjupigeounbiwzgdbzuuydtykguzkxoghqjnjisazxwaswjwscpuyogdzgr';
const user_id = '1846';

const reportRouter: Router = Router();
reportRouter.get('/', (req: Request, res: Response) => {
  res.send('ok').end();
});

reportRouter.post('/', (req: Request, res: Response) => {
  console.log('send req to seeVU');
  console.log(req.body);

  if (!isNullOrUndefined(req.body.lat) && !isNullOrUndefined(req.body.lng)) {
    sendPostRequestToDronesApp(req.body.lat, req.body.lng, req.body.name);

    // if (req.body.lat && req.body.lng && isInPolygon([req.body.lat, req.body.lng])) {
    let phoneNumber;
    if (req.body.userToken) {
      phoneNumber = (_.invert(alonAPI.tokens))[req.body.userToken] || 'XXX-XXXXXXX';
    }
    // TODO remove xxx-xxxxxxxx if alon way required
    // if (phoneNumber) {
    const reqBody = {
      phone: '+972504841981',
      name: req.body.name,
      lng: req.body.lng,
      lat: req.body.lat,
      image: req.body.imageBase64.split('base64,')[1],
      heading: req.body.azimuth ? req.body.azimuth.toString() : '0',
      category: req.body.category ? req.body.category.toString() : '0',
      description: req.body.description,
      pitch: '0',
      token: seeVUToken,
      user_id,
    };
    request.post({
        headers: {'content-type': 'application/json'},
        url: 'https://res-cue.com/web/report/image',
        body: JSON.stringify(reqBody),
      }, (error, response, body) => {
        if (response && response.statusCode == 200) {
          console.log('ok res');
          res.send(body).status(200).end();
        } else {
          console.log(error);
          res.send('bad res').status(400).end();
        }
      },
    );

    // } else {
    //   console.log("no phone number detected");
    //   res.send("Call 107").status(200);
    //   res.end();
    // }
  } else { // If not in polygon
    res.send('עובדים על זה. תודה.').status(200).end();
  }
});

function sendPostRequestToDronesApp(lat: string, long: string, text: string) {
  const uniqueId = uuidv4();

  let reqBody = {
    data: [{
      version: 1,
      color_index: 0,
      elevation: 0,
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      owner_id: '7b172f10-e609-4f5a-a03f-4a8e05ce9e38',
      visible_off_screen: true,
      created: 1516031210,
      modified: 1516031210,
      projected_fov: [],
      text: text,
      yaw: 0,
      unique_id: uniqueId,
      active: true,
      address: '',
      type: 'tracker',
      mission_id: 'aabccbbdfdfhdgfhhfdggdghdghdfhngd',
      code: 'g48fe',
      owner_name: 'pilot',
      pitch: 0,
      user_stopped_tracking: true,
      accuracy: 0.1
    }]
  };

  console.log(reqBody);
  console.log('sending request to Edgybees...');

  request.post({
      headers: {'content-type': 'application/json'},
      url: 'https://backend.edgybees.us/10027/virtual_obj/tracker_insert/',
      body: JSON.stringify(reqBody),
    }, (error, response, body) => {
      if (response && response.statusCode == 200) {
        console.log('request to Edgybees passed successfully');
      } else {
        console.log('request to Edgybees did not pass');
      }
    },
  );
}

export {reportRouter};
