import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlLegendItem from './legend-item.js';

describe('<sl-legend-item>', () => {
  it('should be a list item', async () => {
    const el = await fixture<SlLegendItem>(html` <sl-legend-item>Ongoing</sl-legend-item> `);

    expect(el.getAttribute('role')).to.equal('listitem');
  });

  it('should render the term in bold followed by a colon when set', async () => {
    const el = await fixture<SlLegendItem>(html` <sl-legend-item term="Open">draft</sl-legend-item> `);

    const term = el.shadowRoot!.querySelector('[part~="term"]')!;
    expect(term.textContent).to.equal('Open:');
  });

  it('should hide the marker when there is no marker slot and no variant', async () => {
    const el = await fixture<SlLegendItem>(html` <sl-legend-item>Ongoing</sl-legend-item> `);

    const marker = el.shadowRoot!.querySelector('[part~="marker"]')!;
    expect(marker.classList.contains('legend-item__marker--hidden')).to.be.true;
  });

  it('should show a colour swatch for a variant without a marker slot', async () => {
    const el = await fixture<SlLegendItem>(html` <sl-legend-item variant="success">Completed</sl-legend-item> `);

    expect(el.shadowRoot!.querySelector('.legend-item__swatch--success')).to.exist;
  });

  it('should prefer the marker slot over the variant swatch', async () => {
    const el = await fixture<SlLegendItem>(html`
      <sl-legend-item variant="success"><sl-badge slot="marker">C</sl-badge>Completed</sl-legend-item>
    `);

    expect(el.shadowRoot!.querySelector('.legend-item__swatch')).to.not.exist;
  });
});
