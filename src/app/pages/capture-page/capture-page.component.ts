import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-page',
  templateUrl: './capture-page.component.html',
  styleUrls: ['./capture-page.component.css']
})
export class CapturePageComponent implements OnInit, OnDestroy {
  @ViewChild('video') video: any;

  public imageBase64: string = null;
  private reader: any = new FileReader();

  constructor(private router: Router, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initCamera({video: true, audio: false});
  }

  ngOnDestroy() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.pause();
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]);
      this.reader.onload = (e: any) => {
        this.imageBase64 = e.target.result;
        this.cd.detectChanges();
      };
    }
  }

  goToMapScreen() {
    this.router.navigate(['/map']);
  }

  initCamera(config: any) {
    const browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.nativeElement.src = window.URL.createObjectURL(stream);
      this.video.nativeElement.play();
    });
  }
}
