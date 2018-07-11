import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'camera-opener-component',
  templateUrl: './cameraOpenerComponent.component.html',
  styleUrls: []
})
export class CameraOpenerComponent {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['upload'])
    }, 2000)
  }
}
