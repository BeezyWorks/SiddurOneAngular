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
    this.sections.length = 0;
    for (let route of this.tefila.subRoutes) {
      let section = new Tefila();
      let sectionObservable = this.af.database.object('public/' + route)
        .subscribe(snapshot => {
          section.title = snapshot['title'];

          let nusachKey = "";
          for (let key in snapshot) {
            if (key.includes(this.userPrefs.userNusach.key))
              nusachKey = key;
          }

          //get our nusach's version of this section
          let nusachValues = snapshot[nusachKey];
          if (nusachValues == undefined) return;
          for (let brocha of nusachValues) {
            for (let brochaKey in brocha) {
              let route = brochaKey + '/' + brocha[brochaKey];
              section.subRoutes.push(brochaKey + '/' + brocha[brochaKey]);
              section.firebaseRefs.push(this.af.database.list('public/' + brochaKey + '/' + brocha[brochaKey]))
            }
          }
          this.sections.push(section);
        });
    }
  }

  textClicked(ref: FirebaseListObservable<any>) {
    if (!this.userPrefs.isAdmin) return;
    if (this.inEdit == ref)
      this.inEdit = null;
    else
      this.inEdit = ref;

  }
}