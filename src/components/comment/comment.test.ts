import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlComment from './comment.js';

describe('<sl-comment>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlComment>(html`
      <sl-comment author="Aiello Ciro" date="02-Oct-2026">
        <sl-avatar slot="avatar" initials="AC"></sl-avatar>
        Submitted for Lead reviewer
      </sl-comment>
    `);

    await expect(el).to.be.accessible();
  });

  it('should render the author and date', async () => {
    const el = await fixture<SlComment>(html` <sl-comment author="Aiello Ciro" date="02-Oct-2026"></sl-comment> `);

    expect(el.shadowRoot!.querySelector('[part~="author"]')!.textContent).to.contain('Aiello Ciro');
    expect(el.shadowRoot!.querySelector('[part~="date"]')!.textContent).to.contain('02-Oct-2026');
  });

  it('should not render the date container when no date is set', async () => {
    const el = await fixture<SlComment>(html` <sl-comment author="Aiello Ciro"></sl-comment> `);

    expect(el.shadowRoot!.querySelector('[part~="date"]')).to.be.null;
  });

  it('should not render the attachment container by default', async () => {
    const el = await fixture<SlComment>(html` <sl-comment author="Aiello Ciro"></sl-comment> `);

    expect(el.shadowRoot!.querySelector('[part~="attachment"]')).to.be.null;
  });

  it('should render the attachment container when the attachment slot has content', async () => {
    const el = await fixture<SlComment>(html`
      <sl-comment author="Aiello Ciro">
        <sl-icon-button slot="attachment" name="file-earmark-pdf" label="Open attachment"></sl-icon-button>
      </sl-comment>
    `);

    expect(el.shadowRoot!.querySelector('[part~="attachment"]')).not.to.be.null;
  });
});
