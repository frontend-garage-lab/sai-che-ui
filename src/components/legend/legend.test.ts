import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlLegend from './legend.js';

describe('<sl-legend>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlLegend>(html`
      <sl-legend label="Bid status">
        <sl-legend-item><sl-badge slot="marker" variant="warning">O</sl-badge>Ongoing</sl-legend-item>
        <sl-legend-item term="Open">draft, in progress or rejected</sl-legend-item>
      </sl-legend>
    `);

    await expect(el).to.be.accessible();
  });

  it('should default to the inline layout with one column', async () => {
    const el = await fixture<SlLegend>(html` <sl-legend></sl-legend> `);

    expect(el.layout).to.equal('inline');
    expect(el.columns).to.equal(1);
  });

  it('should expose the items as a list and set the --columns custom property', async () => {
    const el = await fixture<SlLegend>(html` <sl-legend layout="list" columns="2"></sl-legend> `);

    const items = el.shadowRoot!.querySelector<HTMLElement>('[part~="items"]')!;
    expect(items.getAttribute('role')).to.equal('list');
    expect(items.style.getPropertyValue('--columns')).to.equal('2');
  });

  it('should render the icon and the title only when set', async () => {
    const plain = await fixture<SlLegend>(html` <sl-legend></sl-legend> `);
    expect(plain.shadowRoot!.querySelector('[part~="icon"]')).to.not.exist;
    expect(plain.shadowRoot!.querySelector('[part~="label"]')).to.not.exist;

    const note = await fixture<SlLegend>(html`
      <sl-legend><sl-icon slot="icon" name="info-circle"></sl-icon></sl-legend>
    `);
    expect(note.shadowRoot!.querySelector('[part~="icon"]')).to.exist;
  });
});
