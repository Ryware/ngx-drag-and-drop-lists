import {Directive, ElementRef, inject, input, output, OutputEmitterRef,} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {
  ALL_EFFECTS,
  DndListSettings,
  DndState,
  DndStateConfig,
  EDGE_MIME_TYPE,
  MIME_TYPE,
  MSIE_MIME_TYPE,
} from '../services';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export const dropAccepted: Subject<any> = new Subject();

@Directive({
  selector: '[dndList]',
})
export class DndList {
  option = input<DndListSettings | undefined>(
    {
      disabled: false,
      effectAllowed: 'move',
      allowedTypes: undefined,
      horizontal: false,
    },
    {alias: 'dndList'}
  );
  dndModel = input<any[]>();

  dndPlaceholder = input<Element | undefined>(undefined, {
    transform: ((placeholder: Element) => {
      this.placeholder = placeholder;
      placeholder.parentNode?.removeChild(placeholder);
    }) as any,
  });

  dndDragOver = output<void>();
  dndDrop = output<void>();
  dndInserted = output<void>();

  private readonly dndState = inject(DndState);
  private readonly dragState: DndStateConfig = this.dndState.dragState;
  private nativeElement: HTMLElement = inject(ElementRef).nativeElement;
  private listSettings: {} = {};
  private placeholder: Element = this.getPlaceholderElement();

  constructor() {
    fromEvent(this.nativeElement, 'dragenter')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragEnter(event));
    fromEvent(this.nativeElement, 'dragover')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDragOver(event));
    fromEvent(this.nativeElement, 'drop')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.handleDrop(event));
    fromEvent(this.nativeElement, 'dragleave')
      .pipe(takeUntilDestroyed())
      .subscribe((events) => this.handleDragLeave(event));
  }

  public handleDragEnter(event: any): boolean {
    event = event['originalEvent'] || event;
    const mimeType: string | null = this.getMimeType(event.dataTransfer.types);
    if (!mimeType || !this.isDropAllowed(this.getItemType(mimeType))) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  public handleDragOver(event: any): boolean {
    event = event['originalEvent'] || event;
    const mimeType: string | null = this.getMimeType(event.dataTransfer.types);
    const itemType: string | null | undefined = this.getItemType(mimeType);
    if (!mimeType || !this.isDropAllowed(itemType)) {
      return true;
    }
    // Make sure the placeholder is shown, which is especially important if the list is empty.
    if (this.placeholder.parentNode !== this.nativeElement) {
      this.nativeElement.appendChild(this.placeholder);
    }

    if (event.target !== this.nativeElement) {
      // Try to find the node direct directly below the list node.
      let listItemNode: Node = event.target as Node;
      while (
        listItemNode.parentNode !== this.nativeElement &&
        listItemNode.parentNode
        ) {
        listItemNode = listItemNode.parentNode;
      }

      if (
        listItemNode.parentNode === this.nativeElement &&
        listItemNode !== this.placeholder
      ) {
        let isFirstHalf: boolean;
        // If the mouse pointer is in the upper half of the list item element,
        // we position the placeholder before the list item, otherwise after it.
        const rect: ClientRect = (
          listItemNode as Element
        ).getBoundingClientRect();
        if (this.option() && this.option()!.horizontal) {
          isFirstHalf = event.clientX < rect.left + rect.width / 2;
        } else {
          isFirstHalf = event.clientY < rect.top + rect.height / 2;
        }
        this.nativeElement.insertBefore(
          this.placeholder,
          isFirstHalf ? listItemNode : listItemNode.nextSibling
        );
      }
    }

    // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
    // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
    // drops from external sources, as that throws an exception.
    let ignoreDataTransfer: boolean = mimeType === MSIE_MIME_TYPE;
    let dropEffect: string = this.getDropEffect(event, ignoreDataTransfer);
    if (dropEffect === 'none') return this.stopDragOver();

    // At this point we invoke the callback, which still can disallow the drop.
    // We can't do this earlier because we want to pass the index of the placeholder.
    // if (this.dndDragOver &&
    //     !this.invokeCallback(this.dndDragOver, event, dropEffect, itemType)) {
    //     return this.stopDragOver();
    // }

    event.preventDefault();
    if (!ignoreDataTransfer) {
      event.dataTransfer.dropEffect = dropEffect;
    }

    this.nativeElement.classList.add('dndDragover');
    event.stopPropagation();
    return false;
  }

  public handleDrop(event: any): boolean {
    event = event['originalEvent'] || event;

    // Check whether the drop is allowed and determine mime type.
    let mimeType: string | null = this.getMimeType(event.dataTransfer.types);
    let itemType: string | null | undefined = this.getItemType(mimeType);
    if (!mimeType || !this.isDropAllowed(itemType)) return true;

    // The default behavior in Firefox is to interpret the dropped element as URL and
    // forward to it. We want to prevent that even if our drop is aborted.
    event.preventDefault();

    let data: any = undefined;
    // Unserialize the data that was serialized in dragstart.
    try {
      data = JSON.parse(event.dataTransfer.getData(mimeType));
    } catch (e) {
      return this.stopDragOver();
    }

    // Drops with invalid types from external sources might not have been filtered out yet.
    if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
      itemType = data.type || undefined;
      data = data.item;
      if (!this.isDropAllowed(itemType)) return this.stopDragOver();
    }

    // Special handling for internal IE drops, see dragover handler.
    let ignoreDataTransfer: boolean = mimeType === MSIE_MIME_TYPE;
    let dropEffect: string = this.getDropEffect(event, ignoreDataTransfer);
    if (dropEffect === 'none') return this.stopDragOver();

    // Invoke the callback, which can transform the transferredObject and even abort the drop.
    let index: number = this.getPlaceholderIndex();
    // create an offset to account for extra elements (including the placeholder element)
    const startIndex = this.dndModel()!.findIndex((item: any) => {
      return JSON.stringify(item) === JSON.stringify(data);
    });
    let delta = 1;
    if (this.nativeElement.children.length === this.dndModel()!.length && index < startIndex) {
      delta = 0;
    }
    let offset: number = this.nativeElement.children.length - delta - this.dndModel()!.length;

    if (this.dndDrop) {
      this.invokeCallback(
        this.dndDrop,
        event,
        dropEffect,
        itemType,
        index,
        data
      );
      if (!data) return this.stopDragOver();
    }

    // The drop is definitely going to happen now, store the dropEffect.
    this.dragState.dropEffect = dropEffect;
    if (!ignoreDataTransfer) {
      event.dataTransfer.dropEffect = dropEffect;
    }

    // Insert the object into the array, unless dnd-drop took care of that (returned true).
    if (data !== true && this.dndModel()) {
      let insertionPoint: number = index - offset;
      if (insertionPoint < 0) {
        insertionPoint = 0;
      }
      this.dndModel()!.splice(insertionPoint, 0, data);
    }
    this.invokeCallback(
      this.dndInserted,
      event,
      dropEffect,
      itemType,
      index,
      data
    );

    // Tell old object to handle itself
    dropAccepted.next({item: data, list: this.dndModel()});

    // Clean up
    this.stopDragOver();
    event.stopPropagation();
    return false;
  }

  public handleDragLeave(event: any): void {
    event = event['originalEvent'] || event;

    let newTarget: Element | null = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    if (this.nativeElement.contains(newTarget) && !event['_dndPhShown']) {
      // Signalize to potential parent lists that a placeholder is already shown.
      event['_dndPhShown'] = true;
    } else {
      this.stopDragOver();
    }
  }

  private getPlaceholderElement(): Element {
    let placeholder: Element | undefined = undefined;
    if (this.nativeElement.children) {
      for (let i: number = 1; i < this.nativeElement.children.length; i++) {
        const child: Element | null = this.nativeElement.children.item(i);
        if (child?.classList.contains('dndPlaceholder')) {
          placeholder = child;
        }
      }
    }
    let placeholderDefault: Element = document.createElement('li');
    placeholderDefault.classList.add('dndPlaceholder');
    return placeholder || placeholderDefault;
  }

  /**
   * Given the types array from the DataTransfer object, returns the first valid mime type.
   * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
   */
  private getMimeType(types: readonly string[]): string | null {
    if (!types) return MSIE_MIME_TYPE; // IE 9 workaround.
    for (let i: number = 0; i < types.length; i++) {
      if (
        types[i] === MSIE_MIME_TYPE ||
        types[i] === EDGE_MIME_TYPE ||
        types[i].substr(0, MIME_TYPE.length) === MIME_TYPE
      ) {
        return types[i];
      }
    }
    return null;
  }

  /**
   * Determines the type of the item from the dndState, or from the mime type for items from
   * external sources. Returns undefined if no item type was set and null if the item type could
   * not be determined.
   */
  private getItemType(mimeType: string | null): string | null | undefined {
    if (this.dragState.isDragging) return this.dragState.itemType || undefined;
    if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) return null;
    return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
  }

  /**
   * Checks various conditions that must be fulfilled for a drop to be allowed, including the
   * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
   */
  private isDropAllowed(itemType: string | null | undefined): boolean {
    if (this.option()) {
      if (this.option()!.disabled) return false;
      if (this.option()!.max && this.dndModel()!.length === this.option()!.max)
        return false;
      if (!this.option()!.externalSources && !this.dragState.isDragging)
        return false;
      if (!this.option()!.allowedTypes || itemType === null) return true;
    }
    return !!itemType && this.option()!.allowedTypes?.indexOf(itemType) !== -1;
  }

  /**
   * Determines which drop effect to use for the given event. In Internet Explorer we have to
   * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
   * In those cases we rely on dndState to filter effects. Read the design doc for more details:
   * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
   */
  private getDropEffect(event: DragEvent, ignoreDataTransfer: boolean): string {
    let effects: string[] = Object.assign([], ALL_EFFECTS);
    if (!ignoreDataTransfer) {
      effects = this.dndState.filterEffects(
        effects,
        event.dataTransfer!.effectAllowed
      );
    }
    if (this.dragState.isDragging) {
      effects = this.dndState.filterEffects(
        effects,
        this.dragState.effectAllowed
      );
    }
    if (this.option() && this.option()!.effectAllowed) {
      effects = this.dndState.filterEffects(
        effects,
        this.option()!.effectAllowed as string
      );
    }
    // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
    // therefore the following modifier keys will only affect other operating systems.
    if (!effects.length) {
      return 'none';
    } else if (event.ctrlKey && effects.indexOf('copy') !== -1) {
      return 'copy';
    } else if (event.altKey && effects.indexOf('link') !== -1) {
      return 'link';
    } else {
      return effects[0];
    }
  }

  /**
   * Small helper function that cleans up if we aborted a drop.
   */
  private stopDragOver(): boolean {
    this.placeholder.parentNode?.removeChild(this.placeholder);
    this.nativeElement.classList.remove('dndDragover');
    return true;
  }

  /**
   * Invokes a callback with some interesting parameters and returns the callbacks return value.
   */
  private invokeCallback(
    eventEmitter: OutputEmitterRef<any>,
    event: DragEvent,
    dropEffect: string,
    itemType: string | null | undefined,
    index?: number,
    item?: any
  ): boolean {
    eventEmitter.emit({
      dropEffect: dropEffect,
      event: event,
      external: !this.dragState.isDragging,
      index: index !== undefined ? index : this.getPlaceholderIndex(),
      item: item || undefined,
      type: itemType,
    });
    return true;
  }

  /**
   * We use the position of the placeholder node to determine at which position of the array the
   * object needs to be inserted
   */
  private getPlaceholderIndex(): number {
    // Remove the dragging element to get the correct index of the placeholder;
    for (let i: number = 0; i < this.nativeElement.children.length; i++) {
      if (this.nativeElement.children[i].classList.contains('dndDragging')) {
        const child = this.nativeElement.children[i];
        this.nativeElement.children[i].parentNode?.removeChild(child);
        child.remove();
        break;
      }
    }
    return Array.prototype.indexOf.call(
      this.nativeElement.children,
      this.placeholder
    );
  }
}
