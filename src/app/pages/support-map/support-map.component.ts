import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayersService } from '../../../services/layers.service';
import { addMarkerWithIcon, Marker } from '../../models/Marker';
import { isNullOrUndefined } from 'util';
import { ReportService } from '../../../services/report.service';
import { } from '@types/googlemaps';
import { HttpClient } from '@angular/common/http';
import { AgmMap } from '@agm/core';
import { findClosestMarker } from '../map-page/findClosestPlace';
import { EVENT_TYPES } from '../../constants/EVENT_TYPES';

declare var google: any;

@Component({
    selector: 'app-support-map',
    templateUrl: './support-map.component.html',
    styleUrls: ['./support-map.component.scss']
})

export class SupportMapComponent implements OnInit, AfterViewInit {

    @ViewChild('AgmMap') agmMap: AgmMap;

    private currentLocation: any = null;
    lat: number = null;
    lng: number = null;
    zoom: number = 14;
    markers: Marker[] = [];
    currentLocationMarker: Marker = new Marker();
    mapTypeId: string = 'roadmap';
    googleMap: google.maps.Map = null;
    locationName: string;

    EVENT_TYPE_BUTTON = EVENT_TYPES;

    eventType = this.EVENT_TYPE_BUTTON.BALLOON;

    googleMapsClient: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private layersService: LayersService,
        private httpClient: HttpClient,
        private reportService: ReportService) {
    }

    ngOnInit() {
        this.getLocation();
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


    addStatusToMap(responseBody: any) {
        const reports = responseBody['reports'];
        reports.forEach((report) => {
            let marker = addMarkerWithIcon(report.lat, report.lng, 'assets/new-design-assets/balloon-pointer.svg');
            marker.markerType = 'balloon';
            marker.content = report;
            this.markers.push(marker);
        });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.currentLocation = position.coords;
                if (!this.isCurrentLocationMarkerInitialized()) {
                    this.currentLocationMarker = addMarkerWithIcon(this.lat, this.lng, 'assets/new-design-assets/balloon-pointer.svg');
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
        this.centerMap();
    }
    centerMap() {
        this.zoom = 14;
    }

    goToCommentScreen() {
        this.router.navigate(['/comment']);
    }

    mapClicked($event: MouseEvent) {
        this.getClosestPolitical();
    }

    isCurrentLocationMarkerInitialized() {
        return !isNullOrUndefined(this.currentLocationMarker.latitude) && !isNullOrUndefined(this.currentLocationMarker.longitude);
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
        const road = findClosestMarker({ lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude }, results);
        return road;
    }

    filterClosestPlace(results) {
        const place = findClosestMarker({ lat: this.currentLocationMarker.latitude, lng: this.currentLocationMarker.longitude }, results);
        return place;
    }

    changeEventType(eventType) {
        this.eventType = eventType;
    }

    getMarkerIconByEventType() {
        return 'assets/new-design-assets/balloon-pointer.svg';
    }

    isReportValid() {
        return this.isCurrentLocationMarkerInitialized() && this.eventType !== null;
    }

    completeReport() {
        this.router.navigate([`/sending-report/${this.eventType}`])
    }
}