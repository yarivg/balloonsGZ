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
  public routerService:Router;


  constructor(private router:Router){
    this.routerService=router;
  }

  ngOnInit(): void {
    setTimeout(()=>this.isInLoadingMode = false,1500);

  }

  navigateToHomePage() {
    this.router.navigate(['/home']);
  }

}
