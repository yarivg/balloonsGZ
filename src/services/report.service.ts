import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {environment} from '../environments/environment';

@Injectable()
export class ReportService {
    private image: string = null
    private _window: any
    private watchPosId: number

    public currLocation: any
    private currAzimuth: number = 0
    private whatsappSharingUrl: string = ''

    // report data
    private category: string = '11'
    private imageBase64: string = ''
    private reader: any = new FileReader()

    private id = ''
    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }

    public getAzimuth() {
        return this.currAzimuth
    }

    public setCategory(catValue: string) {
        this.category = catValue
    }

    public setWhatsappSharingUrl(whatsappSharingUrl: string) {
        this.whatsappSharingUrl = whatsappSharingUrl
    }

    public getWhatsappSharingUrl() {
        return this.whatsappSharingUrl
    }

    constructor(private http: HttpClient, private router: Router) {
        this._window = window
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
        return this.image
    }


    /**
     *  Watches user location for his report
     */
    checkLocation() {
        if (navigator.geolocation) {
            this.watchPosId = navigator.geolocation.watchPosition(((position) => {
                this.currLocation = position.coords
                console.log(position.coords)
            }), (error) => {
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
            })
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
            this._window.addEventListener("DeviceOrientationAbsoluteEvent", (event: any) => {
                this.deviceOrientationHandler(event)
            })
        } // If not, check if the device sends any orientation data
        else if ('DeviceOrientationEvent' in window) {
            this._window.addEventListener("deviceorientation", (event: any) => {
                this.deviceOrientationHandler(event)
            });
        } // Send an alert if the device isn't compatible
        else {
            alert("Sorry, try again on a compatible mobile device!");
        }
    }

    deviceOrientationHandler(event: any) {
        //Check if absolute values have been sent
        if (typeof event.webkitCompassHeading !== "undefined") {
            this.currAzimuth = event.webkitCompassHeading; //iOS non-standard
        }
        else {
            this.currAzimuth = 360 - event.alpha
            // this.isRelativeAzimuth = true
        }
    }

    
    upload(description: string) {
        let body = {
            'lat': this.currLocation ? this.currLocation.latitude.toString() : '0',
            'lng': this.currLocation ? this.currLocation.longitude.toString() : '0',
            'azimuth': this.currAzimuth,
        }

        this.http.post(`/api/report`, body, this.options).subscribe(data => {
            this.id = data['id']
            // this.router.navigate(['/map']);
        }, error => {
            console.log(error)
            // this.router.navigate(['/map']);
        });
    }

    update(description: string) {
        let body = {
            'id': this.id,
            'name': 'WEB-REPORTER',
            'imageBase64': this.image,
            'description': description,
            'category': '11',// TODO - balloon, kite, fire
            'userToken': localStorage.getItem('userToken')
        }
        this.http.post(`/api/report/update`, body, this.options).subscribe(data => {

            // this.router.navigate(['/map']);
        }, error => {
            console.log(error)
            // this.router.navigate(['/map']);
        });
    }

  captureImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result;

        // Hold the image in memory, to be used in the next state(route)
        this.setImage(this.imageBase64);

        // Move further, to next route
        this.goToCommentScreen();

        // as of now - immediately create a report to the server, description is ''
        this.upload('');
      }
    }
  }

  goToCommentScreen() {
    this.router.navigate(['/comment']);
  }
}
