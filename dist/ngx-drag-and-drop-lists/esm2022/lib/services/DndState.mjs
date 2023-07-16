import { Injectable } from '@angular/core';
import { ALL_EFFECTS } from './constants';
import * as i0 from "@angular/core";
export class DndState {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG5kU3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZHJhZy1hbmQtZHJvcC1saXN0cy9zcmMvbGliL3NlcnZpY2VzL0RuZFN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFHMUMsTUFBTSxPQUFPLFFBQVE7SUFEckI7UUFFVyxjQUFTLEdBQW1CO1lBQy9CLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQ2hDLENBQUM7S0FXTDtJQVRHOztPQUVHO0lBQ0ksYUFBYSxDQUFDLE9BQWlCLEVBQUUsYUFBcUI7UUFDekQsSUFBSSxhQUFhLEtBQUssS0FBSztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzdCLE9BQU8sYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OEdBaEJRLFFBQVE7a0hBQVIsUUFBUTs7MkZBQVIsUUFBUTtrQkFEcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQUxMX0VGRkVDVFMgfSBmcm9tICcuL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IERuZFN0YXRlQ29uZmlnIH0gZnJvbSAnLi9EbmREcmFnZ2FibGVDb25maWcnO1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBEbmRTdGF0ZSB7XHJcbiAgICBwdWJsaWMgZHJhZ1N0YXRlOiBEbmRTdGF0ZUNvbmZpZyA9IHtcclxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBpdGVtVHlwZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRyb3BFZmZlY3Q6ICdub25lJyxcclxuICAgICAgICBlZmZlY3RBbGxvd2VkOiBBTExfRUZGRUNUU1swXSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIGFuIGFycmF5IG9mIGRyb3AgZWZmZWN0cyB1c2luZyBhIEhUTUw1IGVmZmVjdEFsbG93ZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmlsdGVyRWZmZWN0cyhlZmZlY3RzOiBzdHJpbmdbXSwgZWZmZWN0QWxsb3dlZDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGVmZmVjdEFsbG93ZWQgPT09ICdhbGwnKSByZXR1cm4gZWZmZWN0cztcclxuICAgICAgICByZXR1cm4gZWZmZWN0cy5maWx0ZXIoKGVmZmVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZWZmZWN0QWxsb3dlZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZWZmZWN0KSAhPT0gLTE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19