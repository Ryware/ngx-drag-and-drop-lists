export interface DndDraggableConfig {
    draggable: boolean;
    effectAllowed: string;
}

export interface DndStateConfig {
    isDragging: boolean;
    itemType: string;
    dropEffect: string;
    effectAllowed: string;
}
