import { Component, Input } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'tefila',
  templateUrl: './tefila.component.html',
  styleUrls: ['./app.component.css']
})

export class TefilaComponent {
  sectionname: string;
  sections: Object[] = [];

  constructor(public af: AngularFire) {

  }

  @Input()
  set node(node: {section}) {
    this.af.database.list('/sections/' + node.section, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.key.includes("ashkenaz")) {
            for (var referenceNode of snapshot.val()) {
              this.sections.push(referenceNode);
            }
          }
          if(snapshot.key == "title"){
            this.sectionname = snapshot.val();
          }
        });
      })
  }
}
