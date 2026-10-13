import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlHeaderItem from './header-item.js';

describe('<sl-header-item>', () => {
  it('should render a link when href is set', async () => {
    const el = await fixture<SlHeaderItem>(html` <sl-header-item href="#" current>Dashboard</sl-header-item> `);

    await expect(el).to.be.accessible();

    const link = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[part~="base"]');
    expect(link).attribute('href', '#');
    expect(link).attribute('aria-current', 'page');
  });

  it('should render a dropdown trigger when a menu slot is provided', async () => {
    const el = await fixture<SlHeaderItem>(html`
      <sl-header-item>
        Project Data
        <sl-menu slot="menu">
          <sl-menu-item>Documents</sl-menu-item>
          <sl-menu-item>Reports</sl-menu-item>
        </sl-menu>
      </sl-header-item>
    `);

    await expect(el).to.be.accessible();

    expect(el.shadowRoot!.querySelector('a')).to.be.null;
    expect(el.shadowRoot!.querySelector('sl-dropdown')).not.to.be.null;

    const button = el.shadowRoot!.querySelector<HTMLButtonElement>('button[part~="base"]');
    expect(button).to.exist;
    expect(button).attribute('type', 'button');
  });
});
