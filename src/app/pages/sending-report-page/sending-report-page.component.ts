import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EVENT_TYPES} from '../../constants/EVENT_TYPES';
import {BALLOON_HEIGHTS} from '../../constants/BALLOON_HEIGHTS';
import {KITE_HEIGHTS} from '../../constants/KITE_HEIGHTS';
import {FIRE_SIZES} from '../../constants/FIRE_SIZES';
import {ReportService} from '../../../services/report.service';

declare var $: any;

@Component({
  selector: 'sending-report-page',
  templateUrl: './sending-report-page.component.html',
  styleUrls: ['./sending-report-page.component.scss']
})
export class SendingReportPageComponent implements OnInit {

  eventType:string = null;
  eventSize:string = null;
  EVENT_TYPE_BUTTON = EVENT_TYPES;
  BALLOON_HEIGHTS = BALLOON_HEIGHTS;
  KITE_HEIGHTS = KITE_HEIGHTS;
  FIRE_SIZES = FIRE_SIZES;

  constructor(private route:ActivatedRoute, private reportService:ReportService, private router:Router) { }

  ngOnInit() {
    this.eventType = this.route.snapshot.params['event-type'];
  }

  setEventSize(eventSize){
    this.eventSize = eventSize;
  }

  cameraButtonClicked() {
    // activate camera
    $('input').click();
  }

  captureImage(image){
    this.reportService.captureImageWithoutSending(image);
  }

  goToEndingPage(){
    this.router.navigate(['/ending'])
  }

}
