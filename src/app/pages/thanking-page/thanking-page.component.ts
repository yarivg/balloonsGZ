import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params} from '@angular/router'

declare var $: any;

@Component({
  selector: 'app-thanking-page',
  templateUrl: './thanking-page.component.html',
  styleUrls: ['./thanking-page.component.css']
})
export class HomePageComponent implements OnInit {
  
  constructor(private router: Router) {
    
  }

  ngOnInit() {

  }

}
