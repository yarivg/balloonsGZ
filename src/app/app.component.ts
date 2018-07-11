import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';

import { UserAgentService } from '../services/userAgent.service'

declare var $: any
const isProd = true
// const serverURL = isProd ? 'https://balloon.cf' : 'https://localhost'

@Component({
  moduleId: module.id + "",
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './bootstrap.min.css'],
  providers: [UserAgentService]
})
export class AppComponent implements OnInit {
  @ViewChild('video') video: any
  @ViewChild('gpsLongtitude') gpsLongtitude: any
  @ViewChild('gpsLatitude') gpsLatitude: any
  location: any
  canvas: HTMLCanvasElement
  _window: any
  phoneModal: any
  userPhoneNumber: string = localStorage.getItem('userPhoneNumber')
  fileToUpload: File = null
  description: string = ''
  azimuthWhenCapturing: number = 0
  locationWhenCapturing: any
  currAzimuth: number = 0
  isRelativeAzimuth: boolean = false
  imageBase64: string = ''
  isIOSPhone: boolean = false
  reader: any = new FileReader()

  constructor(private http: HttpClient, private userAgent: UserAgentService) { }

  ngOnInit() {
    this.isIOSPhone = this.userAgent.isiOSPhone()
    this._window = window
    this.currAzimuth = 0
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result
      }

      this.locationWhenCapturing = this.location
      this.azimuthWhenCapturing = this.currAzimuth
      $('#imageModal').modal('show')
    }
  }

  uploadReport() {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    let body = {
      'phone': this.userPhoneNumber,
      'name': 'dunky-monkey',
      'lat': this.location ? this.location.latitude.toString() : '0',
      'lng': this.location ? this.location.longitude.toString() : '0',
      'imageBase64': this.imageBase64,
      'azimuth': this.azimuthWhenCapturing,
      'description': this.description,
      'tag': 'ballloooon'
    }

    this.http.post(`/api/report`, 
                   body,
                   options).subscribe(data => {
      alert("עובדים על זה. תודה.")
      $('#imageModal').modal('hide')
    }, error => {
      console.log(error);
    });
  }

  checkLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(((position) => {
        this.location = position.coords
        console.log(this.locationWhenCapturing)
        document.getElementById("gpsLongtitude").innerText = position.coords.longitude.toString()
        document.getElementById("gpsLatitude").innerText = position.coords.latitude.toString()
        console.log(position.coords);
      }), (error) => {
        var gpsElement = document.getElementById("gpsLongtitude")
        switch (error.code) {
          case error.PERMISSION_DENIED:
            gpsElement.innerHTML = "User denied the request for Geolocation."
            this.checkLocation()
            break;
          case error.POSITION_UNAVAILABLE:
            gpsElement.innerHTML = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            gpsElement.innerHTML = "The request to get user location timed out."
            break;
        }
      })
    }
  }

  ngAfterViewInit() {
    this.initModal()
  }

  startUseCamera() {
    let _video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          _video.src = window.URL.createObjectURL(stream);
          _video.play();
        })
    }
  }

  savePhoneNumber() {
    localStorage.setItem('userPhoneNumber', this.userPhoneNumber)
    this.checkPermissions()

    $('#phoneModal').modal('hide')
  }

  initModal() {
    this.phoneModal = document.getElementById('phoneModal')

    if (!this.userPhoneNumber) {
      this.displayModal()
    } else {
      this.checkPermissions()
    }
  }

  checkPermissions() {
    if (!this.isIOSPhone) {
      this.startUseCamera()
    }

    this.checkLocation()
    this.checkAzimuth()
  }

  displayModal() {
    $('#phoneModal').modal({ backdrop: 'static', keyboard: false })
  }

  capture() {
    const img = document.getElementById('image');
    const video = document.querySelector('video');

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    this.imageBase64 = canvas.toDataURL('image/webp')
    img.setAttribute("src", this.imageBase64);
    img.style.width = "75%"
    img.style.height = "75%"

    this.locationWhenCapturing = this.location
    this.azimuthWhenCapturing = this.currAzimuth

    $('#imageModal').modal('show')
  }

  checkAzimuth() {
    // Check if device can provide absolute orientation data
    if ('DeviceOrientationAbsoluteEvent' in window) {
      window.addEventListener("DeviceOrientationAbsoluteEvent", (event: any) => {
        this.deviceOrientationHandler(event)
      })
    } // If not, check if the device sends any orientation data
    else if ('DeviceOrientationEvent' in window) {
      window.addEventListener("deviceorientation", (event: any) => {
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
      this.isRelativeAzimuth = true
    }
  }
}
