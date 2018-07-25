// import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
// import {Router} from '@angular/router';
// import {LayersService} from '../../../services/layers.service';
// import {addMarkerWithIcon, Marker} from '../../models/Marker';
//
// @Component({
//   selector: 'app-show-support-map-page',
//   templateUrl: './show-support-map-page.component.html',
//   styleUrls: ['./show-support-map-page.component.scss']
// })
//
// export class MapPageComponent implements OnInit, AfterViewInit {
//
//   private currentLocation: any = null;
//   lat: number = null;
//   lng: number = null;
//   zoom = 8;
//   markers: Marker[] = [];
//   currentLocationMarker: Marker = new Marker();
//
//   constructor(private router: Router, private showSupportService: LayersService) {
//   }
//
//   ngOnInit() {
//     this.showSupportService.getMapData()
//       .then(res => {
//         const responseBody = JSON.parse(res['_body']);
//         this.addStatusToMap(responseBody);
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//
//     if (this.currentLocation) {
//       this.centerMap();
//     } else {
//       this.getLocation();
//     }
//   }
//
//   ngAfterViewInit() {
//     if (this.currentLocation) {
//       this.centerMap();
//     } else {
//       this.getLocation();
//     }
//   }
//
//   setCenterMap() {
//     if (this.currentLocation) {
//       this.centerMap();
//     } else {
//       this.getLocation();
//     }
//   }
//
//   addStatusToMap(responseBody: any) {
//     const reports = responseBody['reports'];
//     const users = responseBody['users'];
//     reports.forEach((report) => {
//       const marker = addMarkerWithIcon(report.lat, report.lng, 'assets/icons/fire-marker-icon.png');
//       marker.markerType = 'fire';
//       marker.content = report;
//       this.markers.push(marker);
//     });
//
//     users.forEach((user) => {
//       const marker = addMarkerWithIcon(user.lat, user.lng, `assets/icons/${user.role}-icon.png`);
//       marker.markerType = 'troop';
//       marker.content = user;
//       this.markers.push(marker);
//     });
//   }
//
//   getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         this.lat = position.coords.latitude;
//         this.lng = position.coords.longitude;
//         this.currentLocation = position.coords;
//         this.currentLocationMarker = addMarkerWithIcon(this.lat, this.lng, 'assets/circle-16.png');
//         this.centerMap();
//       }, (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             console.log('User denied the request for Geolocation.');
//             this.getLocation();
//             break;
//           case error.POSITION_UNAVAILABLE:
//             console.log('Location information is unavailable.');
//             break;
//           case error.TIMEOUT:
//             console.log('The request to get user location timed out.');
//             break;
//         }
//       });
//     }
//   }
//
//   centerMap() {
//     this.zoom = 8;
//   }
//
//   goToCommentScreen() {
//     this.router.navigate(['/comment']);
//   }
//
//   mapClicked($event: MouseEvent) {
//     const marker = new Marker();
//     marker.latitude = $event['coords']['lat'];
//     marker.longitude = $event['coords']['lng'];
//     this.selectedLocationMarker = marker;
//   }
// }
