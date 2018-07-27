import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LayersService} from '../../../services/layers.service';
import {addMarkerWithIcon, Marker} from '../../models/Marker';
import {isNullOrUndefined} from 'util';
import {ReportService} from '../../../services/report.service';
import {} from '@types/googlemaps';
import {HttpClient} from '@angular/common/http';
import {AgmMap} from '@agm/core';
import {findClosestMarker} from './findClosestPlace';
import {EVENT_TYPES} from '../../constants/EVENT_TYPES';

declare var google: any;

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})

export class MapPageComponent implements OnInit, AfterViewInit {

  @ViewChild('AgmMap') agmMap: AgmMap;

  private currentLocation: any = null;
  lat: number = null;
  lng: number = null;
  zoom: number = 14;
  markers: Marker[] = [];
  currentLocationMarker: Marker = new Marker();
  selectedLocationMarker: Marker = new Marker();
  mapTypeId: string = 'roadmap';
  googleMap: google.maps.Map = null;
  locationName:string;

  EVENT_TYPE_BUTTON = EVENT_TYPES;

  eventType = null;

  googleMapsClient: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private layersService: LayersService,
              private httpClient: HttpClient,
              private reportService: ReportService) {
  }

  ngOnInit() {
    this.initializeCurrentLocation();
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
      let marker = addMarkerWithIcon(report.lat, report.lng, 'assets/new-design-assets/fire-pointer.svg');
      marker.markerType = 'fire';
      marker.content = report;
      this.markers.push(marker);
    });

    users.forEach((user) => {
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
        if (this.isCurrentLocationMarkerInitialized()) {
          this.currentLocationMarker = addMarkerWithIcon(this.lat, this.lng, 'assets/circle-16.png');
        }
        if (!this.isSelectedLocationValid()) {
          this.setSelectedLongitude(this.currentLocation.longitude.toString());
          this.setSelectedLatitude(this.currentLocation.latitude.toString());
        }
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

  initializeCurrentLocation() {
    this.currentLocation = this.reportService.getCurrentLocationCoordinates();
    this.lat = this.reportService.getCurrentLocationCoordinates().latitude;
    this.lng = this.reportService.getCurrentLocationCoordinates().longitude;
    this.centerMap();
  }

  centerMap() {
    this.zoom = 14;
  }

  goToCommentScreen() {
    this.reportService.setSelectedLocationCoordinates(this.selectedLocationMarker.latitude, this.selectedLocationMarker.longitude);
    this.router.navigate(['/comment']);
  }

  mapClicked($event: MouseEvent) {
    this.setSelectedLocation($event['coords']['lat'], $event['coords']['lng']);
    this.getClosestPolitical();
  }

  setSelectedLocation(latitude: number, longitude: number) {
    let marker = new Marker();
    marker.latitude = Number(latitude.toFixed(6));
    marker.longitude = Number(longitude.toFixed(6));
    this.selectedLocationMarker = marker;
  }

  isSelectedLocationValid() {
    return !isNullOrUndefined(this.selectedLocationMarker.latitude) && !isNullOrUndefined(this.selectedLocationMarker.longitude);
  }

  isCurrentLocationMarkerInitialized() {
    return !isNullOrUndefined(this.currentLocationMarker.latitude) && !isNullOrUndefined(this.currentLocationMarker.longitude);
  }

  setSelectedLatitude(latitude: string) {
    this.selectedLocationMarker.latitude = Number(latitude);
    if (this.isSelectedLocationValid()) {
      this.setCenterOfMapBySelectedLocation();
      this.centerMap();
      this.getClosestPolitical();
    }

  }

  setSelectedLongitude(longitude: string) {
    this.selectedLocationMarker.longitude = Number(longitude);
    if (this.isSelectedLocationValid()) {
      this.setCenterOfMapBySelectedLocation();
      this.centerMap();
      this.getClosestPolitical();
    }
  }

  setCenterOfMapBySelectedLocation() {
    this.lat = this.selectedLocationMarker.latitude;
    this.lng = this.selectedLocationMarker.longitude;
  }


  mapReady($event: any) {
    // here $event will be of type google.maps.Map
    // and you can put your logic here to get lat lng for marker. I have just put a sample code. You can refactor it the way you want.
    this.googleMap = $event;
  }

  getClosestPolitical() {
    const request = {
      location: {lat: this.selectedLocationMarker.latitude, lng: this.selectedLocationMarker.longitude},
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

  getClosestRoad(){
    const roadRequest = {
      location: {lat: this.selectedLocationMarker.latitude, lng: this.selectedLocationMarker.longitude},
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
    const road = findClosestMarker({lat: this.selectedLocationMarker.latitude, lng: this.selectedLocationMarker.longitude}, results);
    return road;
  }

  filterClosestPlace(results) {
    const place = findClosestMarker({lat: this.selectedLocationMarker.latitude, lng: this.selectedLocationMarker.longitude}, results);
    return place;
  }

  changeEventType(eventType) {
    this.eventType = eventType;
  }

  getMarkerIconByEventType() {
    switch (this.eventType) {
      case this.EVENT_TYPE_BUTTON.BALLOON:
        return 'assets/new-design-assets/balloon-pointer.svg';
      case this.EVENT_TYPE_BUTTON.FIRE:
        return 'assets/new-design-assets/fire-pointer.svg';
      case this.EVENT_TYPE_BUTTON.KITE:
        return 'assets/new-design-assets/kite-pointer.svg';
      default:
        return 'assets/new-design-assets/ya-pointer.svg';
    }
  }

  isReportValid(){
    return this.isSelectedLocationValid() && this.eventType !== null;
  }

  completeReport(){
    this.router.navigate([`/sending-report/${this.eventType}`])
  }

}
