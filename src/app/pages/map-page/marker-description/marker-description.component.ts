import {Component, Input, OnInit} from '@angular/core';
import {RolesPipe} from '../../../pipes/roles.pipe';

@Component({
  selector:'marker-description',
  template:`
    <h5 *ngIf="markerType === 'fire'">שריפה</h5>
    <h5 *ngIf="markerType !== 'fire'">{{this.rolesPipe.transform(role)}}</h5>
    נ.צ.:
    {{lat}},{{lng}}<br/>
    דווח ב:
    {{reportedDate}}<br/>';
  `
})
export class MarkerDescriptionComponent implements OnInit{
  @Input() lat:number;
  @Input() lng:number;
  @Input() timestamp:number;
  @Input() markerType:string;
  @Input() role:string;
  reportedDate:string;

  rolesPipe:RolesPipe = new RolesPipe();

  ngOnInit(): void {
    this.reportedDate = new Date(this.timestamp).toString();
  }
}
