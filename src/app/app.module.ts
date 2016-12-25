import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import {RootNodeComponent} from './rootnode.component';
import {SectionComponent} from './section.component';
import {TefilaComponent} from './tefila.component';
import {BrochaComponent} from './brocha.component';

export const firebaseConfig = {
    apiKey: "AIzaSyBDpTCrfZknC0uYnTdeedD3NC4joV8gSus",
    authDomain: "hellofire-28f44.firebaseapp.com",
    databaseURL: "https://hellofire-28f44.firebaseio.com",
    storageBucket: "hellofire-28f44.appspot.com",
    messagingSenderId: "58775725392"
  };

@NgModule({
  declarations: [
    AppComponent,
    RootNodeComponent,
    SectionComponent,
    TefilaComponent,
    BrochaComponent
  ],
  imports: [
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
