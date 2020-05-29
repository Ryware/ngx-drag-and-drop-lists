var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Input, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { DndState } from '../services';
import { ALL_EFFECTS, MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, } from '../index';
import { dropAccepted } from './dnd-list';
var DndDraggable = (function () {
    function DndDraggable(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.option = { draggable: true };
        this.dndDragStart = new EventEmitter();
        this.dndDragEnd = new EventEmitter();
        this.dndCopied = new EventEmitter();
        this.dndLinked = new EventEmitter();
        this.dndMoved = new EventEmitter();
        this.dndCanceled = new EventEmitter();
        this.dndSelected = new EventEmitter();
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.nativeElement.setAttribute(this.draggableString, 'true');
        this.nativeElement.nativeElement.onselectstart = function () {
            if (this.dragDrop)
                this.dragDrop();
        };
    }
    Object.defineProperty(DndDraggable.prototype, "disableDrag", {
        set: function (disable) {
            if (disable !== undefined) {
                this.nativeElement.nativeElement.setAttribute(this.draggableString, (!disable).toString());
            }
        },
        enumerable: true,
        configurable: true
    });
    DndDraggable.prototype.ngOnInit = function () {
        var _this = this;
        this.dropSubscription = dropAccepted.subscribe(function (_a) {
            var item = _a.item, list = _a.list;
            if (JSON.stringify(_this.dndObject) === JSON.stringify(item)) {
                var cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
                if (_this.dragState) {
                    _this[cb[_this.dragState.effectAllowed]].emit();
                }
                _this.dndDragEnd.emit();
            }
        });
    };
    DndDraggable.prototype.ngOnDestroy = function () {
        this.dropSubscription.unsubscribe();
    };
    DndDraggable.prototype.handleDragStart = function (event) {
        var _this = this;
        if (this.nativeElement.nativeElement.getAttribute(this.draggableString) === 'false')
            return;
        this.dragState.isDragging = true;
        this.dragState.itemType = this.dndType;
        this.dragState.dropEffect = 'none';
        if (!this.option) {
            this.option = { draggable: true };
        }
        this.dragState.effectAllowed = this.option.effectAllowed || ALL_EFFECTS[0];
        event.dataTransfer.effectAllowed = this.dragState.effectAllowed;
        var mimeType = MIME_TYPE + (this.dragState.itemType ? ('-' + this.dragState.itemType) : '');
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndObject));
        }
        catch (e) {
            var data = JSON.stringify({ item: this.dndObject, type: this.dragState.itemType });
            try {
                event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            }
            catch (e) {
                var effectsAllowed = this.dndState.filterEffects(ALL_EFFECTS, this.dragState.effectAllowed);
                event.dataTransfer.effectAllowed = effectsAllowed[0];
                event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
        }
        this.nativeElement.nativeElement.classList.add('dndDragging');
        setTimeout(function () {
            if (_this.dragState.effectAllowed === 'move') {
                _this.nativeElement.nativeElement.style.display = 'none';
            }
        });
        if (event._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(this.nativeElement.nativeElement, 0, 0);
        }
        this.dndDragStart.emit();
        event.stopPropagation();
    };
    DndDraggable.prototype.handleDragEnd = function (event) {
        var _this = this;
        this.dragState.isDragging = false;
        this.nativeElement.nativeElement.classList.remove('dndDragging');
        this.nativeElement.nativeElement.style.removeProperty('display');
        event.stopPropagation();
        setTimeout((function () { return _this.nativeElement.nativeElement.classList.remove('dndDraggingSource'); }), 0);
    };
    DndDraggable.prototype.handleClick = function (event) {
        if (this.nativeElement.nativeElement.hasAttribute('dndSelected'))
            return;
        event = event['originalEvent'] || event;
        this.dndSelected.emit();
        event.stopPropagation();
    };
    DndDraggable.prototype.findElementWithAttribute = function (element, attr) {
        if (element.hasAttribute(attr))
            return element;
        if (element.parentElement === null)
            return;
        return this.findElementWithAttribute(element.parentElement, attr);
    };
    __decorate([
        Input('dndDraggable'),
        __metadata("design:type", Object)
    ], DndDraggable.prototype, "option", void 0);
    __decorate([
        Input('dndType'),
        __metadata("design:type", String)
    ], DndDraggable.prototype, "dndType", void 0);
    __decorate([
        Input('dndObject'),
        __metadata("design:type", HTMLElement)
    ], DndDraggable.prototype, "dndObject", void 0);
    __decorate([
        Input('dndDragDisabled'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DndDraggable.prototype, "disableDrag", null);
    __decorate([
        Output('dndDragStart'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndDragStart", void 0);
    __decorate([
        Output('dndDragEnd'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndDragEnd", void 0);
    __decorate([
        Output('dndCopied'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndCopied", void 0);
    __decorate([
        Output('dndLinked'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndLinked", void 0);
    __decorate([
        Output('dndMoved'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndMoved", void 0);
    __decorate([
        Output('dndCanceled'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndCanceled", void 0);
    __decorate([
        Output('dndSelected'),
        __metadata("design:type", EventEmitter)
    ], DndDraggable.prototype, "dndSelected", void 0);
    __decorate([
        HostListener('dragstart', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], DndDraggable.prototype, "handleDragStart", null);
    __decorate([
        HostListener('dragend', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], DndDraggable.prototype, "handleDragEnd", null);
    __decorate([
        HostListener('click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], DndDraggable.prototype, "handleClick", null);
    DndDraggable = __decorate([
        Directive({
            selector: '[dndDraggable]',
        }),
        __metadata("design:paramtypes", [ElementRef,
            DndState])
    ], DndDraggable);
    return DndDraggable;
}());
export { DndDraggable };
//# sourceMappingURL=dnd-draggable.js.map