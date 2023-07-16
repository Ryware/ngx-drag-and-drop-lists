import { DndStateConfig } from './DndDraggableConfig';
import * as i0 from "@angular/core";
export declare class DndState {
    dragState: DndStateConfig;
    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     */
    filterEffects(effects: string[], effectAllowed: string): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<DndState, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DndState>;
}
