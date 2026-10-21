import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlSidebarItem from './sidebar-item.js';

describe('<sl-sidebar-item>', () => {
  it('should render a link with the current page and count', async () => {
    const el = await fixture<SlSidebarItem>(html`
      <sl-sidebar-item href="#" count="6" current>Job Document</sl-sidebar-item>
    `);

    await expect(el).to.be.accessible();

    const link = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[part~="base"]');
    expect(link).attribute('href', '#');
    expect(link).attribute('aria-current', 'page');
    expect(el.shadowRoot!.querySelector('[part~="count"]')!.textContent!.trim()).to.equal('6');
  });
});
