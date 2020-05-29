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
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.simpleList = [
            [
                { 'name': 'John' },
                { 'name': 'Smith' },
                { 'name': 'George' },
            ],
            [
                { 'name': 'Jennifer' },
                { 'name': 'Laura' },
                { 'name': 'Georgina' },
            ]
        ];
        this.typedList = [
            [
                { 'name': 'John', 'type': 'male' },
                { 'name': 'Smith', 'type': 'male' },
                { 'name': 'George', 'type': 'male' },
            ],
            [
                { 'name': 'Jennifer', 'type': 'female' },
                { 'name': 'Laura', 'type': 'female' },
                { 'name': 'Georgina', 'type': 'female' },
            ],
            [
                { 'name': 'Timmy', 'type': 'male' },
                { 'name': 'Karen', 'type': 'female' },
            ]
        ];
        this.nestedList = {
            selected: null,
            templates: [
                { type: "item", id: 2 },
                { type: "container", id: 1, columns: [[], []] }
            ],
            dropzones: [[
                    {
                        "type": "container",
                        "id": 1,
                        "columns": [
                            [
                                {
                                    "type": "item",
                                    "id": "1"
                                },
                                {
                                    "type": "item",
                                    "id": "2"
                                }
                            ],
                            [
                                {
                                    "type": "item",
                                    "id": "3"
                                }
                            ]
                        ]
                    },
                    {
                        "type": "item",
                        "id": "4"
                    },
                    {
                        "type": "item",
                        "id": "5"
                    },
                    {
                        "type": "item",
                        "id": "6"
                    }
                ],
                [
                    {
                        "type": "item",
                        "id": 7
                    },
                    {
                        "type": "item",
                        "id": "8"
                    },
                    {
                        "type": "container",
                        "id": "2",
                        "columns": [
                            [
                                {
                                    "type": "item",
                                    "id": "9"
                                },
                                {
                                    "type": "item",
                                    "id": "10"
                                },
                                {
                                    "type": "item",
                                    "id": "11"
                                }
                            ],
                            [
                                {
                                    "type": "item",
                                    "id": "12"
                                },
                                {
                                    "type": "container",
                                    "id": "3",
                                    "columns": [
                                        [
                                            {
                                                "type": "item",
                                                "id": "13"
                                            }
                                        ],
                                        [
                                            {
                                                "type": "item",
                                                "id": "14"
                                            }
                                        ]
                                    ]
                                },
                                {
                                    "type": "item",
                                    "id": "15"
                                },
                                {
                                    "type": "item",
                                    "id": "16"
                                }
                            ]
                        ]
                    },
                    {
                        "type": "item",
                        "id": 16
                    }
                ]]
        };
    }
    AppComponent.prototype.removeItem = function (item, list) {
        list.splice(list.indexOf(item), 1);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map