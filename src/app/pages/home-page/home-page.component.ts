import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, Params} from '@angular/router'
import { ReportService } from '../../../services/report.service'

declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit{

  private reader: any = new FileReader()
  public imageBase64: string = null

  constructor(private router: Router, private reportSrv: ReportService) {
    let splitString = window.location.href.split('entry=')

    if(splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
      localStorage.setItem('userToken', splitString[1])
    }
  }

  ngOnInit() {
    this.reportSrv.checkLocation()
    this.reportSrv.checkAzimuth()

    $('.home-page').css('display', 'none');
  }

  // Handle loading screen div and homepage, in such a way
  // that simulates a real loading screen
  ngAfterViewInit() {
    let loadingscreen = $('#loading');
    let homescreen = $('.home-page');
    setTimeout(function () {
      loadingscreen.fadeOut();
      homescreen.fadeIn();
    }, 1500)
  }

  goToMapScreen() {
    this.router.navigate(['/map']);
  }

  buttonClicked() {
    // activate camera
    $('input').click();
  }

  captureImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result;

        // Hold the image in memory, to be used in the next state(route)
        this.reportSrv.setImage(this.imageBase64);

        // as of now - immediately create a report to the server, description is ''
        this.reportSrv.upload('');

        // Move further, to next route
        this.goToMapScreen();
      }
    }
  }
}
