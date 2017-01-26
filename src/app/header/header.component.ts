import { Component, OnInit } from '@angular/core';
import { HebrewDateService } from '../hebrew-date.service';
import { UserPrefsService } from '../user-prefs.service';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dateTitle: string;
  navTabs: NavTab[] = [
    { title: 'Siddur', routing: '/siddur' },
    { title: 'Zemanim', routing: '/zemanim' },
    { title: 'Settings', routing: '/settings' },
    { title: 'About', routing: '/about' }
  ];

  editMode: boolean;

  constructor(private hebrewDate: HebrewDateService, public userPrefs: UserPrefsService, public af: AngularFire) {
    hebrewDate.$formattedDate.subscribe(formattedDate=>{
      this.dateTitle=formattedDate;
    });
  }

  ngOnInit() {
  }

  toggleEditMode(checked: any) {
    this.userPrefs.setEditMode(checked);
  }

  nusachPicked(selected) {
    this.userPrefs.setUserNusach(selected);
  }

  login() {
    this.af.auth.login().then((auth) => {
      this.userPrefs.user = auth;
      this.userPrefs.loggedInUser();
    });
  }

  logout() {
    this.af.auth.logout();
  }


}

export class NavTab {
  title: string;
  routing: string;
}
