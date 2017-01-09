import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { HebrewDateService } from '../hebrew-date.service';
import { UserPrefsService } from '../user-prefs.service';
import {Tefila} from '../models/tefila.model';

@Component({
  selector: 'siddur',
  templateUrl: './siddur.component.html',
  styleUrls: ['./siddur.component.css'],
  providers: []
})
export class SiddurComponent implements OnInit {
  tefilot: Tefila[] = [];
  brochos: Tefila[] = [];
  sections: Tefila[] = [];

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) {
    userPrefs.$userNusach.subscribe((nusach) => {
      this.getTopLevel('public/tefilot/');
      this.getTopLevel('public/brochos/');
    })
  }

  getTopLevel(topLevel: string) {
    //get all tefilot in the tefila node of the db
    this.af.database.list(topLevel)
      .subscribe(snapshots => {
        if (topLevel.includes('tefilot')) {
          this.tefilot.length = 0;
        }
        if (topLevel.includes('brochos')) {
          this.brochos.length = 0;
        }
        snapshots.forEach(array => {

          for (let node in array) {
            let tefila = new Tefila();
            let includedInNusach = false;
            tefila.name = array[node]['title'];

            //check that the tefila has at least one section for our nusach
            for (let key in array[node]) {
              if (key.includes(this.userPrefs.userNusach.key)) {
                // add a section ref for each section in the array
                for (let sectionRef of array[node][key]) {
                  tefila.subRoutes.push(sectionRef['section']);
                }
                includedInNusach = true;
              }
            }

            //if it has at leas one section, push it to the array
            if (includedInNusach) {
              if (topLevel.includes('tefilot')) {
                this.tefilot.push(tefila);
              }
              if (topLevel.includes('brochos')) {
                this.brochos.push(tefila);
              }
            }
          }
        });
      })
  }

  ngOnInit() {
  }

  tefilaSelected(tefila: Tefila) {
    this.sections = [];
    for (let route of tefila.subRoutes) {
      let section = new Tefila();
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
                }
              }
            }
          })
          this.sections.push(section);
        });
    }
  }

}

