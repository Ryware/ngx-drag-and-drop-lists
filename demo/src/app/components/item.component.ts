import { Component, Input } from "@angular/core";

@Component({
    selector: 'item',
    template: `
        <div  [dndType]="model.type"
        [dndDraggable]="{draggable:true, effectAllowed:'move'}"
        [dndObject]="model" class="col-md-12">{{model.type}} {{model.id}}</div>
    `
})
export class ItemComponent {
    @Input() model: { type: string, id: number, columns };
}