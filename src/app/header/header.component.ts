import { Component, OnInit } from '@angular/core';
import {HebrewDateService} from '../hebrew-date.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HebrewDateService]
})
export class HeaderComponent implements OnInit {
  dateTitle: string;

  constructor(private hebrewDate: HebrewDateService) {
    this.dateTitle = hebrewDate.formattedDate;
  }

  ngOnInit() {
  }

}
