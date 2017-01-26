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
    { key: 'large', openingTag: '<big>', closingTag: '</big>' },
    { key: 'small', openingTag: '<small>', closingTag: '</small>' },
    { key: 'subtitle', openingTag: '<small>', closingTag: '</small>' },
    { key: 'italic', openingTag: '<em>', closingTag: '</em>' }
  ]

  calendarEvaluations: any;
  preferenceEvaluations: any;

  constructor(public af: AngularFire, public hebrewDate: HebrewDateService, public userPrefs: UserPrefsService) {

    userPrefs.$evaluationKeys.subscribe(keys => {
      this.preferenceEvaluations = keys;
    })

    hebrewDate.$evaluationKeys.subscribe(keys => {
      this.calendarEvaluations = keys;
    })
  }

  transform(brochaArray: any, args?: any): any {
    let html = "";
    if (brochaArray == undefined) return "";
    for (let raw of brochaArray[0]) {
      if (raw == undefined) continue;
      let text = raw['text'];
      let ref = raw['ref'];
      let translations = raw['translations'];

      // if(translations!=undefined){
      //   text=translations['english'];
      // }

      if (raw == "linebreak" || text == "linebreak") {
        text = "<br>";
      }

      let evaluation = true;
      let evaluationRaw = raw['evaluations'];
      if (evaluationRaw != undefined) {
        let isAnd = evaluationRaw['type'] == 'and';
        evaluation = this.evaluateBoolFlags(evaluationRaw, isAnd);
      }
      // let andEval = this.evaluateBoolFlags(raw['and'], true);
      // let orEval = this.evaluateBoolFlags(raw['or'], false);
      if (evaluation) {
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
  evaluateBoolFlags(flags: any, andEvaluation: boolean): boolean {
    if (flags == undefined) return true;
    for (let key in flags) {
      if (key == 'type') continue;

      let shouldShow = false;

      if (this.userPrefs.hasOwnProperty(key)) {
        shouldShow = this.userPrefs[key];
      }

      if (this.hebrewDate.hasOwnProperty(key)) {
        shouldShow = this.hebrewDate[key];
      }

      if (flags[key] == "false") {
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

