export interface DndListSettings {
    allowedTypes?: string[];
    effectAllowed?: 'move' | 'copy' | 'link' | undefined;
    disabled?: boolean;
    externalSources?: boolean;
    horizontal?: boolean;
    max?: number;
}
