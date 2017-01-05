import { Component, OnInit } from '@angular/core';
import { UserPrefsService } from '../user-prefs.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  namePasuk;

  constructor(public userPrefs: UserPrefsService) { }

  ngOnInit() {
    this.namePasuk = this.userPrefs.namePasuk;
  }

  saveNamePasuk() {
    this.userPrefs.setNamePasuk(this.namePasuk);
  }

  inIsraelToggled(value) {
    this.userPrefs.setInIsrael(value.checked);
  }
  inJerusalemToggled(value) {
    this.userPrefs.setInJerusalem(value.checked);
  }
  modernHolidaysToggled(value) {
    this.userPrefs.setModernHolidays(value.checked);
  }
}

