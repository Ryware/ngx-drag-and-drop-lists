import { Component, Input } from "@angular/core";

@Component({
    selector: 'container',
    template: `
        <div class="col-md-12">{{model.type}} {{model.id}}</div>
    `
})
export class ItemComponent {
    @Input() model: { type: string, id: number, columns };
}