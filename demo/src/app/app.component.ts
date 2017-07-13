import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
}
