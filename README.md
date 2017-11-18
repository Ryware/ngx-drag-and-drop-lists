ngx-drag-and-drop-lists
===========================
Angular directives that allow you to build sortable lists with the native HTML5 drag & drop API. The directives can also be nested to bring drag & drop to your WYSIWYG editor, your tree, or whatever fancy structure you are building.

### [Demo](https://ngx-drag-and-drop-lists.herokuapp.com/)


## Credits to the original creator
    
This library is inspired by the https://github.com/marceljuenemann/angular-drag-and-drop-lists library which was written in AngularJS.

**Drag Element Inputs**
* `dndDraggable` Required attribute. Signifies that this element is part of the dndDraggable. Can receive options on how to behave of the following type:
```
    interface DndDraggableConfig {
        draggable: boolean;
        effectAllowed: string;
    }
```

* `dndObject` Required attribute. Represents the object that is actually dragged, the data.

* `dndType`  Required attribute. Tells what is the type of the data

* `dndDragDisabled` Tells whether the drag ability is disabled or not

**Drag Element Outputs**

* `dndDragStart` An event that fires when a drag starts

* `dndDragEnd` An event that fires when a drag ends

* `dndCopied` An event that fires when a copy effect happens

* `dndMoved` An event that fires when a move effect happens

* `dndLinked` An event that fires when a link effect happens

* `dndCanceled` An event that fires when a drag cancels

* `dndSelected` An event that fires when an element is clicked and not dragged

**CSS classes**
* `dndDragging` This class will be added to the element while the element is being dragged. It will affect both the element you see while dragging and the source element that stays at it's position. Do not try to hide the source element with this class, because that will abort the drag operation.
* `dndDraggingSource` This class will be added to the element after the drag operation was started, meaning it only affects the original element that is still at it's source position, and not the "element" that the user is dragging with his mouse pointer


**Drag List Inputs**

* `dndList` Required attribute. Signifies that this list is part of the dndList. Can receive options on how to behave of the following type:
```
    interface DndListSettings {
        allowedTypes: string[];
        effectAllowed: string;
        disabled: boolean;
        externalSources: boolean;
        horizontal: boolean;
    }
```

* `dndModel` Required attribute. The array that holds the objects

* `dndPlaceholder` An element that should be displayed as a placeholder before a drag. 

**Drag Element Outputs**

* `dndDragOver` An event that fires when an element is dragged over a list

* `dndDrop` An event that fires when an element is dropped upon a list

* `dndInserted` An event that happens after a drop if the object was actually inserted

**CSS classes**
* `dndDragover` This class will be added to the list while an element is being dragged over the list.

**dndNoDrag attribute**

Use the `dndNoDrag` attribute inside of `dndDraggable` elements to prevent them from starting drag operations. This is especially useful if you want to use input elements inside of `dndDraggable` elements or create specific handle elements.


**dndHandle attribute**

Use the `dndHandle` directive within a `dndNoDrag` element in order to allow dragging of that element after all. Therefore, by combining `dndNoDrag` and `dndHandle` you can allow `dndDraggable` elements to only be dragged via specific *handle* elements.

**Example 1** 

```
      <div *ngFor="let list of models.lists;let i = index">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title">List {{i}}</h3>
          </div>
          <div class="panel-body">
            <ul [dndList]
              [dndModel]="list">
              <li *ngFor="let item of list;let i = index"
                [dndDraggable]
                [dndObject]="item"
                (dndMoved)="removeMovedItem(i, list)"
                [class.selected]="models.selected === item">
                {{item.label}}
              </li>
            </ul>
          </div>
        </div>
```


**Example 2** 

```
      <div *ngFor="let list of models.lists;let i = index">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title">List {{i}}</h3>
          </div>
          <div class="panel-body">
            <ul [dndList]="{
                disabled: false,
                effectAllowed: 'move',
                allowedTypes: ['item']}"
              [dndModel]="list">
              <li *ngFor="let item of list;let i = index"
                [dndType]="'item'"
                [dndDraggable]="{draggable:true, effectAllowed:'move'}"
                [dndObject]="item"
                (dndMoved)="removeMovedItem(i, list)"
                (dndSelected)="log('selected')"
                [class.selected]="models.selected === item">
                {{item.label}}
              </li>
            </ul>
          </div>
        </div>
```