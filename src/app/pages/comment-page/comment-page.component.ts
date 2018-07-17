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

  private CATEGORIES_NAMES = {
    'שריפה': '11',
    'בלון': '15',
    'עפיפון': '16'
  }

  private selectedType: string = null;
  description: string = ''
  private currCategoryName = 'בלון'

  constructor(private router: Router, private reportSrv: ReportService, private userAgent: UserAgentService) { }

  ngOnInit() {
    this.initTypeSelection()

    if(this.reportSrv.currLocation) {
      this.reportSrv.clearWatching()
    } else {
      this.reportSrv.checkLocation()
    }
  }

  makeUserMessage() {
    let headingPart = `${this.userAgent.isiOSPhone() ? '%0A' + 'כיוון מצפן: ' + parseInt(this.reportSrv.getAzimuth().toString()) : '' }`
    let opening = "דיווח%20על%20"
    return `${this.getGoogleMapsURL()}${ headingPart }${'%0A' + opening}${this.currCategoryName + '.%0A' + this.description + '.%0A' }`
  }

  getGoogleMapsURL() {
      if(this.reportSrv.currLocation) {
         return `google.com/maps/?q=${this.reportSrv.currLocation.latitude},${this.reportSrv.currLocation.longitude}`
      } else {
        return ''
      }
  }

  /**
   * Store chosen category in report service
   */
  chooseCategory(cat: string) {
    this.currCategoryName = cat
    this.reportSrv.setCategory(this.CATEGORIES_NAMES[cat])
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
    this.reportSrv.setWhatsappSharingUrl(this.makeUserMessage())
    this.router.navigate(['/ending']);
  }
}
