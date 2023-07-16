import { Directive, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../services";
/**
 * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
 * drag operations. This is especially useful if you want to use input elements inside of
 * dnd-draggable elements or create specific handle elements. Note: This directive does not work
 * in Internet Explorer 9.
 */
export class DndNoDrag {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndNoDrag, deps: [{ token: i0.ElementRef }, { token: i1.DndState }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.5", type: DndNoDrag, selector: "[dndNoDrag]", host: { listeners: { "dragstart": "handleDragStart($event)", "dragend": "handleDragEnd($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.5", ngImport: i0, type: DndNoDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dndNoDrag]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DndState }]; }, propDecorators: { handleDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], handleDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLW5vZHJhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1kcmFnLWFuZC1kcm9wLWxpc3RzL3NyYy9saWIvZGlyZWN0aXZlcy9kbmQtbm9kcmFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFRcEU7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUlsQixZQUNhLE9BQW1CLEVBQ25CLFFBQWtCO1FBRGxCLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUh2QixvQkFBZSxHQUFXLFdBQVcsQ0FBQztRQUsxQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFbEUsQ0FBQztJQUdNLGVBQWUsQ0FBQyxLQUFVO1FBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyxDQUFDO1FBRXhDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEIseUZBQXlGO1lBQ3pGLDBGQUEwRjtZQUMxRixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDaEUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQzFCO1lBQ0QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUdNLGFBQWEsQ0FBQyxLQUFVO1FBQzNCLEtBQUssR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksS0FBSyxDQUFDO1FBRXhDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQzs4R0FuQ1EsU0FBUztrR0FBVCxTQUFTOzsyRkFBVCxTQUFTO2tCQVRyQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO2lCQUMxQjt3SEFzQlUsZUFBZTtzQkFEckIsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBZTlCLGFBQWE7c0JBRG5CLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIERuZFN0YXRlLFxyXG4gICAgRG5kU3RhdGVDb25maWcsXHJcbn0gZnJvbSAnLi4vc2VydmljZXMnO1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW2RuZE5vRHJhZ10nLFxyXG59KVxyXG4vKipcclxuICogVXNlIHRoZSBkbmQtbm9kcmFnIGF0dHJpYnV0ZSBpbnNpZGUgb2YgZG5kLWRyYWdnYWJsZSBlbGVtZW50cyB0byBwcmV2ZW50IHRoZW0gZnJvbSBzdGFydGluZ1xyXG4gKiBkcmFnIG9wZXJhdGlvbnMuIFRoaXMgaXMgZXNwZWNpYWxseSB1c2VmdWwgaWYgeW91IHdhbnQgdG8gdXNlIGlucHV0IGVsZW1lbnRzIGluc2lkZSBvZlxyXG4gKiBkbmQtZHJhZ2dhYmxlIGVsZW1lbnRzIG9yIGNyZWF0ZSBzcGVjaWZpYyBoYW5kbGUgZWxlbWVudHMuIE5vdGU6IFRoaXMgZGlyZWN0aXZlIGRvZXMgbm90IHdvcmtcclxuICogaW4gSW50ZXJuZXQgRXhwbG9yZXIgOS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEbmROb0RyYWcge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkcmFnU3RhdGU6IERuZFN0YXRlQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgZHJhZ2dhYmxlU3RyaW5nOiBzdHJpbmcgPSAnZHJhZ2dhYmxlJztcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHJlYWRvbmx5IGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcmVhZG9ubHkgZG5kU3RhdGU6IERuZFN0YXRlLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnU3RhdGUgPSBkbmRTdGF0ZS5kcmFnU3RhdGU7XHJcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5kcmFnZ2FibGVTdHJpbmcsICd0cnVlJyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pXHJcbiAgICBwdWJsaWMgaGFuZGxlRHJhZ1N0YXJ0KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBldmVudCA9IGV2ZW50WydvcmlnaW5hbEV2ZW50J10gfHwgZXZlbnQ7XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRbJ19kbmRIYW5kbGUnXSkge1xyXG4gICAgICAgICAgICAvLyBJZiBhIGNoaWxkIGVsZW1lbnQgYWxyZWFkeSByZWFjdGVkIHRvIGRyYWdzdGFydCBhbmQgc2V0IGEgZGF0YVRyYW5zZmVyIG9iamVjdCwgd2Ugd2lsbFxyXG4gICAgICAgICAgICAvLyBhbGxvdyB0aGF0LiBGb3IgZXhhbXBsZSwgdGhpcyBpcyB0aGUgY2FzZSBmb3IgdXNlciBzZWxlY3Rpb25zIGluc2lkZSBvZiBpbnB1dCBlbGVtZW50cy5cclxuICAgICAgICAgICAgaWYgKCEoZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzICYmIGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlcy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBoYW5kbGVEcmFnRW5kKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBldmVudCA9IGV2ZW50WydvcmlnaW5hbEV2ZW50J10gfHwgZXZlbnQ7XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRbJ19kbmRIYW5kbGUnXSkge1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19