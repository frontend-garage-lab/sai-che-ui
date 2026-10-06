import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import type SlDetailPanel from './detail-panel.js';

describe('<sl-detail-panel>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlDetailPanel>(html`
      <sl-detail-panel>
        <span slot="label">Statement of Work.pdf</span>
        <span slot="meta">Revision 4</span>
        Panel content
      </sl-detail-panel>
    `);

    await expect(el).to.be.accessible();
  });

  it('should render the label and meta slots', async () => {
    const el = await fixture<SlDetailPanel>(html`
      <sl-detail-panel>
        <span slot="label">Statement of Work.pdf</span>
        <span slot="meta">Revision 4</span>
      </sl-detail-panel>
    `);

    expect(el.shadowRoot!.querySelector('[part~="title"] slot[name="label"]')).not.to.be.null;
    expect(el.shadowRoot!.querySelector('[part~="meta"] slot[name="meta"]')).not.to.be.null;
  });

  it('should emit sl-request-close when the close button is clicked', async () => {
    const el = await fixture<SlDetailPanel>(html` <sl-detail-panel></sl-detail-panel> `);
    const requestCloseSpy = sinon.spy();
    el.addEventListener('sl-request-close', requestCloseSpy);

    el.shadowRoot!.querySelector('sl-icon-button')!.click();
    await el.updateComplete;

    expect(requestCloseSpy).to.have.been.calledOnce;
  });

  it('should hide itself when the close request is not prevented', async () => {
    const el = await fixture<SlDetailPanel>(html` <sl-detail-panel></sl-detail-panel> `);

    el.shadowRoot!.querySelector('sl-icon-button')!.click();
    await el.updateComplete;

    expect(el.hidden).to.be.true;
  });

  it('should stay visible when the close request is prevented', async () => {
    const el = await fixture<SlDetailPanel>(html` <sl-detail-panel></sl-detail-panel> `);
    el.addEventListener('sl-request-close', event => event.preventDefault());

    el.shadowRoot!.querySelector('sl-icon-button')!.click();
    await el.updateComplete;

    expect(el.hidden).to.be.false;
  });
});
