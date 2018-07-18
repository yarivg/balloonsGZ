import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {AppComponent} from './app.component';
import {routes} from './app.router';
import {environment} from '../environments/environment';

import {HomePageComponent} from './pages/home-page/home-page.component';
import {CapturePageComponent} from './pages/capture-page/capture-page.component';
import {reportRouter} from '../../server/routes/report';
import {ReportService} from '../services/report.service';
import {CommentPageComponent} from './pages/comment-page/comment-page.component';
import {EndingPageComponent} from './pages/ending-page/ending-page.component';
import {MapPageComponent} from "./pages/map-page/map-page.component";
// import { MapPageComponent } from './pages/map-page/map-page.component';
// import { CommentPageComponent } from './pages/comment-page/comment-page.component';

const APP_COMPONENTS = [
  HomePageComponent,
  CapturePageComponent,
  CommentPageComponent,
  EndingPageComponent,
  MapPageComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : [],
    RouterModule.forRoot(
      routes,
      {
        useHash: true
      }
    )
  ],
  providers: [ReportService],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
