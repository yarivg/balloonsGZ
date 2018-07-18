import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {} from '@types/googlemaps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmap: any;

  private map: any;
  private location: any;
  private myLocation: any = null;
  private marker: google.maps.Marker;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const center = new google.maps.LatLng(0, 0);
    const mapTypeId = google.maps.MapTypeId.HYBRID;
    const zoom = 4;

    this.map = new google.maps.Map(this.gmap.nativeElement, {zoom, mapTypeId, center});

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
