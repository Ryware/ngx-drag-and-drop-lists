import { ElementRef } from '@angular/core';
import { DndState } from '../services';
export declare class DndNoDrag {
    private element;
    private dndState;
    private dragState;
    private nativeElement;
    private draggableString;
    constructor(element: ElementRef, dndState: DndState);
    handleDragStart(event: DragEvent): void;
    handleDragEnd(event: DragEvent): void;
}
