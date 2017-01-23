import { Component, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import { UserPrefsService } from '../user-prefs.service';
import { HebrewDateService } from '../hebrew-date.service';

@Component({
  selector: 'edit-text',
  templateUrl: './edit-text.component.html',
  styleUrls: ['./edit-text.component.css']
})
export class EditTextComponent {

  constructor(private af: AngularFire, hebrewDate: HebrewDateService, userPrefs: UserPrefsService) {
    af.database.list('Flags').subscribe(flags => {
      this.flags.length = 0;
      flags.forEach(flag => {
        this.flags.push(flag.$value);
      })
    });

    hebrewDate.$evaluationKeys.subscribe(evals => {
      this.calendarEvals.length = 0;
      for (let key in evals) {
        if (!key.includes('$'))
          this.calendarEvals.push(key);
      }
    });

    userPrefs.$evaluationKeys.subscribe(evals => {
      this.preferenceEvals.length = 0;
      for (let key in evals) {
        if (!key.includes('$'))
          this.preferenceEvals.push(key);
      }
    })
  }

  baseRef: FirebaseListObservable<any>;
  firebaseKey: string;

  firebaseRaw: Array<TextElement>;
  showOptionsElement: TextElement;
  showEvluationsElement: TextElement;

  calendarEvals: string[] = [];
  preferenceEvals: string[] = [];

  flags: string[] = [];
  addingFlag: boolean;
  newFlag: string;

  @Input() set ref(ref: FirebaseListObservable<any>) {
    this.baseRef = ref;
    ref.subscribe(value => {
      for (let item of value) {
        if (item["$key"].includes("ashkenaz")) {
          this.firebaseKey = item["$key"];
          this.firebaseRaw = item;
        }
      }
    })

  }

  save() {
    for (let key in this.firebaseRaw) {
      if (key.includes("$")) {
        delete this.firebaseRaw[key];
      }
    }
    this.baseRef.update(this.firebaseKey, this.firebaseRaw);
  }

  addFlag() {
    this.addingFlag = !this.addingFlag;
  }

  saveNewFlag() {
    this.af.database.list('Flags').push(this.newFlag);
    this.addFlag();
  }

  addElement(index: number) {
    this.firebaseRaw.splice(index + 1, 0, new TextElement());
  }

  containsFlag(flag: string) {
    let elementFlags = this.showOptionsElement.flags;
    if (elementFlags == undefined) {
      this.showOptionsElement.flags = [];
      elementFlags = this.showOptionsElement.flags;
    }
    for (let eFlag of elementFlags) {
      if (eFlag == flag)
        return true;
    }
    return false
  }

  toggleFlag(flag: string, isChecked: boolean) {
    let hasFlag = this.containsFlag(flag);
    if (!hasFlag && isChecked)
      this.showOptionsElement.flags.push(flag);
    if (!isChecked) {
      let index: number = this.showOptionsElement.flags.indexOf(flag, 0);
      if (index > -1) {
        this.showOptionsElement.flags.splice(index, 1);
      }
    }
  }

  showOptons(textElement: TextElement) {
    if (this.showOptionsElement == textElement)
      this.showOptionsElement = null;
    else
      this.showOptionsElement = textElement;
  }

  showEvaluations(textElement: TextElement) {
    if (textElement.evaluations == undefined)
      textElement.evaluations = { type: "and" };
    if (this.showEvluationsElement == textElement)
      this.showEvluationsElement = null;
    else
      this.showEvluationsElement = textElement;
  }

  toggleEvaluation(textElement: TextElement, key: string, arg: any) {
    if (arg == "undefined")
      delete textElement.evaluations[key];
    console.log(this.showEvluationsElement);
  }
}

export class TextElement {
  text: string;
  flags: string[];
  evaluations: any;
}

export class BooleanArray {
  evaluateAsAnd: boolean;
  evaluations: any;
}
