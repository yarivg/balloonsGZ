import { OnInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { UserAgentService } from '../../../services/userAgent.service';
import {Location} from '../../models/Location';

declare var $: any;

@Component({
  selector: 'app-support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss'],
  providers: [UserAgentService]
})
export class SupportPageComponent implements OnInit {

  public CATEGORIES_NAMES = {
    MYBALLOON: 'בלון',
    BALLOON: 'בלון'
  };

  private selectedType: string = null;
  longitude:number = null;
  latitude:number = null;
  inputCoordinate:Location = new Location(null,null);
  description: string = '';
  public currCategoryName = 'בלון';

  constructor(private router: Router, private reportSrv: ReportService, private userAgent: UserAgentService) { }

  ngOnInit() {
    
  }


  openMap(){
    this.router.navigate([`/map`]);
  }

  cameraButtonClicked() {
    // activate camera
    $('input').click();
  }

  captureImage(image){
    this.reportSrv.captureImageWithoutSending(image);
  }
}
