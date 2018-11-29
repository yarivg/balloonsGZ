import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EVENT_TYPES} from '../../constants/EVENT_TYPES';
import {BALLOON_HEIGHTS} from '../../constants/BALLOON_HEIGHTS';
import {KITE_HEIGHTS} from '../../constants/KITE_HEIGHTS';
import {FIRE_SIZES} from '../../constants/FIRE_SIZES';
import {ReportService} from '../../../services/report.service';
import {UserAgentService} from '../../../services/userAgent.service';
import {BURNING_SIZES, CATEGORIES_NAMES, FLYING_OBJECTS_HEIGHT} from '../../constants/HebrewTranslations';
import {ApiMethod} from 'ngx-facebook/dist/umd/providers/facebook';
import {Http} from '@angular/http';
import * as environment from '../../../../.configenv';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.scss']
})

export class UserlistPageComponent implements OnInit {
  users;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.getOnlineFacebookFriends();
  }

  getOnlineFacebookFriends() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    let reportURL = '';
    if (process.env.NODE_ENV !== 'production') {
      reportURL = environment.config.serverBaseURL[1];
    } else {
      reportURL = environment.config.serverBaseURL[0];
    }
    this.http.post(reportURL.toString() + `/api/user/online`, {}, options).subscribe(data => {
      console.log(data);
      this.users = data;
      }, error => {
      console.error(error);
    });
  }

}
