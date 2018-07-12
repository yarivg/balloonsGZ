import { Route } from '@angular/router';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CapturePageComponent } from './pages/capture-page/capture-page.component';
import { CommentPageComponent } from './pages/comment-page/comment-page.component';

const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'capture', component: CapturePageComponent},
  {path: 'comment', component: CommentPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

export { routes }