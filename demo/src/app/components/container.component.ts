import { Component, Input } from "@angular/core";

@Component({
    selector: 'container',
    template: `
    <div class="panel">
    <div class="panel-heading>
    {{model.type}} {{model.id}}
    </div>
    <div class="panel-body">
    <ng-container *ngFor="let item of model.columns">
            <container *ngIf="item.type === 'container" [model]="item"></container>
            <item *ngIf="item.type === 'type'" [model]="item"></item>
    </ng-container>
        </div>
        </div>
    `
})
export class ContainerComponent {
    @Input() model: { type: string, id: number, columns };
}