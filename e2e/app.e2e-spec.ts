import { ClimatePage } from './app.po';

describe('climate App', () => {
  let page: ClimatePage;

  beforeEach(() => {
    page = new ClimatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('app works!');
  });
});
