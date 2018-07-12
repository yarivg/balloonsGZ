import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { environment } from '../environments/environment';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { CapturePageComponent } from './pages/capture-page/capture-page.component';
// import { MapPageComponent } from './pages/map-page/map-page.component';
// import { CommentPageComponent } from './pages/comment-page/comment-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CapturePageComponent,
    //MapPageComponent,
    //CommentPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    RouterModule.forRoot(
      routes,
      {
        useHash: true
      }
    )
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
