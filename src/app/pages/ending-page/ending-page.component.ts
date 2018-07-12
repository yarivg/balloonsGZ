import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router} from '@angular/router'

declare var $: any;

@Component({
  selector: 'app-ending-page',
  templateUrl: './ending-page.component.html',
  styleUrls: ['./ending-page.component.css']
})
export class EndingPageComponent implements OnInit, AfterViewInit{
  
  constructor(private router: Router) {
    
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // Display is visible
    setTimeout(function () { 
      this.router.navigate('/home');
    }, 2000)
  }

  goHome() {

  }
}
