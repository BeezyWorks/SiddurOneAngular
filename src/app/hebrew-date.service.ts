import { Injectable } from '@angular/core';
import * as Hebcal from 'hebcal';

@Injectable()
export class HebrewDateService {
    formattedDate: string;
    isTachanun: boolean;
    shabbos: boolean;
    chanuka: boolean;

    alos: Date;
    mishyakir: Date;
    neitz: Date;
    shma_gra: Date;
    tefila_gra: Date;
    chatzos: Date;
    mincha_gedola: Date;
    candel_light: Date;
    shkia: Date;
    fast_end: Date;
    tzais: Date;
    tzais_rt: Date;
    chatzos_halaila: Date;

    constructor() {
        let hDate = new Hebcal.HDate();
        
        window.navigator.geolocation.getCurrentPosition((position => {
            hDate.setLocation(position.coords.latitude, position.coords.longitude);
            let zemanim = hDate.getZemanim();
            this.alos = zemanim['alot_hashachar'];
            this.mishyakir = zemanim['misheyakir'];
            this.neitz = zemanim['neitz_hachama'];
            this.shma_gra = zemanim['sof_zman_shma'];
            this.tefila_gra = zemanim['sof_zman_tfilla'];
            this.chatzos = zemanim['chatzot'];
            this.mincha_gedola = zemanim['mincha_gedola'];
            this.shkia = zemanim['shkiah'];
            this.tzais = zemanim['tzeit'];
            this.chatzos_halaila = zemanim['chatzot_night'];
        }));
        console.log(hDate['long']);




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
