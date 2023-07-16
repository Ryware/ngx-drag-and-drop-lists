// In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
// However, IE and Edge only support a limited number of mime types. The workarounds are described
// in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
export const MIME_TYPE: string = 'application/x-dnd';
export const EDGE_MIME_TYPE: string = 'application/json';
export const MSIE_MIME_TYPE: string = 'Text';

// All valid HTML5 drop effects, in the order in which we prefer to use them.
export const ALL_EFFECTS: Effects[] = ['move', 'copy', 'link'];

export type Effects = 'move' | 'copy' | 'link';
