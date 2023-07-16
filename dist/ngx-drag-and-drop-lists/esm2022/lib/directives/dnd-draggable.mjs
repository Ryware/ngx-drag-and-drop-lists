import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { ALL_EFFECTS, EDGE_MIME_TYPE, MIME_TYPE, MSIE_MIME_TYPE } from '../services';
import { dropAccepted } from './dnd-list';
import * as i0 from "@angular/core";
import * as i1 from "../services";
export class DndDraggable {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndDraggable, deps: [{ token: i0.ElementRef }, { token: i1.DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndDraggable, selector: "[dndDraggable]", inputs: { option: ["dndDraggable", "option"], dndType: "dndType", dndObject: "dndObject", disableDrag: ["dndDragDisabled", "disableDrag"] }, outputs: { dndDragStart: "dndDragStart", dndDragEnd: "dndDragEnd", dndCopied: "dndCopied", dndLinked: "dndLinked", dndMoved: "dndMoved", dndCanceled: "dndCanceled", dndSelected: "dndSelected" }, host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)", "click": "handleClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndDraggable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndDraggable]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DndState }]; }, propDecorators: { option: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWRyYWdnYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kcmFnLWFuZC1kcm9wLWxpc3RzL3NyYy9saWIvZGlyZWN0aXZlcy9kbmQtZHJhZ2dhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBaUMsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwSCxPQUFPLEVBQUUsV0FBVyxFQUFnRCxjQUFjLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNuSSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDOzs7QUFLMUMsTUFBTSxPQUFPLFlBQVk7SUFJckIsSUFBcUMsV0FBVyxDQUFDLE9BQXlCO1FBQ3RFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN4RjtJQUNMLENBQUM7SUFZRCxZQUNxQixPQUFtQixFQUNuQixRQUFrQjtRQURsQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVU7UUFyQlQsV0FBTSxHQUF1RCxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQVFoRixpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNwRCxjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsY0FBUyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5Qyxn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QVM7Z0JBQ1csU0FBUztzQkFBbkMsS0FBSzt1QkFBQyxXQUFXO2dCQUNtQixXQUFXO3NCQUEvQyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFLTyxZQUFZO3NCQUExQyxNQUFNO3VCQUFDLGNBQWM7Z0JBQ08sVUFBVTtzQkFBdEMsTUFBTTt1QkFBQyxZQUFZO2dCQUNRLFNBQVM7c0JBQXBDLE1BQU07dUJBQUMsV0FBVztnQkFDUyxTQUFTO3NCQUFwQyxNQUFNO3VCQUFDLFdBQVc7Z0JBQ1EsUUFBUTtzQkFBbEMsTUFBTTt1QkFBQyxVQUFVO2dCQUNZLFdBQVc7c0JBQXhDLE1BQU07dUJBQUMsYUFBYTtnQkFDUyxXQUFXO3NCQUF4QyxNQUFNO3VCQUFDLGFBQWE7Z0JBc0NkLGVBQWU7c0JBRHJCLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQXVEOUIsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBWTVCLFdBQVc7c0JBRGpCLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT3V0cHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQUxMX0VGRkVDVFMsIERuZERyYWdnYWJsZUNvbmZpZywgRG5kU3RhdGUsIERuZFN0YXRlQ29uZmlnLCBFREdFX01JTUVfVFlQRSwgTUlNRV9UWVBFLCBNU0lFX01JTUVfVFlQRSB9IGZyb20gJy4uL3NlcnZpY2VzJztcclxuaW1wb3J0IHsgZHJvcEFjY2VwdGVkIH0gZnJvbSAnLi9kbmQtbGlzdCc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW2RuZERyYWdnYWJsZV0nLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRG5kRHJhZ2dhYmxlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gICAgQElucHV0KCdkbmREcmFnZ2FibGUnKSBwdWJsaWMgb3B0aW9uOiBEbmREcmFnZ2FibGVDb25maWcgfCB1bmRlZmluZWQgPSA8RG5kRHJhZ2dhYmxlQ29uZmlnPnsgZHJhZ2dhYmxlOiB0cnVlIH07XHJcbiAgICBASW5wdXQoJ2RuZFR5cGUnKSBwdWJsaWMgZG5kVHlwZSE6IHN0cmluZztcclxuICAgIEBJbnB1dCgnZG5kT2JqZWN0JykgcHVibGljIGRuZE9iamVjdCE6IGFueTtcclxuICAgIEBJbnB1dCgnZG5kRHJhZ0Rpc2FibGVkJykgcHVibGljIHNldCBkaXNhYmxlRHJhZyhkaXNhYmxlOiBzdHJpbmcgfCBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGRpc2FibGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5kcmFnZ2FibGVTdHJpbmcsICghZGlzYWJsZSkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQE91dHB1dCgnZG5kRHJhZ1N0YXJ0JykgcHVibGljIGRuZERyYWdTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCdkbmREcmFnRW5kJykgcHVibGljIGRuZERyYWdFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnZG5kQ29waWVkJykgcHVibGljIGRuZENvcGllZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCdkbmRMaW5rZWQnKSBwdWJsaWMgZG5kTGlua2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoJ2RuZE1vdmVkJykgcHVibGljIGRuZE1vdmVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoJ2RuZENhbmNlbGVkJykgcHVibGljIGRuZENhbmNlbGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoJ2RuZFNlbGVjdGVkJykgcHVibGljIGRuZFNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRyYWdTdGF0ZTogRG5kU3RhdGVDb25maWc7XHJcbiAgICBwcml2YXRlIGRyb3BTdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XHJcbiAgICBwcml2YXRlIGRyYWdnYWJsZVN0cmluZzogc3RyaW5nID0gJ2RyYWdnYWJsZSc7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBkbmRTdGF0ZTogRG5kU3RhdGUsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmRyYWdTdGF0ZSA9IGRuZFN0YXRlLmRyYWdTdGF0ZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5kcmFnZ2FibGVTdHJpbmcsICd0cnVlJyk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV29ya2Fyb3VuZCB0byBtYWtlIGVsZW1lbnQgZHJhZ2dhYmxlIGluIElFOVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9uc2VsZWN0c3RhcnQgPSBmdW5jdGlvbiAoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdEcm9wKSB0aGlzLmRyYWdEcm9wKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcm9wU3Vic2NyaXB0aW9uID0gZHJvcEFjY2VwdGVkLnN1YnNjcmliZSgoeyBpdGVtLCBsaXN0IH0pID0+IHtcclxuICAgICAgICAgICAgLy8gZXZlbnQgPSBldmVudFsnb3JpZ2luYWxFdmVudCddIHx8IGV2ZW50O1xyXG4gICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5kbmRPYmplY3QpID09PSBKU09OLnN0cmluZ2lmeShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNiOiBvYmplY3QgPSB7IGNvcHk6ICdkbmRDb3BpZWQnLCBsaW5rOiAnZG5kTGlua2VkJywgbW92ZTogJ2RuZE1vdmVkJywgbm9uZTogJ2RuZENhbmNlbGVkJyB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1N0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29weU9iamVjdCA9IChjYiBhcyBhbnkpW3RoaXMuZHJhZ1N0YXRlLmVmZmVjdEFsbG93ZWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICgodGhpcyBhcyBhbnkpW2NvcHlPYmplY3RdIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRuZERyYWdFbmQuZW1pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJvcFN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdkcmFnc3RhcnQnLCBbJyRldmVudCddKVxyXG4gICAgcHVibGljIGhhbmRsZURyYWdTdGFydChldmVudDogRHJhZ0V2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGVkIGNoZWNrXHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmRyYWdnYWJsZVN0cmluZykgPT09ICdmYWxzZScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaW5pdCBkcmFnXHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUuaXRlbVR5cGUgPSB0aGlzLmRuZFR5cGU7XHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUuZHJvcEVmZmVjdCA9ICdub25lJztcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9uID0gPERuZERyYWdnYWJsZUNvbmZpZz57IGRyYWdnYWJsZTogdHJ1ZSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYWdTdGF0ZS5lZmZlY3RBbGxvd2VkID0gdGhpcy5vcHRpb24uZWZmZWN0QWxsb3dlZCB8fCBBTExfRUZGRUNUU1swXTtcclxuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIhLmVmZmVjdEFsbG93ZWQgPSB0aGlzLmRyYWdTdGF0ZS5lZmZlY3RBbGxvd2VkO1xyXG4gICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIGFuZCBNaWNyb3NvZnQgRWRnZSBkb24ndCBzdXBwb3J0IGN1c3RvbSBtaW1lIHR5cGVzLCBzZWUgZGVzaWduIGRvYzpcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWFyY2VsanVlbmVtYW5uL2FuZ3VsYXItZHJhZy1hbmQtZHJvcC1saXN0cy93aWtpL0RhdGEtVHJhbnNmZXItRGVzaWduXHJcbiAgICAgICAgbGV0IG1pbWVUeXBlOiBzdHJpbmcgPSBNSU1FX1RZUEUgKyAodGhpcy5kcmFnU3RhdGUuaXRlbVR5cGUgPyAoJy0nICsgdGhpcy5kcmFnU3RhdGUuaXRlbVR5cGUpIDogJycpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShtaW1lVHlwZSwgSlNPTi5zdHJpbmdpZnkodGhpcy5kbmRPYmplY3QpKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIFNldHRpbmcgYSBjdXN0b20gTUlNRSB0eXBlIGRpZCBub3Qgd29yaywgd2UgYXJlIHByb2JhYmx5IGluIElFIG9yIEVkZ2UuXHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh7IGl0ZW06IHRoaXMuZG5kT2JqZWN0LCB0eXBlOiB0aGlzLmRyYWdTdGF0ZS5pdGVtVHlwZSB9KTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShFREdFX01JTUVfVFlQRSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBpbiBJbnRlcm5ldCBFeHBsb3JlciBhbmQgY2FuIG9ubHkgdXNlIHRoZSBUZXh0IE1JTUUgdHlwZS4gQWxzbyBub3RlIHRoYXQgSUVcclxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IGFsbG93IGNoYW5naW5nIHRoZSBjdXJzb3IgaW4gdGhlIGRyYWdvdmVyIGV2ZW50LCB0aGVyZWZvcmUgd2UgaGF2ZSB0byBjaG9vc2VcclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbmUgd2Ugd2FudCB0byBkaXNwbGF5IG5vdyBieSBzZXR0aW5nIGVmZmVjdEFsbG93ZWQuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWZmZWN0c0FsbG93ZWQ6IHN0cmluZ1tdID0gdGhpcy5kbmRTdGF0ZS5maWx0ZXJFZmZlY3RzKEFMTF9FRkZFQ1RTLCB0aGlzLmRyYWdTdGF0ZS5lZmZlY3RBbGxvd2VkKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuZWZmZWN0QWxsb3dlZCA9IGVmZmVjdHNBbGxvd2VkWzBdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RGF0YShNU0lFX01JTUVfVFlQRSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZCBkcmFnIGNsYXNzZXNcclxuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkbmREcmFnZ2luZycpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTdGF0ZS5lZmZlY3RBbGxvd2VkID09PSAnbW92ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVHJ5IHNldHRpbmcgYSBwcm9wZXIgZHJhZyBpbWFnZSBpZiB0cmlnZ2VyZWQgb24gYSBkbmQtaGFuZGxlICh3b24ndCB3b3JrIGluIElFKS5cclxuICAgICAgICBpZiAoKGV2ZW50IGFzIGFueSkuX2RuZEhhbmRsZSAmJiBldmVudC5kYXRhVHJhbnNmZXI/LnNldERyYWdJbWFnZSkge1xyXG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIhLnNldERyYWdJbWFnZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRuZERyYWdTdGFydC5lbWl0KCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignZHJhZ2VuZCcsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgaGFuZGxlRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgICB0aGlzLmRyYWdTdGF0ZS5pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZG5kRHJhZ2dpbmcnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnZGlzcGxheScpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIC8vIEluIElFOSBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSB0aW1lb3V0IGZyb20gZHJhZ3N0YXJ0IHRyaWdnZXJzIGFmdGVyIHRoZSBkcmFnZW5kIGhhbmRsZXIuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKCkgPT4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZG5kRHJhZ2dpbmdTb3VyY2UnKSksIDApO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBoYW5kbGVDbGljayhldmVudDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RuZFNlbGVjdGVkJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgZXZlbnQgPSBldmVudFsnb3JpZ2luYWxFdmVudCddIHx8IGV2ZW50O1xyXG5cclxuICAgICAgICB0aGlzLmRuZFNlbGVjdGVkLmVtaXQoKTtcclxuXHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbn1cclxuIl19