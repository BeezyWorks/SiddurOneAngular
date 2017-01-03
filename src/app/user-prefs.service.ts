import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserPrefsService {
  user: FirebaseAuthState;

 private userNusachSource = new BehaviorSubject<Nusach>({key: 'ashkenaz', hebrewTitle: 'אשכנז'});
  private nuschosSource = new BehaviorSubject<Nusach[]>([this.userNusachSource.getValue()]);
 
  $nuschos = this.nuschosSource.asObservable();
  $userNusach = this.userNusachSource.asObservable();

  userNusach: Nusach = this.userNusachSource.getValue();

  constructor(private af: AngularFire) {
    this.af.auth.subscribe((user) => {
      this.user = user;
      this.af.database.object('users/' + user.uid).subscribe((userOptions) => {
        this.$nuschos.subscribe((array) => {
          for (let value of array) {
            if (value.key == userOptions['nusach']) {
              this.userNusach = value;
              console.log(value)
              this.userNusachSource.next(value);
            }
          }
        })
      })
    });

    this.af.database.list('public/nuschos').subscribe((nuschos) => {
      let pushArray = new Array<Nusach>();
      for (let val of nuschos) {
        pushArray.push({ key: val['key'], hebrewTitle: val['hebrew'] });
      }
      this.nuschosSource.next(pushArray);
    });
  }

  setUserNusach(nusach: Nusach) {
    if (this.user != undefined) {
      this.af.database.object("users/" + this.user.uid).set({ nusach: nusach.key });
    }
  }

}

export class Nusach {
  key: string;
  hebrewTitle: string;
}
