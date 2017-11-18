import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { ItemComponent } from './components/item.component';
import { ContainerComponent } from './components/container.component';
@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ContainerComponent,
  ],
  imports: [
    BrowserModule,
    DndListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
