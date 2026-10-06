import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import type SlSelectableItem from './selectable-item.js';

describe('<sl-selectable-item>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlSelectableItem>(html`
      <sl-selectable-item value="doc-1">
        Statement of Work.pdf
        <span slot="meta">Oct 3, 2026</span>
      </sl-selectable-item>
    `);

    await expect(el).to.be.accessible();
  });

  it('should default to unchecked', async () => {
    const el = await fixture<SlSelectableItem>(html` <sl-selectable-item>Doc</sl-selectable-item> `);

    expect(el.checked).to.be.false;
  });

  it('should toggle checked and emit sl-change when the checkbox changes', async () => {
    const el = await fixture<SlSelectableItem>(html` <sl-selectable-item>Doc</sl-selectable-item> `);
    const checkbox = el.shadowRoot!.querySelector('sl-checkbox')!;
    const changeSpy = sinon.spy();
    el.addEventListener('sl-change', changeSpy);

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('sl-change'));

    expect(el.checked).to.be.true;
    expect(changeSpy).to.have.been.calledOnce;
  });

  it('should reflect disabled to the inner checkbox', async () => {
    const el = await fixture<SlSelectableItem>(html` <sl-selectable-item disabled>Doc</sl-selectable-item> `);
    const checkbox = el.shadowRoot!.querySelector('sl-checkbox')!;

    expect(checkbox.disabled).to.be.true;
  });

  it('should not toggle when disabled and the row is clicked', async () => {
    const el = await fixture<SlSelectableItem>(html` <sl-selectable-item disabled>Doc</sl-selectable-item> `);

    el.shadowRoot!.querySelector('[part~="base"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(el.checked).to.be.false;
  });

  it('should render the meta slot', async () => {
    const el = await fixture<SlSelectableItem>(html`
      <sl-selectable-item>Doc<span slot="meta">Oct 3, 2026</span></sl-selectable-item>
    `);

    const meta = el.shadowRoot!.querySelector('[part~="meta"]')!;
    expect(meta.querySelector('slot[name="meta"]')).not.to.be.null;
  });
});
