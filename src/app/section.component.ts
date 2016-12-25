import { Component, Input } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./app.component.css']
})

export class SectionComponent {
  paths: Object[]= [];

  constructor(public af: AngularFire) {

  }

  @Input()
  set node(node: Object) {
    for (var key in node) {
      this.af.database.list('/'+key +'/'+ node[key], { preserveSnapshot: true })
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            if (snapshot.key.includes("ashkenaz")) {
              this.paths.push(snapshot.val());
            }
          });
        })
    }
  }
}
