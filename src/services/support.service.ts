import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as environment from '../../.configenv';

@Injectable()
export class SupportService {
  private image: string = null;
  private _window: any;
  private watchPosId: number;

  public currLocation: any;
  private currAzimuth = 0;
  private whatsappSharingUrl = '';

  // report data
  private category = '11';
  private imageBase64 = '';
  private reader: any = new FileReader();


  constructor(private http: HttpClient, private router: Router) {
    this._window = window;
  }


  /**
   *   Set private local variable "image", to hold the recieved image (as string)
   *   @returns {Boolean}
   */
  setImage(stringifiedImage) {
    this.image = stringifiedImage;

    return this.image == stringifiedImage;
  }

  clearImage() {
    this.image = null;
  }

  /**
   *   Return the local variable image (as string)
   *   @returns {String}
   */
  getImage() {
    return this.image;
  }




  /**
   *  Watches user location for his report
   */
  checkLocation() {
    if (navigator.geolocation) {
      this.watchPosId = navigator.geolocation.watchPosition((position) => {
        this.currLocation = position.coords;
        console.log(position.coords);
        localStorage.setItem('latitude', position.coords.latitude.toString());
        localStorage.setItem('longitude', position.coords.longitude.toString());
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // alert("User denied the request for Geolocation.")
            // alert("User denied the request for Geolocation.")
            // this.checkLocation()
            break;
          case error.POSITION_UNAVAILABLE:
            // alert("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            // alert("The request to get user location timed out.")
            break;
        }
      });
    }
  }

  upload() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    let body = JSON.parse(localStorage.getItem('userData'));
    body['image'] =this.getImage();
    body['lat'] = localStorage.getItem('latitude');
    body['lng'] = localStorage.getItem('longitude');
    let reportURL = '';
    if (process.env.NODE_ENV !== 'production') {
      reportURL = environment.config.serverBaseURL[1];
    } else {
      reportURL = environment.config.serverBaseURL[0];
    }
    console.log(reportURL);
    console.log(body);
    //until support service will work, just replace line in db
    this.http.post(reportURL.toString() + '/api/login/signup', body, options).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });    
  }
}