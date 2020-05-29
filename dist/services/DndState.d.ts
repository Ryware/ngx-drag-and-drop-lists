import { DndStateConfig } from '../index';
export declare class DndState {
    dragState: DndStateConfig;
    filterEffects(effects: string[], effectAllowed: string): string[];
}
