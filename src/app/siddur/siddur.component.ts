import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {HebrewDateService} from '../hebrew-date.service';
import {UserPrefsService} from '../user-prefs.service';

@Component({
  selector: 'siddur',
  templateUrl: './siddur.component.html',
  styleUrls: ['./siddur.component.css'],
  providers: [HebrewDateService, UserPrefsService]
})
export class SiddurComponent implements OnInit {
  tefilot: Tefila[] = [];
  sections: Section[] = [];

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) {

    //get all tefilot in the tefila node of the db
    this.af.database.list('/tefilot', { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          var tefila = new Tefila();
          var includedInNusach = false;
          tefila.name = snapshot.val()['title'];

          //check that the tefila has at least one section for our nusach
          for (var key in snapshot.val()) {
            if (key.includes(userPrefs.userNusach.key)) {
              // add a section ref for each section in the array
              for (var sectionRef of snapshot.val()[key]) {
                tefila.sectionRoutes.push(sectionRef['section']);
              }
              includedInNusach = true;
            }
          }

          //if it has at leas one section, push it to the array
          if (includedInNusach) {
            this.tefilot.push(tefila);
          }
        });
      })
  }

  ngOnInit() {
  }

  tefilaSelected(tefila) {
    this.sections = [];

    for (var section of tefila.sectionRoutes) {
      this.af.database.list('sections/' + section, { preserveSnapshot: true })
        .subscribe(snapshots => {
          var section = new Section();
          snapshots.forEach(snapshot => {
            //get title of section and add it
            if (snapshot.key == 'title') {
              section.name = snapshot.val();
            }

            //get our nusach's version of this section
            if (snapshot.key.includes(this.userPrefs.userNusach.key)) {
              for (var brocha of snapshot.val()) {
                for (var brochaKey in brocha) {
                  var route = brochaKey + '/' + brocha[brochaKey];

                  console.log(route);
                  section.brochaRoutes.push(brochaKey + '/' + brocha[brochaKey]);
                }
              }
            }
          })
          this.sections.push(section);
        });
    }
  }

}

export class Tefila {
  name: string;
  sectionRoutes: string[] = [];
}

export class Section {
  name: string;
  brochaRoutes: string[] = [];
}
