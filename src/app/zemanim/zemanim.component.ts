import { Component, OnInit } from '@angular/core';
import { HebrewDateService } from '../hebrew-date.service'

@Component({
  selector: 'app-zemanim',
  templateUrl: './zemanim.component.html',
  styleUrls: ['./zemanim.component.css']
})
export class ZemanimComponent implements OnInit {

  zmanim: Zman[] = [];
  dateFormatted: string;

  constructor(private hebrewDate: HebrewDateService) {
    this.dateFormatted = new Date().toDateString();

  }

  ngOnInit() {

    this.zmanim.push({ name: "עלות השחר", time: this.hebrewDate.alos });
    this.zmanim.push({ name: "משיכיר", time: this.hebrewDate.mishyakir });
    this.zmanim.push({ name: "הנץ החמה", time: this.hebrewDate.neitz });
    this.zmanim.push({ name: "שמע גר''א", time: this.hebrewDate.shma_gra });
    this.zmanim.push({ name: "תפילה גר''א", time: this.hebrewDate.tefila_gra });
    this.zmanim.push({ name: "חצות", time: this.hebrewDate.chatzos });
    this.zmanim.push({ name: "מנחה גדולה", time: this.hebrewDate.mincha_gedola });
    this.zmanim.push({ name: "שקיעת החמה", time: this.hebrewDate.shkia });
    this.zmanim.push({ name: "צאת", time: this.hebrewDate.tzais });
    this.zmanim.push({ name: "חצות הלילה", time: this.hebrewDate.chatzos_halaila });
  }

}

export class Zman {
  name: string;
  time: Date;
}
