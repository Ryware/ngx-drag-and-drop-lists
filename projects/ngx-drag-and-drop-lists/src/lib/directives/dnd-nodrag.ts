import { Directive, ElementRef, inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DndState, DndStateConfig } from '../services';
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
  private readonly dndState = inject(DndState);
  private readonly dragState: DndStateConfig = this.dndState.dragState;
  private nativeElement: HTMLElement = inject(ElementRef).nativeElement;
  private draggableString: string = 'draggable';
  constructor() {
    this.nativeElement.setAttribute(this.draggableString, 'true');

    fromEvent(this.nativeElement, 'dragstart')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragStart(event as DragEvent));

    fromEvent(this.nativeElement, 'dragend')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragEnd(event as DragEvent));
  }

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

  public handleDragEnd(event: any): void {
    event = event['originalEvent'] || event;

    if (!event['_dndHandle']) {
      event.stopPropagation();
    }
  }
}
