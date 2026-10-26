import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlStatus from './status.js';

describe('<sl-status>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-status>Working</sl-status> `);

    expect(el).to.exist;
  });

  it('should be accessible', async () => {
    const el = await fixture<SlStatus>(html` <sl-status variant="success">Distributed</sl-status> `);

    await expect(el).to.be.accessible();
  });

  it('should default to the neutral variant and medium size', async () => {
    const el = await fixture<SlStatus>(html` <sl-status>Working</sl-status> `);
    const base = el.shadowRoot!.querySelector('[part~="base"]')!;

    expect(el.variant).to.equal('neutral');
    expect(base.classList.contains('status--neutral')).to.be.true;
    expect(base.classList.contains('status--medium')).to.be.true;
  });

  it('should apply the variant, size and pulse classes', async () => {
    const el = await fixture<SlStatus>(html` <sl-status variant="danger" size="small" pulse>Overdue</sl-status> `);
    const base = el.shadowRoot!.querySelector('[part~="base"]')!;

    expect(base.classList.contains('status--danger')).to.be.true;
    expect(base.classList.contains('status--small')).to.be.true;
    expect(base.classList.contains('status--pulse')).to.be.true;
  });

  it('should apply the filled class only when filled is set', async () => {
    const el = await fixture<SlStatus>(html` <sl-status variant="success">Completed</sl-status> `);
    const base = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(base.classList.contains('status--filled')).to.be.false;

    el.filled = true;
    await el.updateComplete;
    expect(el.hasAttribute('filled')).to.be.true;
    expect(base.classList.contains('status--filled')).to.be.true;
  });

  it('should not inherit --indicator-color from its container', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="--indicator-color: rgb(0, 0, 255);"><sl-status variant="danger">Expired</sl-status></div>
    `);
    const el = wrapper.querySelector<SlStatus>('sl-status')!;
    await el.updateComplete;
    const dot = el.shadowRoot!.querySelector('[part~="indicator"]')!;
    expect(getComputedStyle(dot).backgroundColor).not.to.equal('rgb(0, 0, 255)');
  });
});
