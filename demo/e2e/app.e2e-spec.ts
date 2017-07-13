import { NgxDragAndDropListDemoPage } from './app.po';

describe('ngx-drag-and-drop-list-demo App', () => {
  let page: NgxDragAndDropListDemoPage;

  beforeEach(() => {
    page = new NgxDragAndDropListDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
