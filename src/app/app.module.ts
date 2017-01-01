import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import {StickyModule} from 'ng2-sticky-kit/ng2-sticky-kit';
import {Gravatar} from 'ng2-gravatar-directive';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {HebrewDateService} from './hebrew-date.service';
import {UserPrefsService} from './user-prefs.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AboutComponent } from './about/about.component';
import { SiddurComponent } from './siddur/siddur.component';
import { TextComponent } from './text/text.component';
import { SafeHtmlPipe } from './safe-html.pipe';

export const firebaseConfig = {
  apiKey: "AIzaSyBDpTCrfZknC0uYnTdeedD3NC4joV8gSus",
  authDomain: "hellofire-28f44.firebaseapp.com",
  databaseURL: "https://hellofire-28f44.firebaseio.com",
  storageBucket: "hellofire-28f44.appspot.com",
  messagingSenderId: "58775725392"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

const appRoutes: Routes = [
  { path: 'siddur', component: SiddurComponent },
  { path: 'about', component: AboutComponent },
   { path: '',   redirectTo: '/siddur', pathMatch: 'full' },
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    SiddurComponent,
    TextComponent,
    SafeHtmlPipe,
    Gravatar
  ],
  imports: [
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    FlexLayoutModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    StickyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
