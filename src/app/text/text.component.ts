import { Component, OnInit, Input} from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {HebrewDateService} from '../hebrew-date.service';
import {UserPrefsService} from '../user-prefs.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})



export class TextComponent implements OnInit {
  html: string = "";

  elements: BrochaElement[] = [];

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) { }

  ngOnInit() {
  }

  @Input()
  set brochaPath(path: string) {
    this.af.database.list(path, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.key.includes(this.userPrefs.userNusach.key)) {
            for (var raw of snapshot.val()) {
              var element = new BrochaElement()
              element.text = raw['text'];
              if (raw == "linebreak") {
                element.text = "<br>";
              }
              element.flags = raw['flags'];
              this.html += element.getHtml();
            }
          }

        })
      }
      );
  }
}


export class BrochaElement {
  text: string;
  flags: Object[];
  and: string[];
  or: string[];

  getHtml(): string {
    return "<span style=\"color: red;\">" + this.text + " </span>";
  }
}

export class TextFlags {
  key: string;
  openingTag: string;
  closingTag: string;
}

export const flags: TextFlags[] = [
  { key: 'bold', openingTag: '<strong>', closingTag: '</strong>' },
  { key: 'special_color', openingTag: '<strong>', closingTag: '</strong>' },
  { key: 'large', openingTag: '<large>', closingTag: '</large>' },
  { key: 'small', openingTag: '<small>', closingTag: '</small>' },
  { key: 'subtitle', openingTag: '<h3>', closingTag: '</h3>' }
]
