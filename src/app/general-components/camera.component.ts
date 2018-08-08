import {Component, EventEmitter, Output} from '@angular/core';

declare var $: any;

@Component({
  selector:'camera',
  template:`
    <input id="file" type="file" class="load-image-button" accept="image/*" capture="camera" (change)="captureImage($event)">
  `
})
export class CameraComponent {

  @Output() takenImage:EventEmitter<any> = new EventEmitter<any>();

  constructor(){

  }

  cameraButtonClicked() {
    // activate camera
    $('input').click();
  }

  captureImage(image){
    this.takenImage.emit(image);
  }
}
