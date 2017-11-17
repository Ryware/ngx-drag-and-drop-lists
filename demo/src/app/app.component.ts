import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  public simpleList = [
    [
      { 'name': 'John' },
      { 'name': 'Smith' },
      { 'name': 'George' },
    ],
    [
      { 'name': 'Jennifer' },
      { 'name': 'Laura' },
      { 'name': 'Georgina' },
    ]
  ];

  public typedList = [
    [
      { 'name': 'John', 'type': 'male' },
      { 'name': 'Smith', 'type': 'male' },
      { 'name': 'George', 'type': 'male' },
    ],
    [
      { 'name': 'Jennifer', 'type': 'female' },
      { 'name': 'Laura', 'type': 'female' },
      { 'name': 'Georgina', 'type': 'female' },
    ],
    [
      { 'name': 'Timmy', 'type': 'male' },
      { 'name': 'Karen', 'type': 'female' },
    ]
  ];
  constructor() {

  }
}
