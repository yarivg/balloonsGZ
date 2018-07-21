import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {} from '@types/googlemaps';
import {Router} from '@angular/router';
import {LayersService} from '../../../services/layers.service';
import {RolesPipe} from '../../pipes/roles.pipe';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})

export class MapPageComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmap: any;

  private rolesPipe = new RolesPipe();
  private map: any;
  private map_objects: {};
  private location: any;
  private myLocation: any = null;
  private marker: google.maps.Marker;

  constructor(private router: Router, private layersService: LayersService) {
  }

  ngOnInit() {

    const options = {
      zoom: 4,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_CENTER
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, options);
    this.layersService.getLayers()
      .then(res => {
        const responseBody = JSON.parse(res['_body']);
        this.addStatusToMap(responseBody);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    google.maps.event.addListener(this.map, 'click', (event) => {
      if (this.marker) {
        this.marker.setPosition(event.latLng);
      } else {
        this.marker = new google.maps.Marker({position: event.latLng, map: this.map});
      }
    });

    if (this.myLocation) {
      this.centerMap();
    } else {
      this.getLocation();
    }
  }

  ngAfterViewInit() {
    if (this.myLocation) {
      this.centerMap();
    } else {
      this.getLocation();
    }
  }

  setCenterMap() {
    if (this.myLocation) {
      this.centerMap();
    } else {
      this.getLocation();
    }
  }

  addStatusToMap(responseBody: any) {
    const reports = responseBody['reports'];
    const users = responseBody['users'];
    const infowindow = new google.maps.InfoWindow();
    for (let i = 0; i < reports.length; i++) {
      const latLng = {'lat': reports[i].lat, 'lng': reports[i].lng};
      const marker = new google.maps.Marker({
        position: latLng,
        icon: 'assets/icons/fire-marker-icon.png',
      });
      marker.set('type', 'fire');
      marker.setMap(this.map);

      this.makeInfoWindowEvent(this.map, infowindow, reports[i], marker);
    }
    for (let i = 0; i < users.length; i++) {
      const latLng = {'lat': users[i].lat, 'lng': users[i].lng};
      const marker = new google.maps.Marker({
        position: latLng,
        icon: 'assets/icons/' + users[i].role + '-icon.png',
      });
      marker.set('type', 'troop');
      marker.setMap(this.map);

      this.makeInfoWindowEvent(this.map, infowindow, users[i], marker);
    }
  }

  makeInfoWindowEvent(map, infowindow, contentObject, marker) {
    const that = this;
    google.maps.event.addListener(marker, 'click', () => {
      let contentString;
      switch (marker.get('type')) {
        case 'fire':
          contentString = that.createInfoOnFire(contentObject);
          break;

        case 'troop':
          contentString = that.createInfoOnTroop(contentObject);
          break;
      }
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
  }

  createInfoOnFire(contentObject) {
    return '<h5>שריפה </h5>' +
    'נ.צ: ' + '(' + contentObject.lat + ',' + contentObject.lng + ') <br/>' +
      'דווח ב: ' + new Date(contentObject.timestamp).toString() + ' <br/>';
  }

  createInfoOnTroop(contentObject) {
    debugger;
    return '<h5>' + this.rolesPipe.transform(contentObject.role) + '</h5>' +
    'נ.צ: ' + '(' + contentObject.lat + ',' + contentObject.lng + ') <br/>' +
      'דווח לאחרונה: ' + new Date(contentObject.timestamp).toString() + ' <br/>';
  }

  getLocation() {
    const icon = {
      scale: 10,
      strokeWeight: 2,
      strokeOpacity: 2,
      strokeColor: '',
      rotation: 0,
      fillOpacity: 1,
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'blue',
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(((position) => {
        this.location = position.coords;
        console.log(this.location);
        this.myLocation = new google.maps.LatLng(this.location.latitude, this.location.longitude);
        const myLocationIcon = new google.maps.Marker({position: this.myLocation, map: this.map, icon});
        this.centerMap();
      }), (error) => {
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
    this.map.panTo(this.myLocation);
    this.map.setZoom(16);
  }

  goToCommentScreen() {
    this.router.navigate(['/comment']);
  }
}
