import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'
import { ReportService } from '../../../services/report.service'

declare var $: any;

@Component({
  selector: 'app-ending-page',
  templateUrl: './ending-page.component.html',
  styleUrls: ['./ending-page.component.css']
})
export class EndingPageComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private reportSrv: ReportService) {

  }

  ngOnInit() {
    if (this.reportSrv.currLocation) {
      this.reportSrv.clearWatching()
    } else {
      this.reportSrv.checkLocation()
    }
  }

  ngAfterViewInit() {

  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
