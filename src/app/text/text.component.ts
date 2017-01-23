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
  sections: Tefila[] = [];
  @Input() tefila: Tefila;
  inEdit: FirebaseListObservable<any>;

  constructor(private af: AngularFire, private userPrefs: UserPrefsService) { }

  ngOnChanges() {
    if (this.tefila == undefined) return;
    for (let route of this.tefila.subRoutes) {
      let sectionObservable = this.af.database.list('public/' + route)
        .map(snapshots => {
          this.sections.length = 0;
          let section = new Tefila();
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

          return section;
        });
      sectionObservable.subscribe(section => {
        this.sections.push(section);
      })
    }
  }

  textClicked(ref: FirebaseListObservable<any>) {
    if(!this.userPrefs.isAdmin) return;
    if (this.inEdit == ref)
      this.inEdit = null;
    else
      this.inEdit = ref;

  }
}