import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DndListModule } from './ngx-drag-and-drop-lists';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DndListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
