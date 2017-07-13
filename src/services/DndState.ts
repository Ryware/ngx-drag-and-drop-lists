import { Injectable } from '@angular/core';
import { ALL_EFFECTS, DndStateConfig } from '../index';
@Injectable()
export class DndState {
    public dragState: DndStateConfig = {
        isDragging: false,
        itemType: undefined,
        dropEffect: 'none',
        effectAllowed: ALL_EFFECTS[0],
    };

    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     */
    public filterEffects(effects: string[], effectAllowed: string) {
        if (effectAllowed === 'all') return effects;
        return effects.filter((effect) => {
            return effectAllowed.toLowerCase().indexOf(effect) !== -1;
        });
    }
}
