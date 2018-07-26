import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LayersService} from '../../../services/layers.service';
import {addMarkerWithIcon, Marker} from '../../models/Marker';
import {isNullOrUndefined} from 'util';
import {ReportService} from '../../../services/report.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})

export class MapPageComponent implements OnInit, AfterViewInit {

  private currentLocation: any = null;
  lat: number = null;
  lng: number = null;
  zoom: number = 14;
  markers: Marker[]=[];
  currentLocationMarker:Marker = new Marker();
  selectedLocationMarker:Marker = new Marker();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private layersService: LayersService,
              private reportService:ReportService) {
  }

  ngOnInit() {
    this.lat = +this.route.snapshot.params['lat'];
    this.lng = +this.route.snapshot.params['lng'];

    this.layersService.getLayers()
      .then(res => {
        const responseBody = JSON.parse(res['_body']);
        this.addStatusToMap(responseBody);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    this.getLocation();
    this.centerMap();
  }

  ngAfterViewInit() {
    this.getLocation();
    this.centerMap();
  }

  setCenterMap() {
    if (this.currentLocation) {
      this.centerMap();
    } else {
      this.getLocation();
    }
  }

  addStatusToMap(responseBody: any) {
    const reports = responseBody['reports'];
    const users = responseBody['users'];
    reports.forEach((report)=>{
      let marker = addMarkerWithIcon(report.lat, report.lng, 'assets/icons/fire-marker-icon.png');
      marker.markerType = 'fire';
      marker.content = report;
      this.markers.push(marker);
    });

    users.forEach((user)=>{
      let marker = addMarkerWithIcon(user.lat, user.lng, `assets/icons/${user.role}-icon.png`);
      marker.markerType = 'troop';
      marker.content = user;
      this.markers.push(marker);
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.currentLocation = position.coords;
        this.currentLocationMarker = addMarkerWithIcon(this.lat, this.lng, 'assets/circle-16.png');
        this.centerMap();
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log('User denied the request for Geolocation.');
            this.getLocation();
            break;
          case error.POSITION_UNAVAILABLE:
            console.log('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.log('The request to get user location timed out.');
            break;
        }
      });
    }
  }

  centerMap() {
    this.zoom = 14;
  }

  setCenterOfMapBySelectedLocation(){
    this.lat = this.selectedLocationMarker.latitude;
    this.lng = this.selectedLocationMarker.longitude;
  }

  goToCommentScreen() {
    this.reportService.setSelectedLocationCoordinates(this.selectedLocationMarker.latitude,this.selectedLocationMarker.longitude);
    this.router.navigate(['/comment']);
  }

  mapClicked($event: MouseEvent) {
    this.setSelectedLocation($event['coords']['lat'],$event['coords']['lng']);
  }

  setSelectedLocation(latitude:number,longitude:number){
    let marker = new Marker();
    marker.latitude = Number(latitude.toFixed(6));
    marker.longitude = Number(longitude.toFixed(6));
    this.selectedLocationMarker = marker;
  }

  isSelectedLocationValid(){
    return !isNullOrUndefined(this.selectedLocationMarker.latitude) && !isNullOrUndefined(this.selectedLocationMarker.longitude)
  }

  setSelectedLatitude(latitude:string){
    this.selectedLocationMarker.latitude = Number(latitude);
    if(this.isSelectedLocationValid()){
      this.setCenterOfMapBySelectedLocation();
      this.centerMap();
    }

  }

  setSelectedLongitude(longitude:string){
    this.selectedLocationMarker.longitude = Number(longitude);
    if(this.isSelectedLocationValid()){
      this.setCenterOfMapBySelectedLocation();
      this.centerMap();
    }
  }
}
