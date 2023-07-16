import { Directive, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../services";
/**
 * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
 * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
 * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
 * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
 * can work around this by styling the handle element differently when it is being dragged. Use
 * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
 */
export class DndHandle {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndHandle, deps: [{ token: i0.ElementRef }, { token: i1.DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndHandle, selector: "[dndHandle]", host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndHandle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndHandle]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DndState }]; }, propDecorators: { handleDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], handleDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kcmFnLWFuZC1kcm9wLWxpc3RzL3NyYy9saWIvZGlyZWN0aXZlcy9kbmQtaGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLcEU7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBSXBCLFlBQXFCLE9BQW1CLEVBQVcsUUFBa0I7UUFBaEQsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFXLGFBQVEsR0FBUixRQUFRLENBQVU7UUFEN0Qsb0JBQWUsR0FBVyxXQUFXLENBQUM7UUFFNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFHTSxlQUFlLENBQUMsS0FBVTtRQUMvQixLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUN4QyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFHTSxhQUFhLENBQUMsS0FBVTtRQUM3QixLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7OEdBdkJVLFNBQVM7a0dBQVQsU0FBUzs7MkZBQVQsU0FBUztrQkFYckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtpQkFDeEI7d0hBb0JRLGVBQWU7c0JBRHJCLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQU85QixhQUFhO3NCQURuQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERuZFN0YXRlLCBEbmRTdGF0ZUNvbmZpZyB9IGZyb20gJy4uL3NlcnZpY2VzJztcclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbZG5kSGFuZGxlXScsXHJcbn0pXHJcbi8qKlxyXG4gKiBVc2UgdGhlIGRuZC1oYW5kbGUgZGlyZWN0aXZlIHdpdGhpbiBhIGRuZC1ub2RyYWcgZWxlbWVudCBpbiBvcmRlciB0byBhbGxvdyBkcmFnZ2luZyB3aXRoIHRoYXRcclxuICogZWxlbWVudCBhZnRlciBhbGwuIFRoZXJlZm9yZSwgYnkgY29tYmluaW5nIGRuZC1ub2RyYWcgYW5kIGRuZC1oYW5kbGUgeW91IGNhbiBhbGxvd1xyXG4gKiBkbmQtZHJhZ2dhYmxlIGVsZW1lbnRzIHRvIG9ubHkgYmUgZHJhZ2dlZCB2aWEgc3BlY2lmaWMgXCJoYW5kbGVcIiBlbGVtZW50cy4gTm90ZSB0aGF0IEludGVybmV0XHJcbiAqIEV4cGxvcmVyIHdpbGwgc2hvdyB0aGUgaGFuZGxlIGVsZW1lbnQgYXMgZHJhZyBpbWFnZSBpbnN0ZWFkIG9mIHRoZSBkbmQtZHJhZ2dhYmxlIGVsZW1lbnQuIFlvdVxyXG4gKiBjYW4gd29yayBhcm91bmQgdGhpcyBieSBzdHlsaW5nIHRoZSBoYW5kbGUgZWxlbWVudCBkaWZmZXJlbnRseSB3aGVuIGl0IGlzIGJlaW5nIGRyYWdnZWQuIFVzZVxyXG4gKiB0aGUgQ1NTIHNlbGVjdG9yIC5kbmREcmFnZ2luZzpub3QoLmRuZERyYWdnaW5nU291cmNlKSBbZG5kLWhhbmRsZV0gZm9yIHRoYXQuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRG5kSGFuZGxlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGRyYWdTdGF0ZTogRG5kU3RhdGVDb25maWc7XHJcbiAgcHJpdmF0ZSBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIGRyYWdnYWJsZVN0cmluZzogc3RyaW5nID0gJ2RyYWdnYWJsZSc7XHJcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZWxlbWVudDogRWxlbWVudFJlZiwgcmVhZG9ubHkgZG5kU3RhdGU6IERuZFN0YXRlKSB7XHJcbiAgICB0aGlzLmRyYWdTdGF0ZSA9IGRuZFN0YXRlLmRyYWdTdGF0ZTtcclxuICAgIHRoaXMubmF0aXZlRWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5kcmFnZ2FibGVTdHJpbmcsICd0cnVlJyk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnc3RhcnQnLCBbJyRldmVudCddKVxyXG4gIHB1YmxpYyBoYW5kbGVEcmFnU3RhcnQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgZXZlbnQgPSBldmVudFsnb3JpZ2luYWxFdmVudCddIHx8IGV2ZW50O1xyXG4gICAgZXZlbnRbJ19kbmRIYW5kbGUnXSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSlcclxuICBwdWJsaWMgaGFuZGxlRHJhZ0VuZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBldmVudCA9IGV2ZW50WydvcmlnaW5hbEV2ZW50J10gfHwgZXZlbnQ7XHJcblxyXG4gICAgaWYgKCFldmVudFsnX2RuZEhhbmRsZSddKSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=