import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  // simple
  public models = {
    selected: null,
    lists: [[], []]
  };

  // typed
  public typedLists = [
    {
      label: 'Men',
      allowedTypes: ['man'],
      max: 4,
      people: [
        { name: 'Bob', type: 'man' },
        { name: 'Charlie', type: 'man' },
        { name: 'Dave', type: 'man' }
      ]
    },
    {
      label: 'Women',
      allowedTypes: ['woman'],
      max: 4,
      people: [
        { name: 'Alice', type: 'woman' },
        { name: 'Eve', type: 'woman' },
        { name: 'Peggy', type: 'woman' }
      ]
    },
    {
      label: 'People',
      allowedTypes: ['man', 'woman'],
      max: 6,
      people: [
        { name: 'Frank', type: 'man' },
        { name: 'Mallory', type: 'woman' },
        { name: 'Alex', type: 'unknown' },
        { name: 'Oscar', type: 'man' },
        { name: 'Wendy', type: 'woman' }
      ]
    }
  ];


  // nested
  public nested = {
    selected: null,
    templates: [
      { type: 'item', id: 2 },
      { type: 'container', id: 1, columns: [[], []] }
    ],
    dropzones: [
      [
        {
          'type': 'container',
          'id': 1,
          'columns': [
            [
              {
                'type': 'item',
                'id': '1'
              },
              {
                'type': 'item',
                'id': '2'
              }
            ],
            [
              {
                'type': 'item',
                'id': '3'
              }
            ]
          ]
        },
        {
          'type': 'item',
          'id': '4'
        },
        {
          'type': 'item',
          'id': '5'
        },
        {
          'type': 'item',
          'id': '6'
        }
      ],
      [
        {
          'type': 'item',
          'id': 7
        },
        {
          'type': 'item',
          'id': '8'
        },
        {
          'type': 'container',
          'id': '2',
          'columns': [
            [
              {
                'type': 'item',
                'id': '9'
              },
              {
                'type': 'item',
                'id': '10'
              },
              {
                'type': 'item',
                'id': '11'
              }
            ],
            [
              {
                'type': 'item',
                'id': '12'
              },
              {
                'type': 'container',
                'id': '3',
                'columns': [
                  [
                    {
                      'type': 'item',
                      'id': '13'
                    }
                  ],
                  [
                    {
                      'type': 'item',
                      'id': '14'
                    }
                  ]
                ]
              },
              {
                'type': 'item',
                'id': '15'
              },
              {
                'type': 'item',
                'id': '16'
              }
            ]
          ]
        },
        {
          'type': 'item',
          'id': 16
        }
      ]
    ]
  };
  constructor() {
    // Generate initial model
    for (let i = 1; i <= 3; ++i) {
      this.models.lists[0].push({ label: 'Item A' + i });
      this.models.lists[1].push({ label: 'Item B' + i });
    }
  }

  public log(text: string) {
    console.log(text);
  }

  public removeMovedItem(index: number, list: any[]) {
    console.log(list, index);
    list.splice(index, 1);
  }
}
