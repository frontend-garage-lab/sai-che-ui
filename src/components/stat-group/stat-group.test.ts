import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import type SlStat from '../stat/stat.js';
import type SlStatGroup from './stat-group.js';

const group = (attrs = { required: false }) => html`
  <sl-stat-group label="Filter by status" ?required=${attrs.required}>
    <sl-stat value="working" count="8" variant="neutral">Working</sl-stat>
    <sl-stat value="signed" count="1" variant="primary">Signed</sl-stat>
    <sl-stat value="distributed" count="8" variant="success" disabled>Distributed</sl-stat>
  </sl-stat-group>
`;

async function clickStat(stat: SlStat) {
  await stat.updateComplete;
  stat.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
}

describe('<sl-stat-group>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlStatGroup>(group());

    await expect(el).to.be.accessible();
  });

  it('should select a stat on click and clear it on a second click', async () => {
    const el = await fixture<SlStatGroup>(group());
    const [working] = el.getStats();
    const handler = sinon.spy();
    el.addEventListener('sl-change', handler);

    await clickStat(working);
    expect(el.value).to.equal('working');
    expect(working.selected).to.be.true;

    await clickStat(working);
    expect(el.value).to.equal('');
    expect(working.selected).to.be.false;
    expect(handler).to.have.been.calledTwice;
  });

  it('should keep the selection when required', async () => {
    const el = await fixture<SlStatGroup>(group({ required: true }));
    const [working] = el.getStats();

    await clickStat(working);
    await clickStat(working);

    expect(el.value).to.equal('working');
  });

  it('should expose aria-pressed on each stat', async () => {
    const el = await fixture<SlStatGroup>(html`
      <sl-stat-group value="signed">
        <sl-stat value="working" count="8">Working</sl-stat>
        <sl-stat value="signed" count="1">Signed</sl-stat>
      </sl-stat-group>
    `);
    const [working, signed] = el.getStats();
    await Promise.all([working.updateComplete, signed.updateComplete]);

    expect(signed.shadowRoot!.querySelector('button')!.getAttribute('aria-pressed')).to.equal('true');
    expect(working.shadowRoot!.querySelector('button')!.getAttribute('aria-pressed')).to.equal('false');
  });
});
