import { HelloAngPage } from './app.po';

describe('hello-ang App', function() {
  let page: HelloAngPage;

  beforeEach(() => {
    page = new HelloAngPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
