import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlAppHeader from './app-header.js';

describe('<sl-app-header>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlAppHeader>(html`
      <sl-app-header>
        <span slot="logo">xCMM</span>
        <a href="#" aria-current="page">Home</a>
        <a href="#">Incoming</a>
        <sl-icon-button slot="actions" name="gear" label="Settings"></sl-icon-button>
      </sl-app-header>
    `);

    await expect(el).to.be.accessible();
  });

  it('should hide the nav landmark when there are no links', async () => {
    const el = await fixture<SlAppHeader>(html` <sl-app-header><span slot="logo">xCMM</span></sl-app-header> `);

    expect(el.shadowRoot!.querySelector('nav')!.hidden).to.be.true;
  });

  it('should label the nav landmark', async () => {
    const el = await fixture<SlAppHeader>(html`
      <sl-app-header nav-label="Principale"><a href="#">Home</a></sl-app-header>
    `);

    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).to.equal('Principale');
  });
});
