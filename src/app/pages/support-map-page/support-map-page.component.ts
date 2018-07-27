import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayersService } from '../../../services/layers.service';
import { MapService } from '../../../services/map.service';
import { addMarkerWithIcon, Marker } from '../../models/Marker';
import { isNullOrUndefined } from 'util';
import { ReportService } from '../../../services/report.service';
import { } from '@types/googlemaps';
import { HttpClient } from '@angular/common/http';
import { AgmMap } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-support-map-page',
  templateUrl: './support-map-page.component.html',
  styleUrls: ['./support-map-page.component.scss']
})
export class SupportMapPageComponent implements OnInit {

  private currentLocation: any = null;
  lat: number = null;
  lng: number = null;
  zoom: number = 14;
  facebookMarkers: Marker[] = [];
  currentLocationMarker: Marker = new Marker();
  mapTypeId: string = 'satellite';
  googleMap: google.maps.Map = null;
  locationName: string;
  googleMapsClient: any;

  constructor(private mapService: MapService,
    private router: Router,
    private route: ActivatedRoute,
    private layersService: LayersService,
    private httpClient: HttpClient,
    private reportService: ReportService) { }

  ngOnInit() {
    //layer service of balloons
    
    this.layersService.getLayers()
      .then(res => {
        const responseBody = JSON.parse(res['_body']);
        this.addStatusToMap(responseBody);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngAfterViewInit() {
    if (this.currentLocation) {
      this.centerMap();
    } else {
      this.getLocation();
    }
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
    reports.forEach((report) => {
      let marker = addMarkerWithIcon(report.lat, report.lng, 'assets/new-design-assets/balloon-pointer.svg');
      marker.markerType = 'fire';
      marker.content = report;
      this.facebookMarkers.push(marker);
    });

    users.forEach((user) => {
      let marker = addMarkerWithIcon(user.lat, user.lng, `assets/icons/balloon-pointer-icon.png`);
      marker.markerType = 'troop';
      marker.content = user;
      this.facebookMarkers.push(marker);
    });
  }

  isReportValid(){
    return true;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.currentLocation = position.coords;
        this.currentLocationMarker = addMarkerWithIcon(this.lat, this.lng, 'assets/circle-16.png');
        this.getClosestPolitical();
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

  mapReady($event: any) {
    // here $event will be of type google.maps.Map
    // and you can put your logic here to get lat lng for marker. I have just put a sample code. You can refactor it the way you want.
    this.googleMap = $event;
  }
  getClosestPolitical() {
    const request = {
      location: { lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude },
      radius: 1000,
      type: 'political'
    };

    const service = new google.maps.places.PlacesService(this.googleMap);
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        const place = this.filterClosestPlace(results);
        this.locationName = place.name;
      }
      if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        this.getClosestRoad();
      }
    });
  }

  getClosestRoad() {
    const roadRequest = {
      location: { lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude },
      radius: 5000,
      type: 'route'
    };

    const service = new google.maps.places.PlacesService(this.googleMap);

    service.nearbySearch(roadRequest, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        const road = this.filterClosestRoad(results);
        this.locationName = "כביש " + road.name;
      }
      if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        this.locationName = "מיקום ללא שם";
      }
    });
  }

  filterClosestRoad(results) {
    const road = this.mapService.findClosestMarker({ lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude }, results);
    return road;
  }

  filterClosestPlace(results) {
    const place = this.mapService.findClosestMarker({ lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude }, results);
    return place;
  }


}
