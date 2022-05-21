import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {IndexComponent} from './components/index/index.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';

import {AngularFireModule} from '@angular/fire/compat';
import {environment} from 'src/environments/environment';
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FormsModule} from "@angular/forms";
import { MainComponent } from './components/main/main.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { RemindersContainerComponent } from './components/reminders-container/reminders-container.component';
import { NotesContainerComponent } from './components/notes-container/notes-container.component';
import { ReminderFormComponent } from './components/reminder-form/reminder-form.component';
import { DateTransformerPipe } from './pipes/date-transformer.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    NoteFormComponent,
    RemindersContainerComponent,
    NotesContainerComponent,
    ReminderFormComponent,
    DateTransformerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
