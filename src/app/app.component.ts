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

    if(!this.userPhoneNumber) {
      this.displayModal()
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
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
    this.canvas.width  = 100;
    this.canvas.height = 100;
    this.canvas.style.position = "absolute";
    
    this.canvas.style.top = "25%";
    this.canvas.style.left = "25%";
    this.canvas.style.width = "50%";
    this.canvas.style.height = "50%";
  }

  generateThumbnail() {
    this.isImageCaptured = true;
    
    var videoElement = <HTMLCanvasElement> document.getElementById("video");
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
    if ('ondeviceorientationabsolute' in window) {
      alert('ondeviceorientationabsolute')
      // We can listen for the new deviceorientationabsolute event.
    } else if ('ondeviceorientation' in window) {
      // We can still listen for deviceorientation events.
      // The `absolute` property of the event tells us whether
      // or not the degrees are absolute.
      alert('ondeviceorientation')
    }

    this._window.addEventListener('deviceorientation', function(event: any) {
      var alpha;
      // Check for iOS property
      if(event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
      }
      // non iOS
      else {
        alpha = event.alpha;
        if(!window['chrome']) {
          // Assume Android stock
          alpha = alpha-270;
        }
      }

      document.getElementById('northDegrees').innerText = alpha ? alpha.toString() : 'none'
    })
    // if (this._window.DeviceMotionEvent) {
    //   window.addEventListener('devicemotion', this.motion, false);
    // } else {
    //   console.log('DeviceMotionEvent is not supported');
    // }
  }

  motion(event) {
    const x = document.getElementById('gyroCordsX');
    const y = document.getElementById('gyroCordsY');
    const z = document.getElementById('gyroCordsZ');

    x.textContent = event.accelerationIncludingGravity.x;
    y.textContent = event.accelerationIncludingGravity.y;
    z.textContent = event.accelerationIncludingGravity.z;
  }
}
