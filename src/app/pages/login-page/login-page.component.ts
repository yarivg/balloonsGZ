import { Component, OnInit } from '@angular/core';
import { request } from 'https';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})


export class LoginPageComponent {

  authService: AuthService;

  constructor(private router: Router,private authSrv: AuthService) {
    this.authService = authSrv;
  }

  checkLogin() {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // The user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire.
        localStorage.setItem('accessToken', response.authResponse.accessToken);
        FB.api('/me', { fields: ['name', 'picture', 'email'] }, function (response) {
          localStorage.setItem('name', response.name);
          localStorage.setItem('uid', response.id);
          localStorage.setItem('picture', response.picture.data.url);
          localStorage.setItem('email', response.email);
        });
      }
    })

    let token = this.authService.sendAuthReq()
    localStorage.setItem('token', token);
    this.router.navigate(['/home']);

  }
  public getUser(socialPlatform: string) {

  }

}
