import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TopLevel } from '../models/database.models';

@Component({
  selector: 'siddur-navigation',
  templateUrl: './siddur-navigation.component.html',
  styleUrls: ['./siddur-navigation.component.css']
})
export class SiddurNavigationComponent {

  constructor(private af: AngularFire) { }


  @Output() tefilaSelected = new EventEmitter<string>();
  topLevels: NavRef[] = [];

  selectTefila(tefilaKey: string, parentKey: string) {
    this.tefilaSelected.emit(parentKey + '/' + tefilaKey);
  }
  
  @Input() set nusach(nusach: string) {
    this.topLevels.length = 0;
    this.af.database.list('public/top-level').subscribe((obj) => {
      obj.forEach((topLevel) => {
        let level = topLevel as TopLevel;
        let navRef = new NavRef();
        navRef.title = level.title;
        navRef.key = level.databaseKey;
        this.af.database.list('public/' + level.databaseKey).subscribe(topArray => {
          topArray.forEach(tefilaItem => {
            let includedInNusach = false;
            let tefila = new NavRef();
            tefila.title = tefilaItem['title'];
            tefila.key = tefilaItem.$key
            for (let key in tefilaItem) {
              if (key.includes(nusach)) {
                includedInNusach = true;
              }
            }
            if (includedInNusach) {
              navRef.subRefs.push(tefila);
            }
          })
          this.topLevels.push(navRef);
        })
      })
    })
  }
}
export class NavRef {
  title: string;
  key: string;
  subRefs: NavRef[] = [];
}
