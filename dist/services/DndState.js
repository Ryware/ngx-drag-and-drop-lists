var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { ALL_EFFECTS } from '../index';
var DndState = (function () {
    function DndState() {
        this.dragState = {
            isDragging: false,
            itemType: undefined,
            dropEffect: 'none',
            effectAllowed: ALL_EFFECTS[0],
        };
    }
    DndState.prototype.filterEffects = function (effects, effectAllowed) {
        if (effectAllowed === 'all')
            return effects;
        return effects.filter(function (effect) {
            return effectAllowed.toLowerCase().indexOf(effect) !== -1;
        });
    };
    DndState = __decorate([
        Injectable()
    ], DndState);
    return DndState;
}());
export { DndState };
//# sourceMappingURL=DndState.js.map