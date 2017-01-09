import { Pipe, PipeTransform } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { HebrewDateService } from './hebrew-date.service';
import { UserPrefsService } from './user-prefs.service';
import { Tefila } from './models/tefila.model';

@Pipe({
  name: 'parseText'
})
export class ParseTextPipe implements PipeTransform {

 checks: TextFlags[] = [
    { key: 'bold', openingTag: '<strong>', closingTag: '</strong>' },
    { key: 'special_color', openingTag: '<span style="color:green">', closingTag: '</span>' },
    { key: 'large', openingTag: '<large>', closingTag: '</large>' },
    { key: 'small', openingTag: '<small>', closingTag: '</small>' },
    { key: 'subtitle', openingTag: '<small>', closingTag: '</small>' }
  ]

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) { }

  transform(brochaArray: any, args?: any): any {
    let html = "";
    console.log(brochaArray);
    if(brochaArray==undefined) return;
    for (let raw of brochaArray[0]) {
      let text = raw['text'];
      let ref = raw['ref'];

      if (raw == "linebreak" || text == "linebreak") {
        text = "<br>";
      }

      let andEval = this.evaluateBoolFlags(raw['and'], true);
      let orEval = this.evaluateBoolFlags(raw['or'], false);
      if (andEval && orEval) {
        this.htmls.push(this.textToHtml(text, raw['flags']));
        html += this.textToHtml(text, raw['flags']);
        if (ref != undefined) {
          //this.getObjectFromFirebase(ref as string);
        }
      }
    }
    return html;
  }

  //takes a list of string keys and assess true or false
  evaluateBoolFlags(flags: string[], andEvaluation: boolean): boolean {
    if (flags == undefined) return true;
    for (let key of flags) {
      let shouldShow = false;
      let notCondition = key.includes('!');
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

  htmls: string[] = [];

  textToHtml(text: string, flags: any[]): string {
    if (text == undefined) return "";
    let prefixes = "";
    let suffixes = " ";
    if (flags != undefined) {
      for (let flag of flags) {
        for (let check of this.checks) {
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

