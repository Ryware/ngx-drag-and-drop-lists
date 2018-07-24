import { Directive, Input, Output, OnDestroy, OnInit, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { DndState } from '../services';
import {
    DndDraggableConfig,
    DndStateConfig,
    ALL_EFFECTS,
    MIME_TYPE,
    EDGE_MIME_TYPE,
    MSIE_MIME_TYPE,
} from '../index';
import { dropAccepted } from './dnd-list';
import { Subscription } from 'rxjs/Subscription';
@Directive({
    selector: '[dndDraggable]',
})
export class DndDraggable implements OnInit, OnDestroy {
    @Input('dndDraggable') public option: DndDraggableConfig = <DndDraggableConfig>{ draggable: true };
    @Input('dndType') public dndType: string;
    @Input('dndObject') public dndObject: HTMLElement;
    @Input('dndDragDisabled') public set disableDrag(disable: string | boolean) {
        if (disable !== undefined) {
            this.nativeElement.setAttribute(this.draggableString, (!disable).toString());
        }
    }
    @Output('dndDragStart') public dndDragStart: EventEmitter<any> = new EventEmitter();
    @Output('dndDragEnd') public dndDragEnd: EventEmitter<any> = new EventEmitter();
    @Output('dndCopied') public dndCopied: EventEmitter<any> = new EventEmitter();
    @Output('dndLinked') public dndLinked: EventEmitter<any> = new EventEmitter();
    @Output('dndMoved') public dndMoved: EventEmitter<any> = new EventEmitter();
    @Output('dndCanceled') public dndCanceled: EventEmitter<any> = new EventEmitter();
    @Output('dndSelected') public dndSelected: EventEmitter<any> = new EventEmitter();

    private dragState: DndStateConfig;
    private dropSubscription: Subscription;
    private nativeElement: HTMLElement;
    private draggableString: string = 'draggable';
    constructor(
        private element: ElementRef,
        private dndState: DndState,
    ) {
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
        /**
         * Workaround to make element draggable in IE9
         */
        this.nativeElement.onselectstart = function (): void {
            if (this.dragDrop) this.dragDrop();
        };
    }

    public ngOnInit(): void {
        this.dropSubscription = dropAccepted.subscribe(({ item, list }) => {
            // event = event['originalEvent'] || event;
            if (JSON.stringify(this.dndObject) === JSON.stringify(item)) {
                let cb: object = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
                if (this.dragState) {
                    (this[cb[this.dragState.effectAllowed]] as EventEmitter<any>).emit();
                }
                this.dndDragEnd.emit();
            }
        });
    }

    public ngOnDestroy(): void {
        this.dropSubscription.unsubscribe();
    }

    @HostListener('dragstart', ['$event'])
    public handleDragStart(event: DragEvent): void {

        // disabled check
        if (this.nativeElement.getAttribute(this.draggableString) === 'false')
            return;

        // init drag
        this.dragState.isDragging = true;
        this.dragState.itemType = this.dndType;
        this.dragState.dropEffect = 'none';
        if (!this.option) {
            this.option = <DndDraggableConfig>{ draggable: true };
        }
        this.dragState.effectAllowed = this.option.effectAllowed || ALL_EFFECTS[0];
        event.dataTransfer.effectAllowed = this.dragState.effectAllowed;
        // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
        // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
        let mimeType: string = MIME_TYPE + (this.dragState.itemType ? ('-' + this.dragState.itemType) : '');
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndObject));
        } catch (e) {
            // Setting a custom MIME type did not work, we are probably in IE or Edge.
            let data: string = JSON.stringify({ item: this.dndObject, type: this.dragState.itemType });
            try {
                event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            } catch (e) {
                // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
                // does not allow changing the cursor in the dragover event, therefore we have to choose
                // the one we want to display now by setting effectAllowed.
                let effectsAllowed: string[] = this.dndState.filterEffects(ALL_EFFECTS, this.dragState.effectAllowed);
                event.dataTransfer.effectAllowed = effectsAllowed[0];
                event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
        }

        // add drag classes
        this.nativeElement.classList.add('dndDragging');
        setTimeout(
            () => {
                if (this.dragState.effectAllowed === 'move') {
                    this.nativeElement.style.display = 'none';
                }
            });

        // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
        if ((<any>event)._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(this.nativeElement, 0, 0);
        }

        this.dndDragStart.emit();
        event.stopPropagation();
    }

    @HostListener('dragend', ['$event'])
    public handleDragEnd(event: DragEvent): void {
        // Clean up
        this.dragState.isDragging = false;
        this.nativeElement.classList.remove('dndDragging');
        this.nativeElement.style.removeProperty('display');
        event.stopPropagation();
        // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
        setTimeout((() => this.nativeElement.classList.remove('dndDraggingSource')), 0);
    }

    @HostListener('click', ['$event'])
    public handleClick(event: Event): void {

        if (this.nativeElement.hasAttribute('dndSelected')) return;

        event = event['originalEvent'] || event;

        this.dndSelected.emit();

        event.stopPropagation();
    }

    private findElementWithAttribute(element: HTMLElement, attr: string): HTMLElement {
        if (element.hasAttribute(attr)) return element;
        if (element.parentElement === null) return;
        return this.findElementWithAttribute(element.parentElement, attr);
    }

}
