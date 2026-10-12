import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlDescriptionList from './description-list.js';

describe('<sl-description-list>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlDescriptionList>(html`
      <sl-description-list>
        <sl-description-list-item label="Revision Code">A1</sl-description-list-item>
        <sl-description-list-item label="Discipline">—</sl-description-list-item>
      </sl-description-list>
    `);

    await expect(el).to.be.accessible();
  });

  it('should default to 2 columns', async () => {
    const el = await fixture<SlDescriptionList>(html` <sl-description-list></sl-description-list> `);

    expect(el.cols).to.equal(2);
  });

  it('should set the --cols custom property from the cols attribute', async () => {
    const el = await fixture<SlDescriptionList>(html` <sl-description-list cols="3"></sl-description-list> `);

    const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
    expect(base.style.getPropertyValue('--cols')).to.equal('3');
  });
});
