import { Route } from '@angular/router';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CapturePageComponent } from './pages/capture-page/capture-page.component';
import { CommentPageComponent } from './pages/comment-page/comment-page.component';
import { EndingPageComponent } from './pages/ending-page/ending-page.component';
import {MapPageComponent} from './pages/map-page/map-page.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';

const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'capture', component: CapturePageComponent},
  {path: 'comment', component: CommentPageComponent},
  {path: 'ending', component: EndingPageComponent},
  {path: 'map', component: MapPageComponent},
  {path: 'login', component: LoginPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

export { routes };
