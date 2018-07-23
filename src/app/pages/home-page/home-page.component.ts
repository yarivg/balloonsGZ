import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { ReportService } from '../../../services/report.service'
import { TokenService } from '../../../services/token.services'

declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  private reader: any = new FileReader();
  public imageBase64: string = null;
  reportService: ReportService;


  constructor(private router: Router, private reportSrv: ReportService, private tokenSrv: TokenService) {
    this.reportService = reportSrv;
    this.tokenSrv = tokenSrv;
    let splitString = window.location.href.split('entry=')

    if (splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
      if (splitString[1] === 'reporter') {
        //activate check phone modal
      }
    }

  }

  ngOnInit() {
    this.tokenSrv.checkAuth();
    this.reportSrv.checkLocation()
    this.reportSrv.checkAzimuth()
  }

  // Handle loading screen div and homepage, in such a way
  // that simulates a real loading screen
  ngAfterViewInit() {

  }

  goToCommentScreen() {
    this.router.navigate(['/comment']);
  }

  buttonClicked() {
    // activate camera
    $('input').click();
  }
}
