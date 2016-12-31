import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { HebrewDateService } from '../hebrew-date.service';
import { UserPrefsService } from '../user-prefs.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})



export class TextComponent implements OnInit {
  checks: TextFlags[] = [
    { key: 'bold', openingTag: '<strong>', closingTag: '</strong>' },
    { key: 'special_color', openingTag: '<span style="color:green">', closingTag: '</span>' },
    { key: 'large', openingTag: '<large>', closingTag: '</large>' },
    { key: 'small', openingTag: '<small>', closingTag: '</small>' },
    { key: 'subtitle', openingTag: '<small>', closingTag: '</small>' }
  ]

  html: string = "";

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) { }

  ngOnInit() {
  }

  @Input()
  set brochaPath(path: string) {
    this.html = "";
    this.getObjectFromFirebase(path);
  }

  getObjectFromFirebase(path: string) {
    this.af.database.list(path, { preserveSnapshot: true })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.key.includes(this.userPrefs.userNusach.key)) {
            for (var raw of snapshot.val()) {
              this.evaluateRawObject(raw);
            }
          }

        })
      }
      );
  }

  evaluateRawObject(raw: any) {
    var text = raw['text'];
    var ref = raw['ref'];

    if (raw == "linebreak" || text == "linebreak") {
      text = "<br>";
    }

    var andEval = this.evaluateBoolFlags(raw['and'], true);
    var orEval = this.evaluateBoolFlags(raw['or'], false);
    if (andEval && orEval) {
      this.html += this.textToHtml(text, raw['flags']);
      if (ref != undefined) {
        this.getObjectFromFirebase(ref as string);
      }
    }
  }
  //takes a list of string keys and assess true or false
  evaluateBoolFlags(flags: string[], andEvaluation: boolean): boolean {
    if (flags == undefined) return true;
    for (var key of flags) {
      var shouldShow = false;
      var notCondition = key.includes('!');
      //remove the '!' so the keys matchup
      key = key.replace('!', '');
      if (this.userPrefs.hasOwnProperty(key)) {
        shouldShow = this.userPrefs[key];
      }
      if (this.hebrewDate.hasOwnProperty(key)) {
        shouldShow = this.hebrewDate[key];
      }
      if (notCondition) {
        shouldShow = !shouldShow;
      }
      if (shouldShow && !andEvaluation) {
        return true;
      }
      if (!shouldShow && andEvaluation) {
        return false;
      }

    }
    return andEvaluation;
  }

  textToHtml(text: string, flags: any[]): string{
    if (text == undefined) return "";
    var prefixes = "";
    var suffixes = " ";
    if (flags != undefined) {
      for (var flag of flags) {
        for (var check of this.checks) {
          if (flag == check.key) {
            prefixes += check.openingTag;
            suffixes += check.closingTag;
          }
        }
      }
    }
    return prefixes + text + suffixes;
  }
}

export class TextFlags {
  key: string;
  openingTag: string;
  closingTag: string;
}
