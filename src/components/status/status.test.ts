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
});
