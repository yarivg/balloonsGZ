import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-version-alert',
  templateUrl: './new-version-alert.component.html',
  styleUrls: ['./new-version-alert.component.scss']
})
export class NewVersionAlertComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewVersionAlertComponent>) { }

  ngOnInit() {
  }

  updateVersion(){
    window.location.reload();
    this.dialogRef.close('OK');
  }

}
