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
import { DndState, ALL_EFFECTS, MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, } from '../services';
import { Subject } from 'rxjs';
export var dropAccepted = new Subject();
var DndList = (function () {
    function DndList(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.option = {
            disabled: false,
            effectAllowed: 'move',
            allowedTypes: undefined,
        };
        this.dndDragOver = new EventEmitter();
        this.dndDrop = new EventEmitter();
        this.dndInserted = new EventEmitter();
        this.listSettings = {};
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.placeholder = this.getPlaceholderElement();
    }
    Object.defineProperty(DndList.prototype, "dndPlaceholder", {
        set: function (placeholder) {
            this.placeholder = placeholder;
            placeholder.remove();
        },
        enumerable: true,
        configurable: true
    });
    DndList.prototype.ngOnInit = function () {
    };
    DndList.prototype.ngOnDestroy = function () {
    };
    DndList.prototype.handleDragEnter = function (event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        if (!mimeType || !this.isDropAllowed(this.getItemType(mimeType))) {
            return true;
        }
        event.preventDefault();
        return false;
    };
    DndList.prototype.handleDragOver = function (event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        var itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType)) {
            return true;
        }
        if (this.placeholder.parentNode !== this.nativeElement) {
            this.nativeElement.appendChild(this.placeholder);
        }
        if (event.target !== this.nativeElement) {
            var listItemNode = event.target;
            while (listItemNode.parentNode !== this.nativeElement && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
            if (listItemNode.parentNode === this.nativeElement && listItemNode !== this.placeholder) {
                var isFirstHalf = void 0;
                var rect = listItemNode.getBoundingClientRect();
                if (this.option && this.option.horizontal) {
                    isFirstHalf = event.clientX < rect.left + rect.width / 2;
                }
                else {
                    isFirstHalf = event.clientY < rect.top + rect.height / 2;
                }
                this.nativeElement.insertBefore(this.placeholder, isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        event.preventDefault();
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        this.nativeElement.classList.add('dndDragover');
        event.stopPropagation();
        return false;
    };
    DndList.prototype.handleDrop = function (event) {
        event = event['originalEvent'] || event;
        var mimeType = this.getMimeType(event.dataTransfer.types);
        var itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType))
            return true;
        event.preventDefault();
        var data = undefined;
        try {
            data = JSON.parse(event.dataTransfer.getData(mimeType));
        }
        catch (e) {
            return this.stopDragOver();
        }
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!this.isDropAllowed(itemType))
                return this.stopDragOver();
        }
        var ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        var dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        var index = this.getPlaceholderIndex();
        var offset = this.nativeElement.children.length - 1 - this.dndModel.length;
        if (this.dndDrop) {
            this.invokeCallback(this.dndDrop, event, dropEffect, itemType, index, data);
            if (!data)
                return this.stopDragOver();
        }
        this.dragState.dropEffect = dropEffect;
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        if (data !== true) {
            var insertionPoint = index - offset;
            if (insertionPoint < 0) {
                insertionPoint = 0;
            }
            this.dndModel.splice(insertionPoint, 0, data);
        }
        this.invokeCallback(this.dndInserted, event, dropEffect, itemType, index, data);
        dropAccepted.next({ item: data, list: this.dndModel });
        this.stopDragOver();
        event.stopPropagation();
        return false;
    };
    DndList.prototype.handleDragLeave = function (event) {
        event = event['originalEvent'] || event;
        var newTarget = document.elementFromPoint(event.clientX, event.clientY);
        if (this.nativeElement.contains(newTarget) && !event['_dndPhShown']) {
            event['_dndPhShown'] = true;
        }
        else {
            this.stopDragOver();
        }
    };
    DndList.prototype.getPlaceholderElement = function () {
        var placeholder = undefined;
        if (this.nativeElement.children) {
            for (var i = 1; i < this.nativeElement.children.length; i++) {
                var child = this.nativeElement.children.item(i);
                if (child.classList.contains('dndPlaceholder')) {
                    placeholder = child;
                }
            }
        }
        var placeholderDefault = document.createElement('li');
        placeholderDefault.classList.add('dndPlaceholder');
        return placeholder || placeholderDefault;
    };
    DndList.prototype.getMimeType = function (types) {
        if (!types)
            return MSIE_MIME_TYPE;
        for (var i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE || types[i] === EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) === MIME_TYPE) {
                return types[i];
            }
        }
        return null;
    };
    DndList.prototype.getItemType = function (mimeType) {
        if (this.dragState.isDragging)
            return this.dragState.itemType || undefined;
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE)
            return null;
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
    };
    DndList.prototype.isDropAllowed = function (itemType) {
        if (this.option) {
            if (this.option.disabled)
                return false;
            if (this.option.max && this.dndModel.length === this.option.max)
                return false;
            if (!this.option.externalSources && !this.dragState.isDragging)
                return false;
            if (!this.option.allowedTypes || itemType === null)
                return true;
        }
        return itemType && this.option.allowedTypes.indexOf(itemType) !== -1;
    };
    DndList.prototype.getDropEffect = function (event, ignoreDataTransfer) {
        var effects = Object.assign([], ALL_EFFECTS);
        if (!ignoreDataTransfer) {
            effects = this.dndState.filterEffects(effects, event.dataTransfer.effectAllowed);
        }
        if (this.dragState.isDragging) {
            effects = this.dndState.filterEffects(effects, this.dragState.effectAllowed);
        }
        if (this.option && this.option.effectAllowed) {
            effects = this.dndState.filterEffects(effects, this.option.effectAllowed);
        }
        if (!effects.length) {
            return 'none';
        }
        else if (event.ctrlKey && effects.indexOf('copy') !== -1) {
            return 'copy';
        }
        else if (event.altKey && effects.indexOf('link') !== -1) {
            return 'link';
        }
        else {
            return effects[0];
        }
    };
    DndList.prototype.stopDragOver = function () {
        this.placeholder.remove();
        this.nativeElement.classList.remove('dndDragover');
        return true;
    };
    DndList.prototype.invokeCallback = function (eventEmitter, event, dropEffect, itemType, index, item) {
        eventEmitter.emit({
            dropEffect: dropEffect,
            event: event,
            external: !this.dragState.isDragging,
            index: index !== undefined ? index : this.getPlaceholderIndex(),
            item: item || undefined,
            type: itemType,
        });
        return true;
    };
    DndList.prototype.getPlaceholderIndex = function () {
        for (var i = 0; i < this.nativeElement.children.length; i++) {
            if (this.nativeElement.children[i].classList.contains('dndDragging')) {
                this.nativeElement.children[i].remove();
                break;
            }
        }
        return Array.prototype.indexOf.call(this.nativeElement.children, this.placeholder);
    };
    __decorate([
        Input('dndList'),
        __metadata("design:type", Object)
    ], DndList.prototype, "option", void 0);
    __decorate([
        Input('dndModel'),
        __metadata("design:type", Array)
    ], DndList.prototype, "dndModel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Element),
        __metadata("design:paramtypes", [Element])
    ], DndList.prototype, "dndPlaceholder", null);
    __decorate([
        Output('dndDragOver'),
        __metadata("design:type", EventEmitter)
    ], DndList.prototype, "dndDragOver", void 0);
    __decorate([
        Output('dndDrop'),
        __metadata("design:type", EventEmitter)
    ], DndList.prototype, "dndDrop", void 0);
    __decorate([
        Output('dndInserted'),
        __metadata("design:type", EventEmitter)
    ], DndList.prototype, "dndInserted", void 0);
    __decorate([
        HostListener('dragenter', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", Boolean)
    ], DndList.prototype, "handleDragEnter", null);
    __decorate([
        HostListener('dragover', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", Boolean)
    ], DndList.prototype, "handleDragOver", null);
    __decorate([
        HostListener('drop', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", Boolean)
    ], DndList.prototype, "handleDrop", null);
    __decorate([
        HostListener('dragleave', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], DndList.prototype, "handleDragLeave", null);
    DndList = __decorate([
        Directive({
            selector: '[dndList]',
        }),
        __metadata("design:paramtypes", [ElementRef,
            DndState])
    ], DndList);
    return DndList;
}());
export { DndList };
//# sourceMappingURL=dnd-list.js.map