import { Request, Response, Router } from "express";
import * as uuid from "uuid";
import { json } from "body-parser";

const layerRouter: Router = Router();

var statusReport = {
  "reports": [
    {
      "id": 123,
      "lat": 32.333,
      "lng": 31.333,
      "name": "Israel Israeli",
      "phone": "+97255555555",
      "timestamp": 1531821361123
    },
    {
      "id": 124,
      "lat": 31.333,
      "lng": 32.333,
      "name": "Dodo Israeli",
      "phone": "+97266666666",
      "timestamp": 1531821361624
    }
  ],
  "users": [
    {
      "lat": 32.3332,
      "lng": 31.333,
      "name": "Israel Israeli",
      "phone": "+97255555555",
      "timestamp": 1531821361123
    },
    {
      "lat": 31.3331,
      "lng": 32.333,
      "name": "Israela Israeli",
      "phone": "+97266666666",
      "timestamp": 1531821361624
    }
  ]
}

layerRouter.post('/', (request: Request, response: Response) => {
    response.json(statusReport);
})

export { layerRouter };
