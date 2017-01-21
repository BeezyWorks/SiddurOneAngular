import { Component, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2'

@Component({
  selector: 'edit-text',
  templateUrl: './edit-text.component.html',
  styleUrls: ['./edit-text.component.css']
})
export class EditTextComponent {

  constructor(private af: AngularFire) {
    af.database.list('Flags').subscribe(flags => {
      flags.forEach(flag => {
        this.flags.push(flag.$value);
      })
    })
  }

  baseRef: FirebaseListObservable<any>;
  firebaseKey: string;
  flags: string[] = [];
  firebaseRaw: Array<TextElement>;
  showOptionsElement: TextElement;

  @Input() set ref(ref: FirebaseListObservable<any>) {
    this.baseRef = ref;
    ref.subscribe(value => { 
      console.log(value);
      for(let item of value){
        if(item["$key"].includes("ashkenaz")){
          this.firebaseKey=item["$key"];
          this.firebaseRaw=item;
        }
      }
    })

  }

  save() {
    for(let key in this.firebaseRaw){
      if(key.includes("$")){
        delete this.firebaseRaw[key];
      }
    }
   this.baseRef.update(this.firebaseKey, this.firebaseRaw);
  }

  addElement(index: number) {
    this.firebaseRaw.splice(index + 1, 0, new TextElement());
  }

  containsFlag(flag: string) {
    let elementFlags = this.showOptionsElement.flags;
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
}

export class TextElement {
  text: string;
  flags: string[] = [];
  and: string[];
  or: string[];
}
