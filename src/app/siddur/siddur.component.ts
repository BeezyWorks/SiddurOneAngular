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

  selectTefila(tefilaKey: string) {
    let key = 'public/' + tefilaKey;
    let arrayAwait = this.af.database.object(key).map(tefila => {
      for (let key in tefila) {
        if (key.includes(this.nusachKey)) {
          return tefila[key];
        }
      }
    });

    arrayAwait.subscribe(array => {
      let tefila = new Tefila();
      for (let object of array) {
        for (let key in object) {
          tefila.subRoutes.push(key + '/' + object[key]);
        }
      }
      this.selectedTefila = tefila;
    })
  }

  tefilaSelected(tefila: Tefila) {
    this.selectedTefila = tefila;
    for (let route of tefila.subRoutes) {
      let section = new Tefila();
      this.af.database.list('public/sections/')
      this.af.database.list('public/sections/' + route)
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {

            //get title of section and add it
            if (snapshot.$key == 'title') {
              section.name = snapshot.$value;
            }

            //get our nusach's version of this section
            if (snapshot.$key.includes(this.userPrefs.userNusach.key)) {
              for (let brocha of snapshot) {
                for (let brochaKey in brocha) {
                  let route = brochaKey + '/' + brocha[brochaKey];
                  section.subRoutes.push(brochaKey + '/' + brocha[brochaKey]);
                  section.firebaseRefs.push(this.af.database.list('public/' + brochaKey + '/' + brocha[brochaKey]))
                }
              }
            }
          })
          this.sections.push(section);
        });
    }
  }

}

