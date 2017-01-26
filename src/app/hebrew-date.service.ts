import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';
import * as Hebcal from 'hebcal';

@Injectable()
export class HebrewDateService {
    $evaluationKeys: FirebaseObjectObservable<any>;
    hDate: any;

    private formattedDateSource = new BehaviorSubject<string>("");
    $formattedDate = this.formattedDateSource.asObservable();
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

    constructor(private af: AngularFire) {
        this.$evaluationKeys = af.database.object('public/evaluations/calendar');

        this.hDate = new Hebcal.HDate();

        window.navigator.geolocation.getCurrentPosition((position => {
            this.hDate.setLocation(position.coords.latitude, position.coords.longitude);
            let zemanim = this.hDate.getZemanim();
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

            if (new Date().getUTCMilliseconds().valueOf() > this.shkia.getUTCMilliseconds()) {
                this.hDate = this.hDate.next();
            }

            this.initHDate();
        }));

        this.initHDate();



    }

    initHDate() {

        this.formattedDateSource.next(this.hDate.toString('h'));
        this.isTachanun = this.hDate.tachanun() != 0;
        this.shabbos = this.hDate.getDay() == 6;

        var holidaysArray = this.hDate.holidays();
        for (var holiday of holidaysArray) {
            var englishName = holiday.getDesc('a');

            if (englishName.includes('Chanukah')) {
                this.chanuka = true;
            }
        }
    }

}
