import { Component, Input } from "@angular/core";

@Component({
    selector: 'container',
    template: `
    <div class="panel panel-default" [dndType]="model.type"
    [dndDraggable]="{draggable:true, effectAllowed:'move'}"
    [dndObject]="model">
    <div class="panel-heading">
      {{model.type}} {{model.id}}
    </div>
    <div class="panel-body" [dndList]="{
        disabled: false,
        effectAllowed: 'move',
        allowedTypes: ['container','item']}"
        [dndModel]="model.columns"
        [dndPlaceholder]="placeholder">
      <ng-container *ngFor="let item of model.columns">
      <ng-container *ngIf="isArray(item)">
        <ng-container *ngFor="let subItem of item">
        <container *ngIf="subItem.type === 'container'"
        [model]="subItem"></container>
      <item *ngIf="subItem.type === 'item'"
        [model]="subItem"></item>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="!isArray(item)">
        <container *ngIf="item.type === 'container'"
          [model]="item"></container>
        <item *ngIf="item.type === 'item'"
          [model]="item"></item>
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

    public isArray(object): boolean {
        return Array.isArray(object);
    }
}