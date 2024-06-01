import { Directive, ElementRef, inject } from '@angular/core';
import { DndState } from '../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
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
  readonly nativeElement: HTMLElement = inject(ElementRef).nativeElement;
  readonly dndState: DndState = inject(DndState);
  private readonly draggableString: string = 'draggable';
  constructor() {
    this.nativeElement.setAttribute(this.draggableString, 'true');

    fromEvent(this.nativeElement, 'dragstart')
      .pipe(takeUntilDestroyed())
      .subscribe((event: any) => {
        event = event['originalEvent'] || event;
        event['_dndHandle'] = true;
      });

    fromEvent(this.nativeElement, 'dragend')
      .pipe(takeUntilDestroyed())
      .subscribe((event: any) => {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
          event.stopPropagation();
        }
      });
  }
}
