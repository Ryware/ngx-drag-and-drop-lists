var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, HostListener } from '@angular/core';
import { DndState, } from '../services';
var DndNoDrag = (function () {
    function DndNoDrag(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
    }
    DndNoDrag.prototype.handleDragStart = function (event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
    };
    DndNoDrag.prototype.handleDragEnd = function (event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    };
    __decorate([
        HostListener('dragstart', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], DndNoDrag.prototype, "handleDragStart", null);
    __decorate([
        HostListener('dragend', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], DndNoDrag.prototype, "handleDragEnd", null);
    DndNoDrag = __decorate([
        Directive({
            selector: '[dndNoDrag]',
        }),
        __metadata("design:paramtypes", [ElementRef,
            DndState])
    ], DndNoDrag);
    return DndNoDrag;
}());
export { DndNoDrag };
//# sourceMappingURL=dnd-nodrag.js.map