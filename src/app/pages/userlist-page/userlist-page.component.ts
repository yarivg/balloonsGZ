import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EVENT_TYPES} from '../../constants/EVENT_TYPES';
import {BALLOON_HEIGHTS} from '../../constants/BALLOON_HEIGHTS';
import {KITE_HEIGHTS} from '../../constants/KITE_HEIGHTS';
import {FIRE_SIZES} from '../../constants/FIRE_SIZES';
import {ReportService} from '../../../services/report.service';
import {UserAgentService} from '../../../services/userAgent.service';
import {BURNING_SIZES, CATEGORIES_NAMES, FLYING_OBJECTS_HEIGHT} from '../../constants/HebrewTranslations';

declare var $: any;

@Component({
  selector: 'app-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.scss']
})

export class UserlistPageComponent implements OnInit{
  ngOnInit() {

  }
}
