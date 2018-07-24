import { Effects } from './constants';

export interface DndDraggableConfig {
    draggable: boolean;
    effectAllowed: Effects;
}

export interface DndStateConfig {
    isDragging: boolean;
    itemType: string;
    dropEffect: string;
    effectAllowed: Effects;
}
