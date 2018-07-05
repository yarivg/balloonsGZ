import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { IAppState } from './store';
import { USER_GET } from './store/profile/profile.actions';
import { ISimpleResponse } from './shared/interfaces/simple.interface';

declare var $: any

@Component({
  moduleId: module.id + "",
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './bootstrap.min.css']
})
export class AppComponent implements OnInit {
  @ViewChild('video') video: any;
  @ViewChild('gpsLongtitude') gpsLongtitude: any;
  @ViewChild('gpsLatitude') gpsLatitude: any;
  location = {};
  observable$: Observable<ISimpleResponse>;
  isImageCaptured: boolean;
  canvas: HTMLCanvasElement;
  _window: any;
  phoneModal: any;
  userPhoneNumber: string = localStorage.getItem('userPhoneNumber')

  constructor(private http: HttpClient, private store: Store<IAppState>) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(((position) => {
        document.getElementById("gpsLongtitude").innerText = position.coords.longitude.toString()
        document.getElementById("gpsLatitude").innerText = position.coords.latitude.toString()
        console.log(position.coords);
      }))
    }

    this.isImageCaptured = false
    this._window = window
    this.setCanvas()
    this.checkGyro()
  }

  ngAfterViewInit() {
    let _video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          _video.src = window.URL.createObjectURL(stream);
          _video.play();
        })
    }

    this.initModal()
  }

  savePhoneNumber() {
    localStorage.setItem('userPhoneNumber', this.userPhoneNumber)
    this.closeModal()
  }

  initModal() {
    this.phoneModal = document.getElementById('phoneModal')

    if (!this.userPhoneNumber) {
      this.displayModal()
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == document.getElementById('phoneModal')) {
        document.getElementById('phoneModal').style.display = "none"
      }
    }
  }

  closeModal() {
    this.phoneModal.style.display = "none";
  }

  displayModal() {
    $("#phoneModal").modal('show')
    // document.getElementById('phoneModal').style.display = "block";
  }

  setCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 100;
    this.canvas.height = 100;
    this.canvas.style.position = "absolute";

    this.canvas.style.top = "25%";
    this.canvas.style.left = "25%";
    this.canvas.style.width = "50%";
    this.canvas.style.height = "50%";
  }

  generateThumbnail() {
    this.isImageCaptured = true;

    var videoElement = <HTMLCanvasElement>document.getElementById("video");
    videoElement = document.getElementById("video") as HTMLCanvasElement;

    var ctx = this.canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, 100, 100);

    document.body.appendChild(this.canvas);
  }

  upload() {
    window.alert('uploading image. thank you!')
    console.log('uploaded')
  }

  resetCamera() {
    this.isImageCaptured = false;
    console.log('resetting camera');
    document.body.removeChild(this.canvas);
  }

  checkGyro() {
    // alert('ondeviceorientationabsolute' in window ? 'ondeviceorientationabsolute' : 'ondeviceorientation')
    // if ('ondeviceorientationabsolute' in window) {
    //   this._window.addEventListener('deviceorientationabsolute', function (event: any) {
    //     document.getElementById('northDegrees').innerText = 
    //           event.alpha ? event.alpha.toString() : 'none'
    //   })
    // } else 
    // if ('ondeviceorientation' in window) {
    //   this._window.addEventListener('deviceorientation', function (event: any) {
    //     alert(JSON.stringify(event))
    //     if (event.webkitCompassHeading) {
    //       document.getElementById('northDegrees').innerText =
    //         event.webkitCompassHeading ? event.webkitCompassHeading.toString() : 'none'
    //     }
    //   })
    // }

    // Check if device can provide absolute orientation data
    if('DeviceOrientationAbsoluteEvent' in window) {
      window.addEventListener("DeviceOrientationAbsoluteEvent", this.deviceOrientationListener);
    } // If not, check if the device sends any orientation data
    else if('DeviceOrientationEvent' in window) {
      window.addEventListener("deviceorientation", this.deviceOrientationListener);
    } // Send an alert if the device isn't compatible
    else {
      alert("Sorry, try again on a compatible mobile device!");
    }
  }

  deviceOrientationListener(event) {
    var alpha = event.alpha; //z axis rotation [0,360)

    //Check if absolute values have been sent
    if (typeof event.webkitCompassHeading !== "undefined") {
      alpha = event.webkitCompassHeading; //iOS non-standard
      var heading = alpha
      document.getElementById("northDegrees").innerHTML = heading.toFixed([0]);
    }
    else {
      var heading: any = 360 - alpha; //heading [0, 360)
      document.getElementById("northDegrees").innerHTML = heading.toFixed([0]).toString() + "(relavtive north)";
    }
  }
}
