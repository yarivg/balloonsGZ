import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isInLoadingMode = true;


  constructor(private router:Router){
  }

  ngOnInit(): void {
    setTimeout(()=>this.isInLoadingMode = false,1500);

  }

  navigateToHomePage() {
    this.router.navigate(['/home']);
  }

}
