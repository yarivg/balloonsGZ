import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {AppComponent} from './app.component';
import {routes} from './app.router';
import {environment} from '../environments/environment';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { CapturePageComponent } from './pages/capture-page/capture-page.component';
import { reportRouter } from '../../server/routes/report';
import { ReportService } from '../services/report.service';
import { CommentPageComponent } from './pages/comment-page/comment-page.component';
import { EndingPageComponent } from './pages/ending-page/ending-page.component';
import { SupportPageComponent } from './pages/support-page/support-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {MapPageComponent} from './pages/map-page/map-page.component';
import {LayersService} from '../services/layers.service';
import {SupportService} from '../services/support.service';
import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';
import {MarkerDescriptionComponent} from './pages/map-page/marker-description/marker-description.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {AuthServiceConfig, SocialLoginModule} from 'angular-6-social-login';
import {getAuthServiceConfig} from '../services/auth.service';
import {AuthService} from '../services/auth.service';
import {AuthGuardService} from '../services/auth-guard.service';
import {FacebookModule} from "ngx-facebook";
// import { MapPageComponent } from './pages/map-page/map-page.component';
// import { CommentPageComponent } from './pages/comment-page/comment-page.component';

const APP_COMPONENTS = [
  HomePageComponent,
  CapturePageComponent,
  CommentPageComponent,
  EndingPageComponent,
  MapPageComponent,
  MarkerDescriptionComponent,
  LoginPageComponent,
  SupportPageComponent
];

const APP_SERVICES = [
  LayersService,
  ReportService,
  SupportService,
  AuthService,
  AuthGuardService
];

const APP_MODULES = [
  FacebookModule.forRoot(),
  BrowserModule,
  FormsModule,
  SocialLoginModule,
  HttpClientModule,
  HttpModule
];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_COMPONENTS
  ],
  imports: [
    ...APP_MODULES,
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : [],
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAYT3aC83fuuZNXhGZj-SHPTvaLoooAK6c'
    }),
    RouterModule.forRoot(
      routes,
      {
        useHash: true
      }
    ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [...APP_SERVICES,
    {provide: AuthServiceConfig,
      useFactory: getAuthServiceConfig}],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
