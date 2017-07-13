import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'ngx-drag-and-drop-lists demo';
  public models = {
    selected: null,
    lists: [[], []]
  };
  constructor() {
    for (var i = 1; i <= 3; ++i) {
      this.models.lists[0].push({ label: "Item A" + i });
      this.models.lists[1].push({ label: "Item B" + i });
    }
  }
  // Generate initial model

  public log(text: string) {
    console.log(text);
  }

  public removeMovedItem(index: number, list: any[]) {
    list.splice(index, 1);
  }
}
