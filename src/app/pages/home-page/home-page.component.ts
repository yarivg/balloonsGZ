import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { ReportService } from '../../../services/report.service'
import { MapService } from '../../../services/map.service'

declare var $: any;

const MAP_TYPES = {
  SUPPORT: 'support',
  REPORT: 'report'
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  private reader: any = new FileReader();
  public imageBase64: string = null;
  reportService: ReportService;
  mapService: MapService;
  EVENT_TYPE_BUTTON = MAP_TYPES;

  constructor(private router: Router, private reportSrv: ReportService, private mapSrv: MapService) {
    this.reportService = reportSrv;
    this.mapService = mapSrv;
    let splitString = window.location.href.split('entry=')

    if (splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
      localStorage.setItem('userToken', splitString[1])
    }
  }

  ngOnInit() {
    this.reportSrv.checkLocation()
    this.reportSrv.checkAzimuth()
  }
  // Handle loading screen div and homepage, in such a way
  // that simulates a real loading screen
  ngAfterViewInit() {
  }
  
  mapScreen() {
    // Move further, to next route
    this.router.navigate(['/map']);
  }
  supportMapScreen() {
    // Move further, to next route
    this.router.navigate(['/support-map']);
  }

}
