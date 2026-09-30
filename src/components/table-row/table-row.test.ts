import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-table-row>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-table-row></sl-table-row> `);

    expect(el).to.exist;
  });
});
