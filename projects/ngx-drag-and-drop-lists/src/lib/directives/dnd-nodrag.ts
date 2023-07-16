import { Directive, ElementRef, HostListener } from '@angular/core';
import {
    DndState,
    DndStateConfig,
} from '../services';
@Directive({
    selector: '[dndNoDrag]',
})
/**
 * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
 * drag operations. This is especially useful if you want to use input elements inside of
 * dnd-draggable elements or create specific handle elements. Note: This directive does not work
 * in Internet Explorer 9.
 */
export class DndNoDrag {
    private readonly dragState: DndStateConfig;
    private nativeElement: HTMLElement;
    private draggableString: string = 'draggable';
    constructor(
        readonly element: ElementRef,
        readonly dndState: DndState,
    ) {
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');

    }

    @HostListener('dragstart', ['$event'])
    public handleDragStart(event: any): void {
        event = event['originalEvent'] || event;

        if (!event['_dndHandle']) {
            // If a child element already reacted to dragstart and set a dataTransfer object, we will
            // allow that. For example, this is the case for user selections inside of input elements.
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
    }

    @HostListener('dragend', ['$event'])
    public handleDragEnd(event: any): void {
        event = event['originalEvent'] || event;

        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    }
}
