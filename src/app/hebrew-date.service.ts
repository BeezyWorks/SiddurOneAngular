import { Injectable } from '@angular/core';
import * as Hebcal from 'hebcal';

@Injectable()
export class HebrewDateService {
    formattedDate: string;
    isTachanun: boolean;
    shabbos: boolean;
    chanuka: boolean;

    constructor() {
        var hDate = new Hebcal.HDate();
        this.formattedDate = hDate.toString('h');
        this.isTachanun = hDate.tachanun() != 0;
        this.shabbos = hDate.getDay() == 6;

        var holidaysArray = hDate.holidays();
        for (var holiday of holidaysArray) {
            var englishName = holiday.getDesc('a');

            if (englishName.includes('Chanukah')) {
                this.chanuka = true;
            }
        }

    }

}
