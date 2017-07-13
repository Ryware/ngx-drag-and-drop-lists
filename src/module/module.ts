import { NgModule } from '@angular/core';
import { DndDraggable, DndState, DndHandle, DndList, DndNoDrag } from '../index';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        DndDraggable, DndHandle, DndList, DndNoDrag,
    ],
    entryComponents: [],
    declarations: [DndDraggable, DndHandle, DndList, DndNoDrag],
    providers: [
        DndState,
    ],
})
export class DndListModule {
}

