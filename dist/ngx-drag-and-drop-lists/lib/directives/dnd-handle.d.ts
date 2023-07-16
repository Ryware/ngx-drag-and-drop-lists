import { ElementRef } from '@angular/core';
import { DndState } from '../services';
import * as i0 from "@angular/core";
export declare class DndHandle {
    readonly element: ElementRef;
    readonly dndState: DndState;
    private readonly dragState;
    private nativeElement;
    private draggableString;
    constructor(element: ElementRef, dndState: DndState);
    handleDragStart(event: any): void;
    handleDragEnd(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndHandle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndHandle, "[dndHandle]", never, {}, {}, never, never, false, never>;
}
