import { OnDestroy, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { DndDraggableConfig, DndState } from '../services';
import * as i0 from "@angular/core";
export declare class DndDraggable implements OnInit, OnDestroy {
    private readonly element;
    private readonly dndState;
    option: DndDraggableConfig | undefined;
    dndType: string;
    dndObject: any;
    set disableDrag(disable: string | boolean);
    dndDragStart: EventEmitter<any>;
    dndDragEnd: EventEmitter<any>;
    dndCopied: EventEmitter<any>;
    dndLinked: EventEmitter<any>;
    dndMoved: EventEmitter<any>;
    dndCanceled: EventEmitter<any>;
    dndSelected: EventEmitter<any>;
    private readonly dragState;
    private dropSubscription?;
    private draggableString;
    constructor(element: ElementRef, dndState: DndState);
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleDragStart(event: DragEvent): void;
    handleDragEnd(event: DragEvent): void;
    handleClick(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndDraggable, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndDraggable, "[dndDraggable]", never, { "option": { "alias": "dndDraggable"; "required": false; }; "dndType": { "alias": "dndType"; "required": false; }; "dndObject": { "alias": "dndObject"; "required": false; }; "disableDrag": { "alias": "dndDragDisabled"; "required": false; }; }, { "dndDragStart": "dndDragStart"; "dndDragEnd": "dndDragEnd"; "dndCopied": "dndCopied"; "dndLinked": "dndLinked"; "dndMoved": "dndMoved"; "dndCanceled": "dndCanceled"; "dndSelected": "dndSelected"; }, never, never, false, never>;
}
