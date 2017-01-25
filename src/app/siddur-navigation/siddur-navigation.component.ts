import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UserPrefsService } from '../user-prefs.service';

@Component({
  selector: 'siddur-navigation',
  templateUrl: './siddur-navigation.component.html',
  styleUrls: ['./siddur-navigation.component.css']
})
export class SiddurNavigationComponent implements OnChanges, OnInit {



  @Input() nusach: string;

  @Output() tefilaSelected = new EventEmitter<string>();
  topLevels: NavRef[] = [];
  addBelow: any;
  newTefilaTitle: string;
  editMode: boolean;

  constructor(private af: AngularFire, public userPrefs: UserPrefsService) {

  }

  ngOnInit() {
    this.userPrefs.$editMode.subscribe((val) => {
      this.editMode = val;
      this.ngOnChanges();
    });

  }

  selectTefila(tefila: any) {
    console.log(tefila);
    for (let key in tefila) {
      if (key.includes(this.userPrefs.userNusach.key)) {
        this.tefilaSelected.emit(tefila[key]);
      }
    }
  }

  ngOnChanges() {
    this.af.database.list('public/top-level').subscribe((obj) => {
      this.topLevels.length = 0;
      obj.forEach((topLevel) => {
        let level = topLevel as NavRef;
        level.includedTefilot = [];
        for (let tefila of level.tefilot) {
          let includedInNusach = false;
          for (let key in tefila) {
            if (key.includes(this.nusach))
              includedInNusach = true;
          }
          if (includedInNusach || this.editMode) {
            level.includedTefilot.push(tefila);
          }
        }
        this.topLevels.push(level);
      })
    })
  }


  showAddTefila(previousTefila: any) {
    this.addBelow = previousTefila;
  }

  addTefila(navSection: NavRef, previousTefila: any) {
    let index: number = navSection.tefilot.indexOf(previousTefila);
    index += 1;
    navSection.tefilot.splice(index, 0, { title: this.newTefilaTitle });
    for (let top of this.topLevels) {
      for (let key in top) {
        if (key.includes('$'))
          delete top[key];
      }
      delete top['includedTefilot'];
    }
    this.af.database.object('public/top-level').set(this.topLevels);
  }
}
export class NavRef {
  title: string;
  tefilot: Array<any>;
  includedTefilot: Array<any>;
}

