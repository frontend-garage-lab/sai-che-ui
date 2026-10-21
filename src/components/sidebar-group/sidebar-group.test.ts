import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlSidebarGroup from './sidebar-group.js';

describe('<sl-sidebar-group>', () => {
  it('should render the label and count', async () => {
    const el = await fixture<SlSidebarGroup>(html`
      <sl-sidebar-group label="Procurement" count="71">
        <sl-sidebar-item href="#">Purchase Order</sl-sidebar-item>
      </sl-sidebar-group>
    `);

    await expect(el).to.be.accessible();
    expect(el.shadowRoot!.querySelector('[part~="label"]')!.textContent).to.equal('Procurement');
    expect(el.shadowRoot!.querySelector('[part~="count"]')!.textContent!.trim()).to.equal('71');
  });
});
