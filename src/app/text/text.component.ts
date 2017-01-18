import { Component, Input, OnChanges } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { HebrewDateService } from '../hebrew-date.service';
import { UserPrefsService } from '../user-prefs.service';
import { Tefila } from '../models/tefila.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})



export class TextComponent implements OnChanges {
  sections: Tefila[];
  @Input() tefila: Tefila;


  constructor(private af: AngularFire, private userPrefs: UserPrefsService) { }

  ngOnChanges() {
    this.sections = [];
    if (this.tefila == undefined) return;
    for (let route of this.tefila.subRoutes) {
      console.log(route);
      let section = new Tefila();
      this.af.database.list('public/' + route)
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            console.log(snapshot);
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