import {UserSupportImage} from './UserSupportImage';

export class FacebookReport {
  id: string;
  facebookId: string;
  phoneNumber: string;
  userSupportImage: UserSupportImage;

  constructor(id: string, facebookId: string, phoneNumber: string,
              imageBase64: string, lat: number, lng: number) {
    this.id = id;
    this.facebookId = facebookId;
    this.phoneNumber = phoneNumber;
    this.userSupportImage = new UserSupportImage(imageBase64, lat, lng);
  }
}
