import { OnInit, Component} from '@angular/core'
import { Router } from '@angular/router'
import { ReportService } from '../../../services/report.service'
import { UserAgentService } from '../../../services/userAgent.service'

declare var $: any;

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.css'],
  providers: [UserAgentService]
})
export class CommentPageComponent implements OnInit {

  public CATEGORIES_NAMES = {
    FIRE:'שריפה',
    BALLOON: 'בלון',
    KITE: 'עפיפון'
  };

  public BURNING_SIZES = {
    SMALL: 'קטנה',
    MEDIUM: 'בינונית',
    LARGE: 'גדולה'
  };

  public FLYING_OBJECTS_HEIGHT = {
    ON_GROUND: 'קרקע',
    LOW: 'נמוך',
    MEDIUM: 'בינוני',
    HIGH: 'גבוה'
  };

  private selectedType: string = null;
  description: string = '';
  public currCategoryName = 'בלון';
  burningSize = '';
  flyingObjectHeight = '';

  constructor(private router: Router, private reportSrv: ReportService, private userAgent: UserAgentService) { }

  ngOnInit() {
    this.chooseCategory(this.CATEGORIES_NAMES.FIRE);
    this.initTypeSelection();

    if(this.reportSrv.currLocation) {
      this.reportSrv.clearWatching()
    } else {
      this.reportSrv.checkLocation()
    }
  }

  makeUserMessage() {
    let headingPart = `${this.userAgent.isiOSPhone() ? 'כיוון מצפן: \n' + parseInt(this.reportSrv.getAzimuth().toString()) : '' }`;
    let opening = "דיווח על ";
    return `${this.getGoogleMapsURL()}\n
    ${headingPart}\n
    ${opening}\n
    ${this.getEventDescription()}\n
    ${this.description}.`;
  }

  getGoogleMapsURL() {
      if(this.reportSrv.currLocation) {
         return `google.com/maps/?q=${this.reportSrv.currLocation.latitude},${this.reportSrv.currLocation.longitude}`
      } else {
        return ''
      }
  }

  getEventDescription() {
    if (this.currCategoryName === this.CATEGORIES_NAMES.FIRE) {
      return `${this.currCategoryName} ${this.burningSize}`;
    } else {
      return `${this.currCategoryName} ` + 'בגובה' + ` ${this.flyingObjectHeight}`;
    }
  }

  /**
   * Store chosen category in report service
   */
  chooseCategory(cat: string) {
    this.currCategoryName = cat;
    this.reportSrv.setCategory(cat)
  }

  chooseBurningSize(burningSize){
    this.burningSize = burningSize;
  }

  chooseFlyingObjectHeight(flyingObjectHeight){
    this.flyingObjectHeight = flyingObjectHeight;
  }

  /**
   * Basically, this following function allows html Divs to act as Radio Buttons
   * used mainly for css ease
   *
   * TypeSelection means regards which type of object you have seen and took a photo of
   */
  initTypeSelection() {

    // function that handles a Dom element selection - sets the element as selected
    function onSelect(elem, parent) {
      // Clear 'selected' class from all child 'radio' elements
      parent.find('.radio').removeClass('selected');
      // Add 'selected; class to (this) element clicked
      elem.addClass('selected');

      determineSubState(elem.attr('data-value'));
    }

    // function that sets the lower part of the view to display either,
    // 'height' div or 'size' div - accordingly for each type of the reports
    function determineSubState(typeValue) {
      if (!typeValue || typeValue == '') return;

      $('.size, .height').removeClass('hidden');

      if (typeValue == 'fire') {  // selected type is not above ground physically - display size
        $('.height').addClass('hidden')
      } else {  // selected type is not above ground physically - display size
        $('.size').addClass('hidden')
      }
    }

    $('.factor-icons.radio-group .radio').on('click', function() {
      let parent = $(this).parent().parent();
      onSelect($(this), parent);
    });

    $('.buttons.radio-group .radio').on('click', function() {
      let parent = $(this).parent();
      onSelect($(this), parent);
    });
  }

  goToEndingPage() {
    this.reportSrv.setWhatsappSharingUrl(encodeURIComponent(this.makeUserMessage()));
    this.router.navigate(['/ending']);
  }

  canReportBeSent(){
    if (this.currCategoryName === this.CATEGORIES_NAMES.FIRE){
      return Object.values(this.BURNING_SIZES).includes(this.burningSize);
    }
    return Object.values(this.FLYING_OBJECTS_HEIGHT).includes(this.flyingObjectHeight);
  }
}
