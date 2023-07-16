import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { ContainerComponent } from './container.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
  ],
  imports: [
    BrowserModule,
    DndListModule,
  ],
  exports: [
    DndListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
