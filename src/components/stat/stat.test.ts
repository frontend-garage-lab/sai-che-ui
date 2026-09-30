import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlStat from './stat.js';

describe('<sl-stat>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlStat>(html` <sl-stat count="8" variant="neutral">Working</sl-stat> `);

    await expect(el).to.be.accessible();
  });

  it('should format the count', async () => {
    const el = await fixture<SlStat>(html` <sl-stat count="1234" lang="en">Distributed</sl-stat> `);

    expect(el.shadowRoot!.querySelector('[part~="count"]')!.textContent).to.equal('1,234');
  });

  it('should render a div rather than a button outside a stat group', async () => {
    const el = await fixture<SlStat>(html` <sl-stat count="1">Signed</sl-stat> `);

    expect(el.shadowRoot!.querySelector('button')).to.be.null;
  });
});
