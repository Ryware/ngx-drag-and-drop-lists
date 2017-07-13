import { NgModule } from '@angular/core';
import { DndDraggable, DndHandle, DndList, DndNoDrag } from '../directives';
import { DndState } from '../services';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        DndDraggable, DndList, DndNoDrag, DndHandle,
    ],
    entryComponents: [],
    declarations: [DndDraggable, DndList, DndNoDrag, DndHandle],
    providers: [
        DndState,
    ],
})
export class DndListModule {
}

