import { Component, Input } from "@angular/core";

@Component({
  selector: 'container',
  template: `
    <div class="panel panel-default" [dndType]="model.type"
    [dndDraggable]
    (dndMoved)="removeItem(model, list)"
    [dndObject]="model">
    <div class="panel-heading">
      {{model.type}} {{model.id}}
    </div>
    <div class="panel-body" [dndList]="{
        allowedTypes: ['container','item']}"
        [dndModel]="model.columns"
        [dndPlaceholder]="placeholder">
      <ng-container *ngFor="let item of model.columns">
      <ng-container *ngIf="isArray(item)">
        <ng-container *ngFor="let subItem of item">
        <container *ngIf="subItem.type === 'container'"
        [list]="item"
        [model]="subItem"></container>
        <div *ngIf="subItem.type === 'item'" [dndType]="subItem.type"
        [dndDraggable]="{draggable:true, effectAllowed:'move'}"
        (dndMoved)="removeItem(subItem, item)"
        [dndObject]="subItem" class="col-md-12">{{subItem.type}} {{subItem.id}}</div>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="!isArray(item)">
        <container *ngIf="item.type === 'container'" [list]="model.columns"
          [model]="item"></container>
         
          <div *ngIf="item.type === 'item'" [dndType]="item.type"
          [dndDraggable]="{draggable:true, effectAllowed:'move'}"
          (dndMoved)="removeItem(item, model.columns)"
          [dndObject]="item" class="col-md-12">{{item.type}} {{item.id}}</div>

          </ng-container>
      </ng-container>
    </div>
  </div>

  <div class="dndPlaceholder col-md-12"
  #placeholder></div>
    `
})
export class ContainerComponent {
  @Input() model: { type: string, id: number, columns };
  @Input() list: any[];

  public isArray(object): boolean {
    return Array.isArray(object);
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }
}