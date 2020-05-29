"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ContainerComponent = /** @class */ (function () {
    function ContainerComponent() {
    }
    ContainerComponent.prototype.isArray = function (object) {
        return Array.isArray(object);
    };
    ContainerComponent.prototype.removeItem = function (item, list) {
        list.splice(list.indexOf(item), 1);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ContainerComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ContainerComponent.prototype, "list", void 0);
    ContainerComponent = __decorate([
        core_1.Component({
            selector: 'container',
            template: "\n    <div class=\"panel panel-default\" [dndType]=\"model.type\"\n    [dndDraggable]\n    (dndMoved)=\"removeItem(model, list)\"\n    [dndObject]=\"model\">\n    <div class=\"panel-heading\">\n      {{model.type}} {{model.id}}\n    </div>\n    <div class=\"panel-body\" [dndList]=\"{\n        allowedTypes: ['container','item']}\"\n        [dndModel]=\"model.columns\"\n        [dndPlaceholder]=\"placeholder\">\n      <ng-container *ngFor=\"let item of model.columns\">\n      <ng-container *ngIf=\"isArray(item)\">\n        <ng-container *ngFor=\"let subItem of item\">\n        <container *ngIf=\"subItem.type === 'container'\"\n        [list]=\"item\"\n        [model]=\"subItem\"></container>\n        <div *ngIf=\"subItem.type === 'item'\" [dndType]=\"subItem.type\"\n        [dndDraggable]=\"{draggable:true, effectAllowed:'move'}\"\n        (dndMoved)=\"removeItem(subItem, item)\"\n        [dndObject]=\"subItem\" class=\"col-md-12\">{{subItem.type}} {{subItem.id}}</div>\n        </ng-container>\n      </ng-container>\n      <ng-container *ngIf=\"!isArray(item)\">\n        <container *ngIf=\"item.type === 'container'\" [list]=\"model.columns\"\n          [model]=\"item\"></container>\n         \n          <div *ngIf=\"item.type === 'item'\" [dndType]=\"item.type\"\n          [dndDraggable]=\"{draggable:true, effectAllowed:'move'}\"\n          (dndMoved)=\"removeItem(item, model.columns)\"\n          [dndObject]=\"item\" class=\"col-md-12\">{{item.type}} {{item.id}}</div>\n\n          </ng-container>\n      </ng-container>\n    </div>\n  </div>\n\n  <div class=\"dndPlaceholder col-md-12\"\n  #placeholder></div>\n    "
        })
    ], ContainerComponent);
    return ContainerComponent;
}());
exports.ContainerComponent = ContainerComponent;
//# sourceMappingURL=container.component.js.map