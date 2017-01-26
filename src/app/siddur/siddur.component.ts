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

  selectTefila(tefila: Tefila) {
    tefila.subRoutes=[];
    for (let key in tefila) {
      if (key.includes(this.nusachKey)) {
        for (let route of tefila[key]) {
            tefila.subRoutes.push(route);
        }
      }
    }
    this.selectedTefila = tefila;
  }

}

