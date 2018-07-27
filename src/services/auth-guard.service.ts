import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      console.log('no token')
      this.router.navigate(['/login']);
      //connect with facebook or phone number
      return false;
    }
    console.log('yes token')
    return true;
  }

}
