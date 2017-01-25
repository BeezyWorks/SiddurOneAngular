import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { HebrewDateService } from '../hebrew-date.service';
import { UserPrefsService } from '../user-prefs.service';
import { Tefila } from '../models/tefila.model';
import { Subject } from 'rxjs';
import { TopLevel } from '../models/database.models';

@Component({
  selector: 'siddur',
  templateUrl: './siddur.component.html',
  styleUrls: ['./siddur.component.css'],
  providers: []
})
export class SiddurComponent implements OnInit {
  sections: Tefila[] = [];

  selectedTefila: Tefila;

  nusachKey: string;

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) {
  }

  ngOnInit() {
    this.userPrefs.$userNusach.subscribe((nusach) => {
      this.nusachKey = nusach.key;
    });
  }

  selectTefila(array: Array<any>) {
    let tefila = new Tefila();
    for (let object of array) {
      for (let key in object) {
        tefila.subRoutes.push(key + '/' + object[key]);
      }
    }
    this.selectedTefila = tefila;
  }

}

