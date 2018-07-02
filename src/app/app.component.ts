import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { IAppState } from './store';
import { USER_GET } from './store/profile/profile.actions';
import { ISimpleResponse } from './shared/interfaces/simple.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  location = {};
  observable$: Observable<ISimpleResponse>;

  constructor(private http: HttpClient, private store: Store<IAppState>) {}

  setPosition(position){
    // this.location = position.coords;
    console.log(position.coords);
  }

  ngOnInit() {

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition);
    };

    this.observable$ = this.http.get<ISimpleResponse>('/api/public/simple');

    this.store.dispatch({
      type: USER_GET
    });
  }

  // camera
  @ViewChild('video') video:any; 
// note that "#video" is the name of the template variable in the video element

ngAfterViewInit() {
  let _video=this.video.nativeElement;
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
                          .then(stream => {
                            _video.src = window.URL.createObjectURL(stream);
                            _video.play();
                          })
  }
}
}
