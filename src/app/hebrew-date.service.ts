import { Injectable } from '@angular/core';
import * as Hebcal from 'hebcal';

@Injectable()
export class HebrewDateService {
  formattedDate: string;
  isTachanun: boolean;

  constructor() {
    var hDate = new Hebcal.HDate();
    this.formattedDate = hDate.toString('h');
    this.isTachanun = hDate.tachanun() != 0;
  }

}
