import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserPrefsService {
  user: FirebaseAuthState;

  private pasukNameKey: string = "name-pasuk";
  private nusachKey: string = "nusach";

  private userNusachSource = new BehaviorSubject<Nusach>({ key: 'ashkenaz', hebrewTitle: 'ashkenaz' });
  private nuschosSource = new BehaviorSubject<Nusach[]>([this.userNusachSource.getValue()]);

  $nuschos = this.nuschosSource.asObservable();
  $userNusach = this.userNusachSource.asObservable();

  userNusach: Nusach = this.userNusachSource.getValue();
  namePasuk: string;

  inIsrael: boolean;
  inIsraelKey: string = "inIsrael";

  inJerusalem: boolean;
  inJerusalemKey: string = "inJerusalem";

  modernHolidaysKey: string = "modernHolidays";
  modernHolidays: boolean = true;

  constructor(private af: AngularFire) {
    this.namePasuk = localStorage.getItem(this.pasukNameKey);
    this.af.auth.subscribe((user) => {
      if (user == undefined) return;
      this.user = user;
      this.af.database.object('users/' + user.uid).subscribe((userOptions) => {
        //set user's name pasuk for shmone esre
        this.namePasuk = userOptions[this.pasukNameKey];
        //set user nusach
        localStorage.setItem(this.nusachKey, userOptions[this.nusachKey]);
        localStorage.setItem(this.inIsraelKey, userOptions[this.inIsraelKey]);
        localStorage.setItem(this.inJerusalemKey, userOptions[this.inJerusalemKey]);
        localStorage.setItem(this.modernHolidaysKey, userOptions[this.modernHolidaysKey]);
      })
    });

    var savedNusachKey = localStorage.getItem(this.nusachKey);
    this.$nuschos.subscribe((array) => {
      for (let value of array) {
        if (value.key == savedNusachKey) {
          this.userNusach = value;
          this.userNusachSource.next(value);
        }
      }
    });

    this.af.database.list('public/nuschos').subscribe((nuschos) => {
      let pushArray = new Array<Nusach>();
      for (let val of nuschos) {
        pushArray.push({ key: val['key'], hebrewTitle: val['hebrew'] });
      }
      this.nuschosSource.next(pushArray);
    });

    this.inIsrael = localStorage.getItem(this.inIsraelKey) == 'true';
    this.inJerusalem = localStorage.getItem(this.inJerusalemKey) == 'true';
    this.modernHolidays = localStorage.getItem(this.modernHolidaysKey) !='false';
  }

  loggedInUser(keepLocalValues: boolean = false) {
    if (!keepLocalValues) return;
    this.setUserNusach(this.userNusach);
    this.setNamePasuk(this.namePasuk);
  }

  setUserNusach(nusach: Nusach) {
    this.userNusach = nusach;
    this.userNusachSource.next(nusach);
    this.addSettingToFirebase(this.nusachKey, nusach.key);
  }

  setNamePasuk(pasuk: string) {
    this.namePasuk = pasuk;
    this.addSettingToFirebase(this.pasukNameKey, pasuk);
  }

  setInIsrael(inIsrael: boolean) {
    this.inIsrael = inIsrael;
    this.addSettingToFirebase(this.inIsraelKey, String(inIsrael));
  }

  setInJerusalem(inJerusalem: boolean) {
    this.inJerusalem = inJerusalem;
    this.addSettingToFirebase(this.inJerusalemKey, String(inJerusalem));
  }

  setModernHolidays(modernHolidays: boolean) {
    this.modernHolidays = modernHolidays;
    this.addSettingToFirebase(this.modernHolidaysKey, String(modernHolidays));
  }

  addSettingToFirebase(key: string, preference: string) {
    localStorage.setItem(key, preference);
    if (this.user == undefined) return;
    this.af.database.object("users/" + this.user.uid + "/" + key).set(preference);
  }

}

export class Nusach {
  key: string;
  hebrewTitle: string;
}
