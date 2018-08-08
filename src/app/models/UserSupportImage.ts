export class UserSupportImage {
  image: String;
  lat: number;
  lng: number;

  constructor(imageBase64:string, lat:number, lng:number){
    this.image = imageBase64;
    this.lat = lat;
    this.lng = lng;
  }
}
