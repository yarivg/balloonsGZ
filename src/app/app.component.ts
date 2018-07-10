import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Store} from '@ngrx/store';
import {IAppState} from './store';
import {USER_GET} from './store/profile/profile.actions';
import {ISimpleResponse} from './shared/interfaces/simple.interface';

declare var $: any;

@Component({
  moduleId: module.id + '',
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
  rightPhone: boolean;
  canvas: HTMLCanvasElement;
  _window: any;
  phoneModal: any;
  userPhoneNumber: string = localStorage.getItem('userPhoneNumber');
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";


  constructor(private http: HttpClient, private store: Store<IAppState>) {
  }

  ngOnInit() {

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(((position) => {
        document.getElementById('gpsLongtitude').innerText = position.coords.longitude.toString();
        document.getElementById('gpsLatitude').innerText = position.coords.latitude.toString();
        console.log(position.coords);
      }));
    }
    const target = document.getElementById('target');


    function appendLocation(location) {
      document.getElementById('gpsLongtitude').innerText = location.coords.longitude;
      document.getElementById('gpsLatitude').innerText = location.coords.latitude;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (location) {
        appendLocation(location);
      });
      navigator.geolocation.watchPosition(appendLocation);
    }

    this.isImageCaptured = false;
    this._window = window;
    this.setCanvas();
    this.rightPhone = false;
  }

  ngAfterViewInit() {
    this.initModal();
  }

  startUseCamera() {
    const _video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}})
        .then(stream => {
          _video.src = window.URL.createObjectURL(stream);
          _video.play();
        });
    }
  }

  savePhoneNumber() {
    var phone = $("#phone").val();

    if (phone.match(/^\d+$/)) {
      if (phone.toString().length === 10) {
        localStorage.setItem('userPhoneNumber', this.userPhoneNumber);
        this.startUseCamera();
        this.ngOnInit();
        this.checkNorth();
        $('#phoneModal').modal('hide');
      }
      else {
        this.rightPhone = true;
        this.userPhoneNumber = '';
        this.displayModal();
      }
    }
    else {
      this.rightPhone = true;
      this.userPhoneNumber = '';
      this.displayModal();
    }
  }


  initModal() {
    this.phoneModal = document.getElementById('phoneModal');

    if (!this.userPhoneNumber) {
      this.displayModal();
    } else {
      this.startUseCamera();
      this.ngOnInit();
      this.checkNorth();
    }
  }

  displayModal() {
    $('#phoneModal').modal({backdrop: 'static', keyboard: false});
  }

  setCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 100;
    this.canvas.height = 100;
    this.canvas.style.position = 'absolute';

    this.canvas.style.top = '25%';
    this.canvas.style.left = '25%';
    this.canvas.style.width = '50%';
    this.canvas.style.height = '50%';
  }

  generateThumbnail() {
    this.isImageCaptured = true;

    let videoElement = <HTMLCanvasElement>document.getElementById('video');
    videoElement = document.getElementById('video') as HTMLCanvasElement;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, 100, 100);

    document.body.appendChild(this.canvas);
  }

  upload() {
    window.alert('uploading image. thank you!');
    console.log('uploaded');
  }

  resetCamera() {
    this.isImageCaptured = false;
    console.log('resetting camera');
    document.body.removeChild(this.canvas);
  }

  checkNorth() {
    // Check if device can provide absolute orientation data
    if ('DeviceOrientationAbsoluteEvent' in window) {
      window.addEventListener('DeviceOrientationAbsoluteEvent', this.deviceOrientationListener);
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', this.deviceOrientationListener);
    } else {
      alert('Sorry, try again on a compatible mobile device!');
    }
  }

  deviceOrientationListener(event) {
    let alpha = event.alpha; //z axis rotation [0,360)

    //Check if absolute values have been sent
    if (typeof event.webkitCompassHeading !== 'undefined') {
      alpha = event.webkitCompassHeading; //iOS non-standard
      const heading = alpha;
      document.getElementById('northDegrees').innerHTML = heading.toFixed([0]);
    } else {
      const heading: any = 360 - alpha; //heading [0, 360)
      document.getElementById('northDegrees').innerHTML = heading.toFixed([0]).toString() + '(relavtive north)';
    }
  }
}
