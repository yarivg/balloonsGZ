import * as environment from '../../.configenv';
import {
  FacebookLoginProvider, AuthServiceConfig, GoogleLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  private _window: any;
  constructor(private http: HttpClient, private router: Router) {
    this._window = window;
  }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    if (['undefined', '', null, undefined].includes(token)) {
      console.log('no token go to login')
      return false;
    }
    else {/*
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const expirationDate = helper.getTokenExpirationDate(token);
  
      if (helper.isTokenExpired(token))
        return false;*/

      return true;
    }
  }
  public sendAuthReq() {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    const body = JSON.parse(localStorage.getItem('userData'));
    let reportURL = '';
    if (process.env.NODE_ENV !== 'production') {
      reportURL = environment.config.serverBaseURL[1];
    } else {
      reportURL = environment.config.serverBaseURL[0];
    }
    this.http.post(reportURL.toString() + `/api/login/signup`, body, options).subscribe(data => {
      console.log(data);
      localStorage.setItem('token', data['token']);
      this.router.navigate(['/home']);
    }, error => {
      console.error(error);
    });
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
