import '../../../dist/shoelace.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import type SlSidebar from './sidebar.js';
import type SlSidebarItem from '../sidebar-item/sidebar-item.js';

describe('<sl-sidebar>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlSidebar>(html`
      <sl-sidebar>
        <sl-sidebar-group label="Documents" count="8">
          <sl-sidebar-item href="#" count="6" current>Job Document</sl-sidebar-item>
          <sl-sidebar-item href="#" count="2">Reference Document</sl-sidebar-item>
        </sl-sidebar-group>
      </sl-sidebar>
    `);

    await expect(el).to.be.accessible();
  });

  it('should collapse when the toggle is clicked and propagate to children', async () => {
    const el = await fixture<SlSidebar>(html`
      <sl-sidebar>
        <sl-sidebar-group label="Documents">
          <sl-sidebar-item href="#">Job Document</sl-sidebar-item>
        </sl-sidebar-group>
      </sl-sidebar>
    `);
    const item = el.querySelector<SlSidebarItem>('sl-sidebar-item')!;
    const toggle = el.shadowRoot!.querySelector<HTMLElement & { label: string }>('[part~="toggle"]')!;

    setTimeout(() => toggle.click());
    await oneEvent(el, 'sl-collapse');
    await el.updateComplete;

    expect(el.collapsed).to.be.true;
    expect(item.collapsed).to.be.true;
    expect(toggle.label).to.equal('Expand sidebar');
  });
});
