import { OnInit, Component} from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.css']
})
export class CommentPageComponent implements OnInit {

  private selectedType: string = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initTypeSelection()    
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
  goHome() {
    this.router.navigate(['/home']);
    setTimeout(() => {
      alert('תודה על הדיווח. אנחנו על זה.')
    }, 200)
  }
}
