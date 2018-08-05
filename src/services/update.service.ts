import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MatDialog} from '@angular/material';
import {NewVersionAlertComponent} from '../app/general-components/new-version-alert/new-version-alert.component';

@Injectable()
export class UpdateService {

  constructor(private swUpdate:SwUpdate, public dialog: MatDialog){
    swUpdate.available.subscribe(()=>{
      alert("האפליקציה עודכנה לגרסה חדשה!");
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewVersionAlertComponent, {
      width: '250px',
    });
  }
}
