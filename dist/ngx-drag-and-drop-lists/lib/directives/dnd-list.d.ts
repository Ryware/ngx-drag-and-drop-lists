import { OnDestroy, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { DndState, DndListSettings } from '../services';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare const dropAccepted: Subject<any>;
export declare class DndList implements OnInit, OnDestroy {
    readonly element: ElementRef;
    private readonly dndState;
    option: DndListSettings | undefined;
    dndModel: any[];
    set dndPlaceholder(placeholder: Element);
    dndDragOver: EventEmitter<any>;
    dndDrop: EventEmitter<any>;
    dndInserted: EventEmitter<any>;
    private dragState;
    private nativeElement;
    private listSettings;
    private placeholder;
    constructor(element: ElementRef, dndState: DndState);
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleDragEnter(event: any): boolean;
    handleDragOver(event: any): boolean;
    handleDrop(event: any): boolean;
    handleDragLeave(event: any): void;
    private getPlaceholderElement;
    /**
     * Given the types array from the DataTransfer object, returns the first valid mime type.
     * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
     */
    private getMimeType;
    /**
     * Determines the type of the item from the dndState, or from the mime type for items from
     * external sources. Returns undefined if no item type was set and null if the item type could
     * not be determined.
     */
    private getItemType;
    /**
     * Checks various conditions that must be fulfilled for a drop to be allowed, including the
     * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
     */
    private isDropAllowed;
    /**
     * Determines which drop effect to use for the given event. In Internet Explorer we have to
     * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
     * In those cases we rely on dndState to filter effects. Read the design doc for more details:
     * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
     */
    private getDropEffect;
    /**
     * Small helper function that cleans up if we aborted a drop.
     */
    private stopDragOver;
    /**
     * Invokes a callback with some interesting parameters and returns the callbacks return value.
     */
    private invokeCallback;
    /**
     * We use the position of the placeholder node to determine at which position of the array the
     * object needs to be inserted
     */
    private getPlaceholderIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndList, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndList, "[dndList]", never, { "option": { "alias": "dndList"; "required": false; }; "dndModel": { "alias": "dndModel"; "required": false; }; "dndPlaceholder": { "alias": "dndPlaceholder"; "required": false; }; }, { "dndDragOver": "dndDragOver"; "dndDrop": "dndDrop"; "dndInserted": "dndInserted"; }, never, never, false, never>;
}
