import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component'
import { CameraOpenerComponent } from './cameraOpener/cameraOpener.component'
import { UploadReportComponent } from './uploadReport/uploadReport.component'

import { routes } from './app.router';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CameraOpenerComponent,
    UploadReportComponent
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
