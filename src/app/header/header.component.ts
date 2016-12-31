import { Component, OnInit } from '@angular/core';
import {HebrewDateService} from '../hebrew-date.service';
import {UserPrefsService} from '../user-prefs.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HebrewDateService, UserPrefsService],
})
export class HeaderComponent implements OnInit {
  dateTitle: string;
  navTabs: NavTab[] = [
    { title: 'Siddur', routing: '/siddur' },
    { title: 'Zemanim', routing: '/siddur' },
    { title: 'Settings', routing: '/siddur' },
    { title: 'About', routing: '/about' }
  ];

  constructor(private hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) {
    this.dateTitle = hebrewDate.formattedDate;
  }

  ngOnInit() {
  }

  nusachPicked(selected) {
    this.userPrefs.userNusach = selected;
  }


}

export class NavTab {
  title: string;
  routing: string;
}
