import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-table-column>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-table-column></sl-table-column> `);

    expect(el).to.exist;
  });
});
