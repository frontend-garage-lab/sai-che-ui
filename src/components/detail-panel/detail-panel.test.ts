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

  it('should reflect the contained attribute and draw a full outline', async () => {
    const el = await fixture<SlDetailPanel>(html`<sl-detail-panel contained>Panel content</sl-detail-panel>`);
    const style = getComputedStyle(el);

    expect(el.contained).to.be.true;
    expect(style.borderTopWidth).to.equal(style.borderInlineStartWidth);
    expect(style.borderTopLeftRadius).not.to.equal('0px');
  });

  it('should only draw the start border by default', async () => {
    const el = await fixture<SlDetailPanel>(html`<sl-detail-panel>Panel content</sl-detail-panel>`);

    expect(el.contained).to.be.false;
    expect(getComputedStyle(el).borderTopWidth).to.equal('0px');
    expect(getComputedStyle(el).borderTopLeftRadius).to.equal('0px');
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

  it('should render icon buttons slotted into actions before the close button', async () => {
    const el = await fixture<SlDetailPanel>(html`
      <sl-detail-panel>
        <sl-icon-button slot="actions" name="pencil" label="Edit"></sl-icon-button>
      </sl-detail-panel>
    `);

    const actionsSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('[part~="actions"] slot[name="actions"]')!;
    const assigned = actionsSlot.assignedElements();

    expect(assigned).to.have.length(1);
    expect(assigned[0]).to.have.attribute('name', 'pencil');
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
