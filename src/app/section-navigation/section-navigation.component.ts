import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Tefila } from '../models/tefila.model';

@Component({
  selector: 'section-navigation',
  templateUrl: './section-navigation.component.html',
  styleUrls: ['./section-navigation.component.css']
})
export class SectionNavigationComponent implements OnChanges {

  @Input() tefila: Tefila;
  sections: string[] = [];

  constructor(private af: AngularFire) { }

  ngOnChanges() {
   if(this.tefila==undefined) return;
    this.sections.length = 0;
    for (let path of this.tefila.subRoutes) {
      this.af.database.object('public/' + path).subscribe(section => {
        this.sections.push(section['title']);
      })
    }
  }

}
