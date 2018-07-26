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

  public getAzimuth() {
    return this.currAzimuth;
  }

  public setCategory(catValue: string) {
    this.category = catValue;
  }

  public setWhatsappSharingUrl(whatsappSharingUrl: string) {
    this.whatsappSharingUrl = whatsappSharingUrl;
  }

  public getWhatsappSharingUrl() {
    return this.whatsappSharingUrl;
  }

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

  /**
   * pauses watching user location
   */
  clearWatching() {
    navigator.geolocation.clearWatch(this.watchPosId);
  }

  /**
   *  Watches user azimuth for his report
   */
  checkAzimuth() {
    // Check if device can provide absolute orientation data
    if ('DeviceOrientationAbsoluteEvent' in window) {
      this._window.addEventListener('DeviceOrientationAbsoluteEvent', (event: any) => {
        this.deviceOrientationHandler(event);
      });
    } else if ('DeviceOrientationEvent' in window) {
      this._window.addEventListener('deviceorientation', (event: any) => {
        this.deviceOrientationHandler(event);
      });
    } else {
      alert('Sorry, try again on a compatible mobile device!');
    }
  }

  deviceOrientationHandler(event: any) {
    // Check if absolute values have been sent
    if (typeof event.webkitCompassHeading !== 'undefined') {
      this.currAzimuth = event.webkitCompassHeading; // iOS non-standard
    } else {
      this.currAzimuth = 360 - event.alpha;
      // this.isRelativeAzimuth = true
    }
  }

  upload() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    const body = {
      'image': this.getImage(),
      'lat':  localStorage.getItem('latitude'),
      'lng': localStorage.getItem('longitude'),
      'facebook_id': localStorage.getItem('facebook_id'),
      'token':localStorage.getItem('token'),
    };
    let reportURL = '';
    if (process.env.NODE_ENV !== 'production') {
      reportURL = environment.config.serverBaseURL[1];
    } else {
      reportURL = environment.config.serverBaseURL[0];
    }
    console.log(reportURL);
    console.log(body);
    this.http.post(reportURL.toString() + `/api/support`, body, options).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  captureImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result;

        // Hold the image in memory, to be used in the next state(route)
        this.setImage(this.imageBase64);
        this.upload()
        // Move further, to next route
        this.goToSupportMap();
      };
    }
  }

  goToSupportMap() {
    this.router.navigate(['/map']);
  }
}
