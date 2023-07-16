import { NgModule } from '@angular/core';
import { DndDraggable, DndHandle, DndList, DndNoDrag } from './directives';
import { DndState } from './services';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class DndListModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWctYW5kLWRyb3AtbGlzdHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWRyYWctYW5kLWRyb3AtbGlzdHMvc3JjL2xpYi9uZ3gtZHJhZy1hbmQtZHJvcC1saXN0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQWMvQyxNQUFNLE9BQU8sYUFBYTs4R0FBYixhQUFhOytHQUFiLGFBQWEsaUJBTFAsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxhQUx0RCxZQUFZLGFBR1osWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUzsrR0FPdEMsYUFBYSxhQUpYO1lBQ1AsUUFBUTtTQUNYLFlBUkcsWUFBWTs7MkZBVVAsYUFBYTtrQkFaekIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUU7d0JBQ0wsWUFBWTtxQkFDZjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUztxQkFDOUM7b0JBQ0QsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO29CQUMzRCxTQUFTLEVBQUU7d0JBQ1AsUUFBUTtxQkFDWDtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEbmREcmFnZ2FibGUsIERuZEhhbmRsZSwgRG5kTGlzdCwgRG5kTm9EcmFnIH0gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7IERuZFN0YXRlIH0gZnJvbSAnLi9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBEbmREcmFnZ2FibGUsIERuZEhhbmRsZSwgRG5kTGlzdCwgRG5kTm9EcmFnLFxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbRG5kRHJhZ2dhYmxlLCBEbmRIYW5kbGUsIERuZExpc3QsIERuZE5vRHJhZ10sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIERuZFN0YXRlLFxuICAgIF0sXG59KVxuZXhwb3J0IGNsYXNzIERuZExpc3RNb2R1bGUge1xufVxuXG4iXX0=