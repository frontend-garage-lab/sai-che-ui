import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-table-cell>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-table-cell></sl-table-cell> `);

    expect(el).to.exist;
  });
});
