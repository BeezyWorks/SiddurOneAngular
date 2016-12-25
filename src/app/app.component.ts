import { Component } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseRef } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  tefilot: string[] = [];

  constructor(public af: AngularFire) {
    this.af.database.list('/tefilot', { preserveSnapshot: true})
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          this.tefilot.push(snapshot.key);
        });
    });
  }
}

  // selected(tefila: FirebaseObjectObservable<any>) {
  //   this.itemSelected = true;
  //   var correctSubnode;
  //   for (var key in tefila) {
  //     if (key.includes("ashkenaz"))
  //       correctSubnode = tefila[key];
  //   }
  //
  //   var sections: any[] = [];
  //   for (var key in correctSubnode) {
  //     this.selectedItem.push(key);
  //     for (var subkey in correctSubnode[key]) {
  //       if (subkey.includes('section')) {
  //         sections.push(correctSubnode[key][subkey]);
  //       }
  //     }
  //   }
  //   //sections now has the key to every section reference in the Sections node of the database
  //   this.selectedItem = sections;
  //
  //   var sectionRefs: any[] = [];
  //   for (var section in sections) {
  //     var address = "/sections/" + section;
  //     this.af.database.object("/sections/bentching").$ref.once('value', function(thing) {
  //     for (var key in thing){
  //       console.log(thing.val);
  //     }
  //     })
  //   }
  // }
// }
