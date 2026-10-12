import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlDescriptionListItem from './description-list-item.js';

describe('<sl-description-list-item>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlDescriptionListItem>(html`
      <sl-description-list-item label="Revision Code">A1</sl-description-list-item>
    `);

    await expect(el).to.be.accessible();
  });

  it('should render the label and value', async () => {
    const el = await fixture<SlDescriptionListItem>(html`
      <sl-description-list-item label="Revision Code">A1</sl-description-list-item>
    `);

    expect(el.shadowRoot!.querySelector('[part~="label"]')!.textContent).to.contain('Revision Code');
    expect(el.shadowRoot!.querySelector('[part~="value"]')!.textContent).to.contain('A1');
  });
});
