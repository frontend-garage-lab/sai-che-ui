import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlEmptyState from './empty-state.js';

describe('<sl-empty-state>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlEmptyState>(html`
      <sl-empty-state title-text="No comments yet" description="Be the first to leave a comment.">
        <sl-icon slot="icon" name="chat"></sl-icon>
        <sl-button slot="action">+ Add comment</sl-button>
      </sl-empty-state>
    `);

    await expect(el).to.be.accessible();
  });

  it('should render the title text', async () => {
    const el = await fixture<SlEmptyState>(html` <sl-empty-state title-text="No comments yet"></sl-empty-state> `);

    expect(el.shadowRoot!.querySelector('[part~="title"]')!.textContent).to.equal('No comments yet');
  });

  it('should render the description text', async () => {
    const el = await fixture<SlEmptyState>(html`
      <sl-empty-state description="Be the first to leave a comment."></sl-empty-state>
    `);

    expect(el.shadowRoot!.querySelector('[part~="description"]')!.textContent).to.equal(
      'Be the first to leave a comment.'
    );
  });

  it('should render icon slot content inside the icon badge', async () => {
    const el = await fixture<SlEmptyState>(html`
      <sl-empty-state><sl-icon slot="icon" name="chat"></sl-icon></sl-empty-state>
    `);

    const icon = el.shadowRoot!.querySelector('[part~="icon"]')!;
    expect(icon.querySelector('slot[name="icon"]')).not.to.be.null;
  });

  it('should render action slot content', async () => {
    const el = await fixture<SlEmptyState>(html`
      <sl-empty-state><sl-button slot="action">+ Add comment</sl-button></sl-empty-state>
    `);

    const action = el.shadowRoot!.querySelector('[part~="action"]')!;
    expect(action.querySelector('slot[name="action"]')).not.to.be.null;
  });
});
