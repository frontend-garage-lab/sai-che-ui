import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlHeader from './header.js';

describe('<sl-header>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlHeader>(html`
      <sl-header>
        <span slot="logo">xCMM</span>
        <a href="#" aria-current="page">Home</a>
        <a href="#">Incoming</a>
        <sl-icon-button slot="actions" name="gear" label="Settings"></sl-icon-button>
      </sl-header>
    `);

    await expect(el).to.be.accessible();
  });

  it('should hide the nav landmark when there are no links', async () => {
    const el = await fixture<SlHeader>(html` <sl-header><span slot="logo">xCMM</span></sl-header> `);

    expect(el.shadowRoot!.querySelector('nav')!.hidden).to.be.true;
  });

  it('should label the nav landmark', async () => {
    const el = await fixture<SlHeader>(html`
      <sl-header nav-label="Principale"><a href="#">Home</a></sl-header>
    `);

    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).to.equal('Principale');
  });

  it('should fall back to an image when logo-src is set and the logo slot is empty', async () => {
    const el = await fixture<SlHeader>(html`
      <sl-header logo-src="/logo.svg" logo-label="Acme"><a href="#">Home</a></sl-header>
    `);

    const img = el.shadowRoot!.querySelector('.header__logo-image') as HTMLImageElement;
    expect(img).to.exist;
    expect(img.getAttribute('src')).to.equal('/logo.svg');
    expect(img.getAttribute('alt')).to.equal('Acme');
  });

  it('should ignore logo-src when the logo slot has content', async () => {
    const el = await fixture<SlHeader>(html`
      <sl-header logo-src="/logo.svg"><span slot="logo">Acme</span><a href="#">Home</a></sl-header>
    `);

    expect(el.shadowRoot!.querySelector('.header__logo-image')).to.be.null;
  });
});
