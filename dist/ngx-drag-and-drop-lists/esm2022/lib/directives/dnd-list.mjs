import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { ALL_EFFECTS, MIME_TYPE, EDGE_MIME_TYPE, MSIE_MIME_TYPE, } from '../services';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../services";
export const dropAccepted = new Subject();
export class DndList {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndList, deps: [{ token: i0.ElementRef }, { token: i1.DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndList, selector: "[dndList]", inputs: { option: ["dndList", "option"], dndModel: "dndModel", dndPlaceholder: "dndPlaceholder" }, outputs: { dndDragOver: "dndDragOver", dndDrop: "dndDrop", dndInserted: "dndInserted" }, host: { listeners: { "dragenter": "handleDragEnter($event)", "dragover": "handleDragOver($event)", "drop": "handleDrop($event)", "dragleave": "handleDragLeave($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndList, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndList]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DndState }]; }, propDecorators: { option: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZHJhZy1hbmQtZHJvcC1saXN0cy9zcmMvbGliL2RpcmVjdGl2ZXMvZG5kLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBYyxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BILE9BQU8sRUFJSCxXQUFXLEVBQ1gsU0FBUyxFQUNULGNBQWMsRUFDZCxjQUFjLEdBQ2pCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQUUvQixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7QUFLeEQsTUFBTSxPQUFPLE9BQU87SUFPaEIsSUFBb0IsY0FBYyxDQUFDLFdBQW9CO1FBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLFdBQVcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFTRCxZQUNhLE9BQW1CLEVBQ1gsUUFBa0I7UUFEMUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNYLGFBQVEsR0FBUixRQUFRLENBQVU7UUFwQmQsV0FBTSxHQUFnQztZQUMzRCxRQUFRLEVBQUUsS0FBSztZQUNmLGFBQWEsRUFBRSxNQUFNO1lBQ3JCLFlBQVksRUFBRSxTQUFTO1NBQzFCLENBQUM7UUFNNEIsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUMsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUcxRSxpQkFBWSxHQUFPLEVBQUUsQ0FBQztRQU8xQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEs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bEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZixNQUFNO2FBQ1Q7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2RixDQUFDOzhHQTNUUSxPQUFPO2tHQUFQLE9BQU87OzJGQUFQLE9BQU87a0JBSG5CLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFdBQVc7aUJBQ3hCO3dIQUU0QixNQUFNO3NCQUE5QixLQUFLO3VCQUFDLFNBQVM7Z0JBS1UsUUFBUTtzQkFBakMsS0FBSzt1QkFBQyxVQUFVO2dCQUNHLGNBQWM7c0JBQWpDLEtBQUs7Z0JBSXdCLFdBQVc7c0JBQXhDLE1BQU07dUJBQUMsYUFBYTtnQkFDSyxPQUFPO3NCQUFoQyxNQUFNO3VCQUFDLFNBQVM7Z0JBQ2EsV0FBVztzQkFBeEMsTUFBTTt1QkFBQyxhQUFhO2dCQXdCZCxlQUFlO3NCQURyQixZQUFZO3VCQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFhOUIsY0FBYztzQkFEcEIsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBNkQ3QixVQUFVO3NCQURoQixZQUFZO3VCQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFxRXpCLGVBQWU7c0JBRHJCLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIERuZFN0YXRlLFxyXG4gICAgRG5kTGlzdFNldHRpbmdzLFxyXG4gICAgRG5kU3RhdGVDb25maWcsXHJcbiAgICBBTExfRUZGRUNUUyxcclxuICAgIE1JTUVfVFlQRSxcclxuICAgIEVER0VfTUlNRV9UWVBFLFxyXG4gICAgTVNJRV9NSU1FX1RZUEUsXHJcbn0gZnJvbSAnLi4vc2VydmljZXMnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZHJvcEFjY2VwdGVkOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tkbmRMaXN0XScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEbmRMaXN0IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gICAgQElucHV0KCdkbmRMaXN0JykgcHVibGljIG9wdGlvbjogRG5kTGlzdFNldHRpbmdzIHwgdW5kZWZpbmVkID0ge1xyXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcclxuICAgICAgICBlZmZlY3RBbGxvd2VkOiAnbW92ZScsXHJcbiAgICAgICAgYWxsb3dlZFR5cGVzOiB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG4gICAgQElucHV0KCdkbmRNb2RlbCcpIHB1YmxpYyBkbmRNb2RlbCE6IGFueVtdO1xyXG4gICAgQElucHV0KCkgcHVibGljIHNldCBkbmRQbGFjZWhvbGRlcihwbGFjZWhvbGRlcjogRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcclxuICAgICAgICBwbGFjZWhvbGRlci5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcik7XHJcbiAgICB9XHJcbiAgICBAT3V0cHV0KCdkbmREcmFnT3ZlcicpIHB1YmxpYyBkbmREcmFnT3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCdkbmREcm9wJykgcHVibGljIGRuZERyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnZG5kSW5zZXJ0ZWQnKSBwdWJsaWMgZG5kSW5zZXJ0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgcHJpdmF0ZSBkcmFnU3RhdGU6IERuZFN0YXRlQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgbGlzdFNldHRpbmdzOiB7fSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwbGFjZWhvbGRlcjogRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICByZWFkb25seSBlbGVtZW50OiBFbGVtZW50UmVmLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZG5kU3RhdGU6IERuZFN0YXRlLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUgPSBkbmRTdGF0ZS5kcmFnU3RhdGU7XHJcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLmdldFBsYWNlaG9sZGVyRWxlbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICAvLyBwbGFjZWhvbGRlclxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAvLyBwbGFjZWhvbGRlclxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgaGFuZGxlRHJhZ0VudGVyKGV2ZW50OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBldmVudCA9IGV2ZW50WydvcmlnaW5hbEV2ZW50J10gfHwgZXZlbnQ7XHJcbiAgICAgICAgY29uc3QgbWltZVR5cGU6IHN0cmluZyB8IG51bGwgPSB0aGlzLmdldE1pbWVUeXBlKGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlcyk7XHJcbiAgICAgICAgaWYgKCFtaW1lVHlwZSB8fCAhdGhpcy5pc0Ryb3BBbGxvd2VkKHRoaXMuZ2V0SXRlbVR5cGUobWltZVR5cGUpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBoYW5kbGVEcmFnT3ZlcihldmVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgZXZlbnQgPSBldmVudFsnb3JpZ2luYWxFdmVudCddIHx8IGV2ZW50O1xyXG4gICAgICAgIGNvbnN0IG1pbWVUeXBlOiBzdHJpbmcgfCBudWxsID0gdGhpcy5nZXRNaW1lVHlwZShldmVudC5kYXRhVHJhbnNmZXIudHlwZXMpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1UeXBlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkID0gdGhpcy5nZXRJdGVtVHlwZShtaW1lVHlwZSk7XHJcbiAgICAgICAgaWYgKCFtaW1lVHlwZSB8fCAhdGhpcy5pc0Ryb3BBbGxvd2VkKGl0ZW1UeXBlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBwbGFjZWhvbGRlciBpcyBzaG93biwgd2hpY2ggaXMgZXNwZWNpYWxseSBpbXBvcnRhbnQgaWYgdGhlIGxpc3QgaXMgZW1wdHkuXHJcbiAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIucGFyZW50Tm9kZSAhPT0gdGhpcy5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnBsYWNlaG9sZGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IHRoaXMubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgbm9kZSBkaXJlY3QgZGlyZWN0bHkgYmVsb3cgdGhlIGxpc3Qgbm9kZS5cclxuICAgICAgICAgICAgbGV0IGxpc3RJdGVtTm9kZTogTm9kZSA9IGV2ZW50LnRhcmdldCBhcyBOb2RlO1xyXG4gICAgICAgICAgICB3aGlsZSAobGlzdEl0ZW1Ob2RlLnBhcmVudE5vZGUgIT09IHRoaXMubmF0aXZlRWxlbWVudCAmJiBsaXN0SXRlbU5vZGUucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdEl0ZW1Ob2RlID0gbGlzdEl0ZW1Ob2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsaXN0SXRlbU5vZGUucGFyZW50Tm9kZSA9PT0gdGhpcy5uYXRpdmVFbGVtZW50ICYmIGxpc3RJdGVtTm9kZSAhPT0gdGhpcy5wbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzRmlyc3RIYWxmOiBib29sZWFuO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaW4gdGhlIHVwcGVyIGhhbGYgb2YgdGhlIGxpc3QgaXRlbSBlbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgLy8gd2UgcG9zaXRpb24gdGhlIHBsYWNlaG9sZGVyIGJlZm9yZSB0aGUgbGlzdCBpdGVtLCBvdGhlcndpc2UgYWZ0ZXIgaXQuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0OiBDbGllbnRSZWN0ID0gKGxpc3RJdGVtTm9kZSBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbiAmJiB0aGlzLm9wdGlvbi5ob3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdEhhbGYgPSBldmVudC5jbGllbnRYIDwgcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RIYWxmID0gZXZlbnQuY2xpZW50WSA8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50Lmluc2VydEJlZm9yZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RIYWxmID8gbGlzdEl0ZW1Ob2RlIDogbGlzdEl0ZW1Ob2RlLm5leHRTaWJsaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW4gSUUgd2Ugc2V0IGEgZmFrZSBlZmZlY3RBbGxvd2VkIGluIGRyYWdzdGFydCB0byBnZXQgdGhlIGNvcnJlY3QgY3Vyc29yLCB3ZSB0aGVyZWZvcmVcclxuICAgICAgICAvLyBpZ25vcmUgdGhlIGVmZmVjdEFsbG93ZWQgcGFzc2VkIGluIGRhdGFUcmFuc2Zlci4gV2UgbXVzdCBhbHNvIG5vdCBhY2Nlc3MgZGF0YVRyYW5zZmVyIGZvclxyXG4gICAgICAgIC8vIGRyb3BzIGZyb20gZXh0ZXJuYWwgc291cmNlcywgYXMgdGhhdCB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgIGxldCBpZ25vcmVEYXRhVHJhbnNmZXI6IGJvb2xlYW4gPSBtaW1lVHlwZSA9PT0gTVNJRV9NSU1FX1RZUEU7XHJcbiAgICAgICAgbGV0IGRyb3BFZmZlY3Q6IHN0cmluZyA9IHRoaXMuZ2V0RHJvcEVmZmVjdChldmVudCwgaWdub3JlRGF0YVRyYW5zZmVyKTtcclxuICAgICAgICBpZiAoZHJvcEVmZmVjdCA9PT0gJ25vbmUnKSByZXR1cm4gdGhpcy5zdG9wRHJhZ092ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBpbnZva2UgdGhlIGNhbGxiYWNrLCB3aGljaCBzdGlsbCBjYW4gZGlzYWxsb3cgdGhlIGRyb3AuXHJcbiAgICAgICAgLy8gV2UgY2FuJ3QgZG8gdGhpcyBlYXJsaWVyIGJlY2F1c2Ugd2Ugd2FudCB0byBwYXNzIHRoZSBpbmRleCBvZiB0aGUgcGxhY2Vob2xkZXIuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuZG5kRHJhZ092ZXIgJiZcclxuICAgICAgICAvLyAgICAgIXRoaXMuaW52b2tlQ2FsbGJhY2sodGhpcy5kbmREcmFnT3ZlciwgZXZlbnQsIGRyb3BFZmZlY3QsIGl0ZW1UeXBlKSkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5zdG9wRHJhZ092ZXIoKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKCFpZ25vcmVEYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBkcm9wRWZmZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RuZERyYWdvdmVyJyk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gICAgcHVibGljIGhhbmRsZURyb3AoZXZlbnQ6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGV2ZW50ID0gZXZlbnRbJ29yaWdpbmFsRXZlbnQnXSB8fCBldmVudDtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZHJvcCBpcyBhbGxvd2VkIGFuZCBkZXRlcm1pbmUgbWltZSB0eXBlLlxyXG4gICAgICAgIGxldCBtaW1lVHlwZTogc3RyaW5nIHwgbnVsbCA9IHRoaXMuZ2V0TWltZVR5cGUoZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzKTtcclxuICAgICAgICBsZXQgaXRlbVR5cGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQgPSB0aGlzLmdldEl0ZW1UeXBlKG1pbWVUeXBlKTtcclxuICAgICAgICBpZiAoIW1pbWVUeXBlIHx8ICF0aGlzLmlzRHJvcEFsbG93ZWQoaXRlbVR5cGUpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3IgaW4gRmlyZWZveCBpcyB0byBpbnRlcnByZXQgdGhlIGRyb3BwZWQgZWxlbWVudCBhcyBVUkwgYW5kXHJcbiAgICAgICAgLy8gZm9yd2FyZCB0byBpdC4gV2Ugd2FudCB0byBwcmV2ZW50IHRoYXQgZXZlbiBpZiBvdXIgZHJvcCBpcyBhYm9ydGVkLlxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhOiBhbnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgLy8gVW5zZXJpYWxpemUgdGhlIGRhdGEgdGhhdCB3YXMgc2VyaWFsaXplZCBpbiBkcmFnc3RhcnQuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEobWltZVR5cGUpKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3BEcmFnT3ZlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRHJvcHMgd2l0aCBpbnZhbGlkIHR5cGVzIGZyb20gZXh0ZXJuYWwgc291cmNlcyBtaWdodCBub3QgaGF2ZSBiZWVuIGZpbHRlcmVkIG91dCB5ZXQuXHJcbiAgICAgICAgaWYgKG1pbWVUeXBlID09PSBNU0lFX01JTUVfVFlQRSB8fCBtaW1lVHlwZSA9PT0gRURHRV9NSU1FX1RZUEUpIHtcclxuICAgICAgICAgICAgaXRlbVR5cGUgPSBkYXRhLnR5cGUgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBkYXRhID0gZGF0YS5pdGVtO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNEcm9wQWxsb3dlZChpdGVtVHlwZSkpIHJldHVybiB0aGlzLnN0b3BEcmFnT3ZlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgaW50ZXJuYWwgSUUgZHJvcHMsIHNlZSBkcmFnb3ZlciBoYW5kbGVyLlxyXG4gICAgICAgIGxldCBpZ25vcmVEYXRhVHJhbnNmZXI6IGJvb2xlYW4gPSBtaW1lVHlwZSA9PT0gTVNJRV9NSU1FX1RZUEU7XHJcbiAgICAgICAgbGV0IGRyb3BFZmZlY3Q6IHN0cmluZyA9IHRoaXMuZ2V0RHJvcEVmZmVjdChldmVudCwgaWdub3JlRGF0YVRyYW5zZmVyKTtcclxuICAgICAgICBpZiAoZHJvcEVmZmVjdCA9PT0gJ25vbmUnKSByZXR1cm4gdGhpcy5zdG9wRHJhZ092ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjaywgd2hpY2ggY2FuIHRyYW5zZm9ybSB0aGUgdHJhbnNmZXJyZWRPYmplY3QgYW5kIGV2ZW4gYWJvcnQgdGhlIGRyb3AuXHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmdldFBsYWNlaG9sZGVySW5kZXgoKTtcclxuICAgICAgICAvLyBjcmVhdGUgYW4gb2Zmc2V0IHRvIGFjY291bnQgZm9yIGV4dHJhIGVsZW1lbnRzIChpbmNsdWRpbmcgdGhlIHBsYWNlaG9sZGVyIGVsZW1lbnQpXHJcbiAgICAgICAgbGV0IG9mZnNldDogbnVtYmVyID0gdGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCAtIDEgLSB0aGlzLmRuZE1vZGVsLmxlbmd0aDtcclxuICAgICAgICBpZiAodGhpcy5kbmREcm9wKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlQ2FsbGJhY2sodGhpcy5kbmREcm9wLCBldmVudCwgZHJvcEVmZmVjdCwgaXRlbVR5cGUsIGluZGV4LCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gdGhpcy5zdG9wRHJhZ092ZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBkcm9wIGlzIGRlZmluaXRlbHkgZ29pbmcgdG8gaGFwcGVuIG5vdywgc3RvcmUgdGhlIGRyb3BFZmZlY3QuXHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUuZHJvcEVmZmVjdCA9IGRyb3BFZmZlY3Q7XHJcbiAgICAgICAgaWYgKCFpZ25vcmVEYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBkcm9wRWZmZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5zZXJ0IHRoZSBvYmplY3QgaW50byB0aGUgYXJyYXksIHVubGVzcyBkbmQtZHJvcCB0b29rIGNhcmUgb2YgdGhhdCAocmV0dXJuZWQgdHJ1ZSkuXHJcbiAgICAgICAgaWYgKGRhdGEgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgLy8gdXNlIHRoZSBvZmZzZXQgdG8gY3JlYXRlIGFuIGluc2VydGlvblBvaW50XHJcbiAgICAgICAgICAgIGxldCBpbnNlcnRpb25Qb2ludDogbnVtYmVyID0gaW5kZXggLSBvZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChpbnNlcnRpb25Qb2ludCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGluc2VydGlvblBvaW50ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRuZE1vZGVsLnNwbGljZShpbnNlcnRpb25Qb2ludCwgMCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW52b2tlQ2FsbGJhY2sodGhpcy5kbmRJbnNlcnRlZCwgZXZlbnQsIGRyb3BFZmZlY3QsIGl0ZW1UeXBlLCBpbmRleCwgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFRlbGwgb2xkIG9iamVjdCB0byBoYW5kbGUgaXRzZWxmXHJcbiAgICAgICAgZHJvcEFjY2VwdGVkLm5leHQoeyBpdGVtOiBkYXRhLCBsaXN0OiB0aGlzLmRuZE1vZGVsIH0pO1xyXG5cclxuICAgICAgICAvLyBDbGVhbiB1cFxyXG4gICAgICAgIHRoaXMuc3RvcERyYWdPdmVyKCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgaGFuZGxlRHJhZ0xlYXZlKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBldmVudCA9IGV2ZW50WydvcmlnaW5hbEV2ZW50J10gfHwgZXZlbnQ7XHJcblxyXG4gICAgICAgIGxldCBuZXdUYXJnZXQ6IEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcclxuICAgICAgICBpZiAodGhpcy5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKG5ld1RhcmdldCkgJiYgIWV2ZW50WydfZG5kUGhTaG93biddKSB7XHJcbiAgICAgICAgICAgIC8vIFNpZ25hbGl6ZSB0byBwb3RlbnRpYWwgcGFyZW50IGxpc3RzIHRoYXQgYSBwbGFjZWhvbGRlciBpcyBhbHJlYWR5IHNob3duLlxyXG4gICAgICAgICAgICBldmVudFsnX2RuZFBoU2hvd24nXSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wRHJhZ092ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQbGFjZWhvbGRlckVsZW1lbnQoKTogRWxlbWVudCB7XHJcbiAgICAgICAgbGV0IHBsYWNlaG9sZGVyOiBFbGVtZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IHRoaXMubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQ6IEVsZW1lbnQgfCBudWxsID0gdGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLml0ZW0oaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQ/LmNsYXNzTGlzdC5jb250YWlucygnZG5kUGxhY2Vob2xkZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBsYWNlaG9sZGVyRGVmYXVsdDogRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgcGxhY2Vob2xkZXJEZWZhdWx0LmNsYXNzTGlzdC5hZGQoJ2RuZFBsYWNlaG9sZGVyJyk7XHJcbiAgICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyIHx8IHBsYWNlaG9sZGVyRGVmYXVsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdpdmVuIHRoZSB0eXBlcyBhcnJheSBmcm9tIHRoZSBEYXRhVHJhbnNmZXIgb2JqZWN0LCByZXR1cm5zIHRoZSBmaXJzdCB2YWxpZCBtaW1lIHR5cGUuXHJcbiAgICAgKiBBIHR5cGUgaXMgdmFsaWQgaWYgaXQgc3RhcnRzIHdpdGggTUlNRV9UWVBFLCBvciBpdCBlcXVhbHMgTVNJRV9NSU1FX1RZUEUgb3IgRURHRV9NSU1FX1RZUEUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0TWltZVR5cGUodHlwZXM6IHJlYWRvbmx5IHN0cmluZ1tdKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKCF0eXBlcykgcmV0dXJuIE1TSUVfTUlNRV9UWVBFOyAvLyBJRSA5IHdvcmthcm91bmQuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlc1tpXSA9PT0gTVNJRV9NSU1FX1RZUEUgfHwgdHlwZXNbaV0gPT09IEVER0VfTUlNRV9UWVBFIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlc1tpXS5zdWJzdHIoMCwgTUlNRV9UWVBFLmxlbmd0aCkgPT09IE1JTUVfVFlQRSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgdHlwZSBvZiB0aGUgaXRlbSBmcm9tIHRoZSBkbmRTdGF0ZSwgb3IgZnJvbSB0aGUgbWltZSB0eXBlIGZvciBpdGVtcyBmcm9tXHJcbiAgICAgKiBleHRlcm5hbCBzb3VyY2VzLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBpdGVtIHR5cGUgd2FzIHNldCBhbmQgbnVsbCBpZiB0aGUgaXRlbSB0eXBlIGNvdWxkXHJcbiAgICAgKiBub3QgYmUgZGV0ZXJtaW5lZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRJdGVtVHlwZShtaW1lVHlwZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdTdGF0ZS5pc0RyYWdnaW5nKSByZXR1cm4gdGhpcy5kcmFnU3RhdGUuaXRlbVR5cGUgfHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChtaW1lVHlwZSA9PT0gTVNJRV9NSU1FX1RZUEUgfHwgbWltZVR5cGUgPT09IEVER0VfTUlNRV9UWVBFKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKG1pbWVUeXBlICYmIG1pbWVUeXBlLnN1YnN0cihNSU1FX1RZUEUubGVuZ3RoICsgMSkpIHx8IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB2YXJpb3VzIGNvbmRpdGlvbnMgdGhhdCBtdXN0IGJlIGZ1bGZpbGxlZCBmb3IgYSBkcm9wIHRvIGJlIGFsbG93ZWQsIGluY2x1ZGluZyB0aGVcclxuICAgICAqIGRuZC1hbGxvd2VkLXR5cGVzIGF0dHJpYnV0ZS4gSWYgdGhlIGl0ZW0gVHlwZSBpcyB1bmtub3duIChudWxsKSwgdGhlIGRyb3Agd2lsbCBiZSBhbGxvd2VkLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlzRHJvcEFsbG93ZWQoaXRlbVR5cGU6IHN0cmluZyB8ICBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiAge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb24uZGlzYWJsZWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uLm1heCAmJiB0aGlzLmRuZE1vZGVsLmxlbmd0aCA9PT0gdGhpcy5vcHRpb24ubWF4KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb24uZXh0ZXJuYWxTb3VyY2VzICYmICF0aGlzLmRyYWdTdGF0ZS5pc0RyYWdnaW5nKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb24uYWxsb3dlZFR5cGVzIHx8IGl0ZW1UeXBlID09PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICEhaXRlbVR5cGUgJiYgdGhpcy5vcHRpb24hLmFsbG93ZWRUeXBlcz8uaW5kZXhPZihpdGVtVHlwZSkgIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGljaCBkcm9wIGVmZmVjdCB0byB1c2UgZm9yIHRoZSBnaXZlbiBldmVudC4gSW4gSW50ZXJuZXQgRXhwbG9yZXIgd2UgaGF2ZSB0b1xyXG4gICAgICogaWdub3JlIHRoZSBlZmZlY3RBbGxvd2VkIGZpZWxkIG9uIGRhdGFUcmFuc2Zlciwgc2luY2Ugd2Ugc2V0IGEgZmFrZSB2YWx1ZSBpbiBkcmFnc3RhcnQuXHJcbiAgICAgKiBJbiB0aG9zZSBjYXNlcyB3ZSByZWx5IG9uIGRuZFN0YXRlIHRvIGZpbHRlciBlZmZlY3RzLiBSZWFkIHRoZSBkZXNpZ24gZG9jIGZvciBtb3JlIGRldGFpbHM6XHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2VsanVlbmVtYW5uL2FuZ3VsYXItZHJhZy1hbmQtZHJvcC1saXN0cy93aWtpL0RhdGEtVHJhbnNmZXItRGVzaWduXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0RHJvcEVmZmVjdChldmVudDogRHJhZ0V2ZW50LCBpZ25vcmVEYXRhVHJhbnNmZXI6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBlZmZlY3RzOiBzdHJpbmdbXSA9IE9iamVjdC5hc3NpZ24oW10sIEFMTF9FRkZFQ1RTKTtcclxuICAgICAgICBpZiAoIWlnbm9yZURhdGFUcmFuc2Zlcikge1xyXG4gICAgICAgICAgICBlZmZlY3RzID0gdGhpcy5kbmRTdGF0ZS5maWx0ZXJFZmZlY3RzKGVmZmVjdHMsIGV2ZW50LmRhdGFUcmFuc2ZlciEuZWZmZWN0QWxsb3dlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRyYWdTdGF0ZS5pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgICAgIGVmZmVjdHMgPSB0aGlzLmRuZFN0YXRlLmZpbHRlckVmZmVjdHMoZWZmZWN0cywgdGhpcy5kcmFnU3RhdGUuZWZmZWN0QWxsb3dlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbiAmJiB0aGlzLm9wdGlvbi5lZmZlY3RBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGVmZmVjdHMgPSB0aGlzLmRuZFN0YXRlLmZpbHRlckVmZmVjdHMoZWZmZWN0cywgdGhpcy5vcHRpb24uZWZmZWN0QWxsb3dlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE1hY09TIGF1dG9tYXRpY2FsbHkgZmlsdGVycyBkYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCBkZXBlbmRpbmcgb24gdGhlIG1vZGlmaWVyIGtleXMsXHJcbiAgICAgICAgLy8gdGhlcmVmb3JlIHRoZSBmb2xsb3dpbmcgbW9kaWZpZXIga2V5cyB3aWxsIG9ubHkgYWZmZWN0IG90aGVyIG9wZXJhdGluZyBzeXN0ZW1zLlxyXG4gICAgICAgIGlmICghZWZmZWN0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdub25lJztcclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZWZmZWN0cy5pbmRleE9mKCdjb3B5JykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY29weSc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5hbHRLZXkgJiYgZWZmZWN0cy5pbmRleE9mKCdsaW5rJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnbGluayc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVmZmVjdHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU21hbGwgaGVscGVyIGZ1bmN0aW9uIHRoYXQgY2xlYW5zIHVwIGlmIHdlIGFib3J0ZWQgYSBkcm9wLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0b3BEcmFnT3ZlcigpOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRoaXMucGxhY2Vob2xkZXIpO1xyXG4gICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkbmREcmFnb3ZlcicpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW52b2tlcyBhIGNhbGxiYWNrIHdpdGggc29tZSBpbnRlcmVzdGluZyBwYXJhbWV0ZXJzIGFuZCByZXR1cm5zIHRoZSBjYWxsYmFja3MgcmV0dXJuIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGludm9rZUNhbGxiYWNrKFxyXG4gICAgICAgIGV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sXHJcbiAgICAgICAgZXZlbnQ6IERyYWdFdmVudCwgZHJvcEVmZmVjdDogc3RyaW5nLFxyXG4gICAgICAgIGl0ZW1UeXBlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBpbmRleD86IG51bWJlciwgaXRlbT86IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KHtcclxuICAgICAgICAgICAgZHJvcEVmZmVjdDogZHJvcEVmZmVjdCxcclxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxyXG4gICAgICAgICAgICBleHRlcm5hbDogIXRoaXMuZHJhZ1N0YXRlLmlzRHJhZ2dpbmcsXHJcbiAgICAgICAgICAgIGluZGV4OiBpbmRleCAhPT0gdW5kZWZpbmVkID8gaW5kZXggOiB0aGlzLmdldFBsYWNlaG9sZGVySW5kZXgoKSxcclxuICAgICAgICAgICAgaXRlbTogaXRlbSB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHR5cGU6IGl0ZW1UeXBlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBXZSB1c2UgdGhlIHBvc2l0aW9uIG9mIHRoZSBwbGFjZWhvbGRlciBub2RlIHRvIGRldGVybWluZSBhdCB3aGljaCBwb3NpdGlvbiBvZiB0aGUgYXJyYXkgdGhlXHJcbiAgICAgKiBvYmplY3QgbmVlZHMgdG8gYmUgaW5zZXJ0ZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQbGFjZWhvbGRlckluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBkcmFnZ2luZyBlbGVtZW50IHRvIGdldCB0aGUgY29ycmVjdCBpbmRleCBvZiB0aGUgcGxhY2Vob2xkZXI7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5jb250YWlucygnZG5kRHJhZ2dpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5baV0ucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4sIHRoaXMucGxhY2Vob2xkZXIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==