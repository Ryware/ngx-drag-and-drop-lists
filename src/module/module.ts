import { NgModule } from '@angular/core';
import { DndDraggable, DndHandle, DndList, DndNoDrag } from '../directives';
import { DndState } from '../services';
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

