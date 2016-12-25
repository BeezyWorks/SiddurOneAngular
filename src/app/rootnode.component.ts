import { Component, Input } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'root-node',
  templateUrl: './rootnode.component.html',
  styleUrls: ['./app.component.css']
})

export class RootNodeComponent {
  title: string
  tefilot: string[] = []
_tefilot: string[] = [];

  constructor(public af: AngularFire) {

  }

  @Input()
  set name(name: string) {
    this.af.database.list('/tefilot/' + name, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.key == "title") {
            this.title = snapshot.val();
          }
          if (snapshot.key.includes("ashkenaz")) {
            this._tefilot = snapshot.val();
          }
        });
      })
  }

  selected() {
    if (this.tefilot.length < 1) {
      this.tefilot = this._tefilot;
    }
    else {
      this.tefilot = [];
    }
  }
}
