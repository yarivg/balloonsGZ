import { Route } from '@angular/router';

import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CapturePageComponent } from './pages/capture-page/capture-page.component';
import { CommentPageComponent } from './pages/comment-page/comment-page.component';
import { EndingPageComponent } from './pages/ending-page/ending-page.component';
import {MapPageComponent} from './pages/map-page/map-page.component';
import {SupportMapPageComponent} from './pages/support-map-page/support-map-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { SendingReportPageComponent} from './pages/sending-report-page/sending-report-page.component';
const routes: Routes = [
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: 'capture', component: CapturePageComponent, canActivate: [AuthGuard] },
  { path: 'comment', component: CommentPageComponent, canActivate: [AuthGuard] },
  { path: 'sending-report/:event-type', component: SendingReportPageComponent, canActivate: [AuthGuard] },
  { path: 'ending', component: EndingPageComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapPageComponent, canActivate: [AuthGuard] },
  { path: 'support-map', component: SupportMapPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

export { routes };
