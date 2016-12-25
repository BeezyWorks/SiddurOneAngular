import { Component, Input } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {TextObject} from './TextObject'


@Component({
  selector: 'brocha',
  templateUrl: './brocha.component.html',
  styleUrls: ['./app.component.css']
})

export class BrochaComponent {
  theHtmlString: string = '<br>';

  constructor(public af: AngularFire) {

  }

  @Input()
  set textObjects(textObjects: Object[]) {
    for (var item of textObjects) {
      var textObject = new TextObject(item);
      this.theHtmlString += textObject.text;
      this.theHtmlString += " ";
    }
  }
}
