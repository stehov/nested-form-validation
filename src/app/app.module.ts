import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IndividualsComponent } from './individuals/individuals.component';
import { IndividualListComponent } from './individuals/individual-list/individual-list.component';
import { IndividualComponent } from './individuals/individual/individual.component';
import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    IndividualsComponent,
    IndividualListComponent,
    IndividualComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
