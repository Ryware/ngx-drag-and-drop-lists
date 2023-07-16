import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Directive, Input, Output, HostListener, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

// In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
// However, IE and Edge only support a limited number of mime types. The workarounds are described
// in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
const MIME_TYPE = 'application/x-dnd';
const EDGE_MIME_TYPE = 'application/json';
const MSIE_MIME_TYPE = 'Text';
// All valid HTML5 drop effects, in the order in which we prefer to use them.
const ALL_EFFECTS = ['move', 'copy', 'link'];

class DndState {
    constructor() {
        this.dragState = {
            isDragging: false,
            itemType: undefined,
            dropEffect: 'none',
            effectAllowed: ALL_EFFECTS[0],
        };
    }
    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     */
    filterEffects(effects, effectAllowed) {
        if (effectAllowed === 'all')
            return effects;
        return effects.filter((effect) => {
            return effectAllowed.toLowerCase().indexOf(effect) !== -1;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndState, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndState }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndState, decorators: [{
            type: Injectable
        }] });

const dropAccepted = new Subject();
class DndList {
    set dndPlaceholder(placeholder) {
        this.placeholder = placeholder;
        placeholder.parentNode?.removeChild(placeholder);
    }
    constructor(element, dndState) {
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
    ngOnInit() {
        // placeholder
    }
    ngOnDestroy() {
        // placeholder
    }
    handleDragEnter(event) {
        event = event['originalEvent'] || event;
        const mimeType = this.getMimeType(event.dataTransfer.types);
        if (!mimeType || !this.isDropAllowed(this.getItemType(mimeType))) {
            return true;
        }
        event.preventDefault();
        return false;
    }
    handleDragOver(event) {
        event = event['originalEvent'] || event;
        const mimeType = this.getMimeType(event.dataTransfer.types);
        const itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType)) {
            return true;
        }
        // Make sure the placeholder is shown, which is especially important if the list is empty.
        if (this.placeholder.parentNode !== this.nativeElement) {
            this.nativeElement.appendChild(this.placeholder);
        }
        if (event.target !== this.nativeElement) {
            // Try to find the node direct directly below the list node.
            let listItemNode = event.target;
            while (listItemNode.parentNode !== this.nativeElement && listItemNode.parentNode) {
                listItemNode = listItemNode.parentNode;
            }
            if (listItemNode.parentNode === this.nativeElement && listItemNode !== this.placeholder) {
                let isFirstHalf;
                // If the mouse pointer is in the upper half of the list item element,
                // we position the placeholder before the list item, otherwise after it.
                const rect = listItemNode.getBoundingClientRect();
                if (this.option && this.option.horizontal) {
                    isFirstHalf = event.clientX < rect.left + rect.width / 2;
                }
                else {
                    isFirstHalf = event.clientY < rect.top + rect.height / 2;
                }
                this.nativeElement.insertBefore(this.placeholder, isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
        }
        // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
        // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
        // drops from external sources, as that throws an exception.
        let ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        let dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        // At this point we invoke the callback, which still can disallow the drop.
        // We can't do this earlier because we want to pass the index of the placeholder.
        // if (this.dndDragOver &&
        //     !this.invokeCallback(this.dndDragOver, event, dropEffect, itemType)) {
        //     return this.stopDragOver();
        // }
        event.preventDefault();
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        this.nativeElement.classList.add('dndDragover');
        event.stopPropagation();
        return false;
    }
    handleDrop(event) {
        event = event['originalEvent'] || event;
        // Check whether the drop is allowed and determine mime type.
        let mimeType = this.getMimeType(event.dataTransfer.types);
        let itemType = this.getItemType(mimeType);
        if (!mimeType || !this.isDropAllowed(itemType))
            return true;
        // The default behavior in Firefox is to interpret the dropped element as URL and
        // forward to it. We want to prevent that even if our drop is aborted.
        event.preventDefault();
        let data = undefined;
        // Unserialize the data that was serialized in dragstart.
        try {
            data = JSON.parse(event.dataTransfer.getData(mimeType));
        }
        catch (e) {
            return this.stopDragOver();
        }
        // Drops with invalid types from external sources might not have been filtered out yet.
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!this.isDropAllowed(itemType))
                return this.stopDragOver();
        }
        // Special handling for internal IE drops, see dragover handler.
        let ignoreDataTransfer = mimeType === MSIE_MIME_TYPE;
        let dropEffect = this.getDropEffect(event, ignoreDataTransfer);
        if (dropEffect === 'none')
            return this.stopDragOver();
        // Invoke the callback, which can transform the transferredObject and even abort the drop.
        let index = this.getPlaceholderIndex();
        // create an offset to account for extra elements (including the placeholder element)
        let offset = this.nativeElement.children.length - 1 - this.dndModel.length;
        if (this.dndDrop) {
            this.invokeCallback(this.dndDrop, event, dropEffect, itemType, index, data);
            if (!data)
                return this.stopDragOver();
        }
        // The drop is definitely going to happen now, store the dropEffect.
        this.dragState.dropEffect = dropEffect;
        if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
        }
        // Insert the object into the array, unless dnd-drop took care of that (returned true).
        if (data !== true) {
            // use the offset to create an insertionPoint
            let insertionPoint = index - offset;
            if (insertionPoint < 0) {
                insertionPoint = 0;
            }
            this.dndModel.splice(insertionPoint, 0, data);
        }
        this.invokeCallback(this.dndInserted, event, dropEffect, itemType, index, data);
        // Tell old object to handle itself
        dropAccepted.next({ item: data, list: this.dndModel });
        // Clean up
        this.stopDragOver();
        event.stopPropagation();
        return false;
    }
    handleDragLeave(event) {
        event = event['originalEvent'] || event;
        let newTarget = document.elementFromPoint(event.clientX, event.clientY);
        if (this.nativeElement.contains(newTarget) && !event['_dndPhShown']) {
            // Signalize to potential parent lists that a placeholder is already shown.
            event['_dndPhShown'] = true;
        }
        else {
            this.stopDragOver();
        }
    }
    getPlaceholderElement() {
        let placeholder = undefined;
        if (this.nativeElement.children) {
            for (let i = 1; i < this.nativeElement.children.length; i++) {
                const child = this.nativeElement.children.item(i);
                if (child?.classList.contains('dndPlaceholder')) {
                    placeholder = child;
                }
            }
        }
        let placeholderDefault = document.createElement('li');
        placeholderDefault.classList.add('dndPlaceholder');
        return placeholder || placeholderDefault;
    }
    /**
     * Given the types array from the DataTransfer object, returns the first valid mime type.
     * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
     */
    getMimeType(types) {
        if (!types)
            return MSIE_MIME_TYPE; // IE 9 workaround.
        for (let i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE || types[i] === EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) === MIME_TYPE) {
                return types[i];
            }
        }
        return null;
    }
    /**
     * Determines the type of the item from the dndState, or from the mime type for items from
     * external sources. Returns undefined if no item type was set and null if the item type could
     * not be determined.
     */
    getItemType(mimeType) {
        if (this.dragState.isDragging)
            return this.dragState.itemType || undefined;
        if (mimeType === MSIE_MIME_TYPE || mimeType === EDGE_MIME_TYPE)
            return null;
        return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
    }
    /**
     * Checks various conditions that must be fulfilled for a drop to be allowed, including the
     * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
     */
    isDropAllowed(itemType) {
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
        return !!itemType && this.option.allowedTypes?.indexOf(itemType) !== -1;
    }
    /**
     * Determines which drop effect to use for the given event. In Internet Explorer we have to
     * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
     * In those cases we rely on dndState to filter effects. Read the design doc for more details:
     * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
     */
    getDropEffect(event, ignoreDataTransfer) {
        let effects = Object.assign([], ALL_EFFECTS);
        if (!ignoreDataTransfer) {
            effects = this.dndState.filterEffects(effects, event.dataTransfer.effectAllowed);
        }
        if (this.dragState.isDragging) {
            effects = this.dndState.filterEffects(effects, this.dragState.effectAllowed);
        }
        if (this.option && this.option.effectAllowed) {
            effects = this.dndState.filterEffects(effects, this.option.effectAllowed);
        }
        // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
        // therefore the following modifier keys will only affect other operating systems.
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
    }
    /**
     * Small helper function that cleans up if we aborted a drop.
     */
    stopDragOver() {
        this.placeholder.parentNode?.removeChild(this.placeholder);
        this.nativeElement.classList.remove('dndDragover');
        return true;
    }
    /**
     * Invokes a callback with some interesting parameters and returns the callbacks return value.
     */
    invokeCallback(eventEmitter, event, dropEffect, itemType, index, item) {
        eventEmitter.emit({
            dropEffect: dropEffect,
            event: event,
            external: !this.dragState.isDragging,
            index: index !== undefined ? index : this.getPlaceholderIndex(),
            item: item || undefined,
            type: itemType,
        });
        return true;
    }
    /**
     * We use the position of the placeholder node to determine at which position of the array the
     * object needs to be inserted
     */
    getPlaceholderIndex() {
        // Remove the dragging element to get the correct index of the placeholder;
        for (let i = 0; i < this.nativeElement.children.length; i++) {
            if (this.nativeElement.children[i].classList.contains('dndDragging')) {
                const child = this.nativeElement.children[i];
                this.nativeElement.children[i].parentNode?.removeChild(child);
                child.remove();
                break;
            }
        }
        return Array.prototype.indexOf.call(this.nativeElement.children, this.placeholder);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndList, deps: [{ token: i0.ElementRef }, { token: DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndList, selector: "[dndList]", inputs: { option: ["dndList", "option"], dndModel: "dndModel", dndPlaceholder: "dndPlaceholder" }, outputs: { dndDragOver: "dndDragOver", dndDrop: "dndDrop", dndInserted: "dndInserted" }, host: { listeners: { "dragenter": "handleDragEnter($event)", "dragover": "handleDragOver($event)", "drop": "handleDrop($event)", "dragleave": "handleDragLeave($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndList, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndList]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: DndState }]; }, propDecorators: { option: [{
                type: Input,
                args: ['dndList']
            }], dndModel: [{
                type: Input,
                args: ['dndModel']
            }], dndPlaceholder: [{
                type: Input
            }], dndDragOver: [{
                type: Output,
                args: ['dndDragOver']
            }], dndDrop: [{
                type: Output,
                args: ['dndDrop']
            }], dndInserted: [{
                type: Output,
                args: ['dndInserted']
            }], handleDragEnter: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], handleDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], handleDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }], handleDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }] } });

class DndDraggable {
    set disableDrag(disable) {
        if (disable !== undefined) {
            this.element.nativeElement.setAttribute(this.draggableString, (!disable).toString());
        }
    }
    constructor(element, dndState) {
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
        this.element.nativeElement.setAttribute(this.draggableString, 'true');
        /**
         * Workaround to make element draggable in IE9
         */
        this.element.nativeElement.onselectstart = function () {
            if (this.dragDrop)
                this.dragDrop();
        };
    }
    ngOnInit() {
        this.dropSubscription = dropAccepted.subscribe(({ item, list }) => {
            // event = event['originalEvent'] || event;
            if (JSON.stringify(this.dndObject) === JSON.stringify(item)) {
                let cb = { copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled' };
                if (this.dragState) {
                    const copyObject = cb[this.dragState.effectAllowed];
                    this[copyObject].emit();
                }
                this.dndDragEnd.emit();
            }
        });
    }
    ngOnDestroy() {
        this.dropSubscription?.unsubscribe();
    }
    handleDragStart(event) {
        // disabled check
        if (this.element.nativeElement.getAttribute(this.draggableString) === 'false')
            return;
        // init drag
        this.dragState.isDragging = true;
        this.dragState.itemType = this.dndType;
        this.dragState.dropEffect = 'none';
        if (!this.option) {
            this.option = { draggable: true };
        }
        this.dragState.effectAllowed = this.option.effectAllowed || ALL_EFFECTS[0];
        event.dataTransfer.effectAllowed = this.dragState.effectAllowed;
        // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
        // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
        let mimeType = MIME_TYPE + (this.dragState.itemType ? ('-' + this.dragState.itemType) : '');
        try {
            event.dataTransfer.setData(mimeType, JSON.stringify(this.dndObject));
        }
        catch (e) {
            // Setting a custom MIME type did not work, we are probably in IE or Edge.
            let data = JSON.stringify({ item: this.dndObject, type: this.dragState.itemType });
            try {
                event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            }
            catch (e) {
                // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
                // does not allow changing the cursor in the dragover event, therefore we have to choose
                // the one we want to display now by setting effectAllowed.
                let effectsAllowed = this.dndState.filterEffects(ALL_EFFECTS, this.dragState.effectAllowed);
                event.dataTransfer.effectAllowed = effectsAllowed[0];
                event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
        }
        // add drag classes
        this.element.nativeElement.classList.add('dndDragging');
        setTimeout(() => {
            if (this.dragState.effectAllowed === 'move') {
                this.element.nativeElement.style.display = 'none';
            }
        });
        // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
        if (event._dndHandle && event.dataTransfer?.setDragImage) {
            event.dataTransfer.setDragImage(this.element.nativeElement, 0, 0);
        }
        this.dndDragStart.emit();
        event.stopPropagation();
    }
    handleDragEnd(event) {
        // Clean up
        this.dragState.isDragging = false;
        this.element.nativeElement.classList.remove('dndDragging');
        this.element.nativeElement.style.removeProperty('display');
        event.stopPropagation();
        // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
        setTimeout((() => this.element.nativeElement.classList.remove('dndDraggingSource')), 0);
    }
    handleClick(event) {
        if (this.element.nativeElement.hasAttribute('dndSelected'))
            return;
        event = event['originalEvent'] || event;
        this.dndSelected.emit();
        event.stopPropagation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndDraggable, deps: [{ token: i0.ElementRef }, { token: DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndDraggable, selector: "[dndDraggable]", inputs: { option: ["dndDraggable", "option"], dndType: "dndType", dndObject: "dndObject", disableDrag: ["dndDragDisabled", "disableDrag"] }, outputs: { dndDragStart: "dndDragStart", dndDragEnd: "dndDragEnd", dndCopied: "dndCopied", dndLinked: "dndLinked", dndMoved: "dndMoved", dndCanceled: "dndCanceled", dndSelected: "dndSelected" }, host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)", "click": "handleClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndDraggable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndDraggable]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: DndState }]; }, propDecorators: { option: [{
                type: Input,
                args: ['dndDraggable']
            }], dndType: [{
                type: Input,
                args: ['dndType']
            }], dndObject: [{
                type: Input,
                args: ['dndObject']
            }], disableDrag: [{
                type: Input,
                args: ['dndDragDisabled']
            }], dndDragStart: [{
                type: Output,
                args: ['dndDragStart']
            }], dndDragEnd: [{
                type: Output,
                args: ['dndDragEnd']
            }], dndCopied: [{
                type: Output,
                args: ['dndCopied']
            }], dndLinked: [{
                type: Output,
                args: ['dndLinked']
            }], dndMoved: [{
                type: Output,
                args: ['dndMoved']
            }], dndCanceled: [{
                type: Output,
                args: ['dndCanceled']
            }], dndSelected: [{
                type: Output,
                args: ['dndSelected']
            }], handleDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], handleDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/**
 * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
 * drag operations. This is especially useful if you want to use input elements inside of
 * dnd-draggable elements or create specific handle elements. Note: This directive does not work
 * in Internet Explorer 9.
 */
class DndNoDrag {
    constructor(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
    }
    handleDragStart(event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            // If a child element already reacted to dragstart and set a dataTransfer object, we will
            // allow that. For example, this is the case for user selections inside of input elements.
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
                event.preventDefault();
            }
            event.stopPropagation();
        }
    }
    handleDragEnd(event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndNoDrag, deps: [{ token: i0.ElementRef }, { token: DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndNoDrag, selector: "[dndNoDrag]", host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndNoDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndNoDrag]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: DndState }]; }, propDecorators: { handleDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], handleDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });

/**
 * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
 * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
 * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
 * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
 * can work around this by styling the handle element differently when it is being dragged. Use
 * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
 */
class DndHandle {
    constructor(element, dndState) {
        this.element = element;
        this.dndState = dndState;
        this.draggableString = 'draggable';
        this.dragState = dndState.dragState;
        this.nativeElement = element.nativeElement;
        this.nativeElement.setAttribute(this.draggableString, 'true');
    }
    handleDragStart(event) {
        event = event['originalEvent'] || event;
        event['_dndHandle'] = true;
    }
    handleDragEnd(event) {
        event = event['originalEvent'] || event;
        if (!event['_dndHandle']) {
            event.stopPropagation();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndHandle, deps: [{ token: i0.ElementRef }, { token: DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndHandle, selector: "[dndHandle]", host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndHandle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndHandle]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: DndState }]; }, propDecorators: { handleDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], handleDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });

class DndListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.5", ngImport: i0, type: DndListModule, declarations: [DndDraggable, DndHandle, DndList, DndNoDrag], imports: [CommonModule], exports: [DndDraggable, DndHandle, DndList, DndNoDrag] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndListModule, providers: [
            DndState,
        ], imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                    ],
                    exports: [
                        DndDraggable, DndHandle, DndList, DndNoDrag,
                    ],
                    declarations: [DndDraggable, DndHandle, DndList, DndNoDrag],
                    providers: [
                        DndState,
                    ],
                }]
        }] });

/*
 * Public API Surface of ngx-drag-and-drop-lists
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ALL_EFFECTS, DndDraggable, DndHandle, DndList, DndListModule, DndNoDrag, DndState, EDGE_MIME_TYPE, MIME_TYPE, MSIE_MIME_TYPE, dropAccepted };
//# sourceMappingURL=ngx-drag-and-drop-lists.mjs.map
