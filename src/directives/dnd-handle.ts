import { Directive, Input, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import {
    DndState,
    DndDraggableConfig,
    DndStateConfig,
} from '../services';
@Directive({
    selector: '[dndHandle]',
})
/**
 * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
 * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
 * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
 * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
 * can work around this by styling the handle element differently when it is being dragged. Use
 * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
 */
export class DndHandle {
    private dragState: DndStateConfig;
    private nativeElement: HTMLElement;
    private draggableString: string = 'draggable';
    constructor(
        private element: ElementRef,
        private dndState: DndState,
    ) {
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');

    }

    @HostListener('dragstart', ['$event'])
    public handleDragStart(event: DragEvent): void {
        event = event['originalEvent'] || event;
        event['_dndHandle'] = true;
    }

    @HostListener('dragend', ['$event'])
    public handleDragEnd(event: DragEvent): void {
        event = event['originalEvent'] || event;

        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    }
}
