import * as environment from '../../configenv';
import {
  FacebookLoginProvider, AuthServiceConfig, GoogleLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';

export class AuthService {

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    return true;
  }
}
export function getAuthServiceConfig() {
  let config;
  if (process.env.NODE_ENV !== 'production') {
    config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(environment.config.facebook_app_id[1])
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.config.google_app_id[1])
        },
        {
          id: LinkedinLoginProvider.PROVIDER_ID,
          provider: new LinkedinLoginProvider(environment.config.linkedin_app_id[1])
        },
      ],
  );
  } else {
    config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(environment.config.facebook_app_id[0])
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.config.google_app_id[0])
        },
        {
          id: LinkedinLoginProvider.PROVIDER_ID,
          provider: new LinkedinLoginProvider(environment.config.linkedin_app_id[0])
        },
      ],
  );
  }
  return config;
}
