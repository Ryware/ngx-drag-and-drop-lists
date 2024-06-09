import {
  Directive,
  ElementRef,
  EventEmitter,
  input,
  output,
  inject,
} from '@angular/core';
import { fromEvent } from 'rxjs';

import {
  ALL_EFFECTS,
  DndDraggableConfig,
  DndState,
  DndStateConfig,
  EDGE_MIME_TYPE,
  MIME_TYPE,
  MSIE_MIME_TYPE,
} from '../services';
import { dropAccepted } from './dnd-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[dndDraggable]',
})
export class DndDraggable {
  option = input<DndDraggableConfig | undefined>(
    { draggable: true },
    { alias: 'dndDraggable' }
  );

  dndType = input('');
  dndObject = input<any>();

  disableDrag = input<string | boolean | undefined>(undefined, {
    alias: 'dndDragDisabled',
    transform: ((disable: string | boolean | undefined) => {
      if (disable !== undefined) {
        this.nativeElement.setAttribute(
          this.draggableString,
          (!disable).toString()
        );
      }
    }) as any,
  });

  dndDragStart = output<void>();
  dndDragEnd = output<void>();
  dndCopied = output<void>();
  dndLinked = output<void>();
  dndMoved = output<void>();
  dndCanceled = output<void>();
  dndSelected = output<void>();

  private readonly dndState = inject(DndState);
  private readonly dragState: DndStateConfig = this.dndState.dragState;
  private readonly nativeElement = inject(ElementRef).nativeElement;
  private draggableString: string = 'draggable';

  constructor() {
    this.nativeElement.setAttribute(this.draggableString, 'true');
    /**
     * Workaround to make element draggable in IE9
     */

    dropAccepted.pipe(takeUntilDestroyed()).subscribe(this.handleDropAccepted.bind(this));

    fromEvent(this.nativeElement, 'dragstart')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragStart(event as DragEvent));

    fromEvent(this.nativeElement, 'dragend')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragEnd(event as DragEvent));

      fromEvent(this.nativeElement, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleClick(event as any));

    this.nativeElement.onselectstart = function (): void {
      if (this.dragDrop) this.dragDrop();
    };
  }

  public handleDropAccepted({ item, list }: { item: any; list: any }): void {
    // event = event['originalEvent'] || event;
    if (JSON.stringify(this.dndObject()) === JSON.stringify(item)) {
      let cb: object = {
        copy: 'dndCopied',
        link: 'dndLinked',
        move: 'dndMoved',
        none: 'dndCanceled',
      };
      if (this.dragState) {
        const copyObject = (cb as any)[this.dragState.effectAllowed];
        ((this as any)[copyObject] as EventEmitter<any>).emit();
      }
      this.dndDragEnd.emit();
    }
  }

  public handleDragStart(event: DragEvent): void {
    // disabled check
    if (this.nativeElement.getAttribute(this.draggableString) === 'false')
      return;

    // init drag
    this.dragState.isDragging = true;
    this.dragState.itemType = this.dndType();
    this.dragState.dropEffect = 'none';

    this.dragState.effectAllowed =
      this.option()?.effectAllowed || ALL_EFFECTS[0];
    event.dataTransfer!.effectAllowed = this.dragState.effectAllowed;
    // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
    // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
    let mimeType: string =
      MIME_TYPE +
      (this.dragState.itemType ? '-' + this.dragState.itemType : '');
    try {
      event.dataTransfer!.setData(mimeType, JSON.stringify(this.dndObject()));
    } catch (e) {
      // Setting a custom MIME type did not work, we are probably in IE or Edge.
      let data: string = JSON.stringify({
        item: this.dndObject(),
        type: this.dragState.itemType,
      });
      try {
        event.dataTransfer!.setData(EDGE_MIME_TYPE, data);
      } catch (e) {
        // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
        // does not allow changing the cursor in the dragover event, therefore we have to choose
        // the one we want to display now by setting effectAllowed.
        let effectsAllowed: string[] = this.dndState.filterEffects(
          ALL_EFFECTS,
          this.dragState.effectAllowed
        );
        event.dataTransfer!.effectAllowed = effectsAllowed[0] as any;
        event.dataTransfer!.setData(MSIE_MIME_TYPE, data);
      }
    }

    // add drag classes
    this.nativeElement.classList.add('dndDragging');
    setTimeout(() => {
      if (this.dragState.effectAllowed === 'move') {
        this.nativeElement.style.display = 'none';
      }
    });

    // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
    if ((event as any)._dndHandle && event.dataTransfer?.setDragImage) {
      event.dataTransfer!.setDragImage(this.nativeElement, 0, 0);
    }

    this.dndDragStart.emit();
    event.stopPropagation();
  }

  public handleDragEnd(event: DragEvent): void {
    // Clean up
    this.dragState.isDragging = false;
    this.nativeElement.classList.remove('dndDragging');
    this.nativeElement.style.removeProperty('display');
    event.stopPropagation();
    // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
    setTimeout(
      () => this.nativeElement.classList.remove('dndDraggingSource'),
      0
    );
  }

  public handleClick(event: any): void {
    if (this.nativeElement.hasAttribute('dndSelected')) return;

    event = event['originalEvent'] || event;

    this.dndSelected.emit();

    event.stopPropagation();
  }
}
