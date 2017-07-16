// In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
// However, IE and Edge only support a limited number of mime types. The workarounds are described
// in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
export const MIME_TYPE = 'application/x-dnd';
export const EDGE_MIME_TYPE = 'application/json';
export const MSIE_MIME_TYPE = 'Text';

// All valid HTML5 drop effects, in the order in which we prefer to use them.
export const ALL_EFFECTS: string[] = ['move', 'copy', 'link'];
