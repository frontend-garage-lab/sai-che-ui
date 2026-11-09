import '../../../dist/shoelace.js';
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import type SlCopyButton from './copy-button.js';

// We use aria-live to announce labels via tooltips
const ignoredRules = ['button-name'];

const nextFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

describe('<sl-copy-button>', () => {
  let el: SlCopyButton;

  describe('when provided no parameters', () => {
    before(async () => {
      el = await fixture(html`<sl-copy-button value="something"></sl-copy-button> `);
    });

    it('should pass accessibility tests', async () => {
      await expect(el).to.be.accessible({ ignoredRules });
    });
  });

  describe('deferred tooltip', () => {
    it('does not create the tooltip or the popup while at rest', async () => {
      const el = await fixture<SlCopyButton>(html`<sl-copy-button value="x"></sl-copy-button>`);
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('sl-tooltip')).to.equal(null);
      expect(el.shadowRoot!.querySelector('.copy-button__button')).to.not.equal(null);
      expect(el.shadowRoot!.querySelectorAll('slot').length).to.equal(3);
    });

    it('creates and opens the tooltip on first hover', async () => {
      const el = await fixture<SlCopyButton>(html`<sl-copy-button value="x"></sl-copy-button>`);
      await el.updateComplete;

      el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: false }));
      await waitUntil(() => el.shadowRoot!.querySelector('sl-tooltip') !== null, 'the tooltip was not created');
      await nextFrames();

      const tooltip = el.shadowRoot!.querySelector('sl-tooltip')!;
      expect(tooltip.getAttribute('exportparts')).to.contain('base:tooltip__base');
      expect(el.shadowRoot!.querySelector('.copy-button__button')).to.not.equal(null);
    });

    it('creates and opens the tooltip on first focus, keeping focus on the button', async () => {
      const el = await fixture<SlCopyButton>(html`<sl-copy-button value="x"></sl-copy-button>`);
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!;
      button.focus();
      await waitUntil(() => el.shadowRoot!.querySelector('sl-tooltip') !== null, 'the tooltip was not created');
      await nextFrames();

      const after = el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!;
      expect(el.shadowRoot!.activeElement, 'focus was lost when the button was re-created').to.equal(after);

      const tooltip = el.shadowRoot!.querySelector('sl-tooltip')!;
      expect(tooltip.hasAttribute('open'), 'the tooltip did not open on first focus').to.equal(true);
    });

    it('creates the tooltip only once', async () => {
      const el = await fixture<SlCopyButton>(html`<sl-copy-button value="x"></sl-copy-button>`);
      await el.updateComplete;

      el.dispatchEvent(new PointerEvent('pointerenter'));
      await waitUntil(() => el.shadowRoot!.querySelector('sl-tooltip') !== null);
      const first = el.shadowRoot!.querySelector('sl-tooltip');
      el.dispatchEvent(new PointerEvent('pointerenter'));
      el.dispatchEvent(new Event('focusin'));
      await nextFrames();
      expect(el.shadowRoot!.querySelector('sl-tooltip')).to.equal(first);
    });

    // The clipboard can be denied in the test environment. What matters here is not whether the copy succeeds but
    // that the feedback cycle (status -> animation -> back to rest) still works without an eagerly created tooltip,
    // so we wait for whichever of sl-copy and sl-error fires first.
    const copyOutcome = (el: SlCopyButton) =>
      new Promise<string>(resolve => {
        el.addEventListener('sl-copy', () => resolve('sl-copy'), { once: true });
        el.addEventListener('sl-error', () => resolve('sl-error'), { once: true });
      });

    it('still runs the copy feedback cycle after the tooltip exists', async () => {
      const el = await fixture<SlCopyButton>(
        html`<sl-copy-button value="testo" feedback-duration="50"></sl-copy-button>`
      );
      await el.updateComplete;
      el.dispatchEvent(new PointerEvent('pointerenter'));
      await waitUntil(() => el.shadowRoot!.querySelector('sl-tooltip') !== null);

      const outcome = copyOutcome(el);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!.click();
      await outcome;

      await waitUntil(() => el.status !== 'rest', 'the status never changed', { timeout: 2000 });
      const button = el.shadowRoot!.querySelector('.copy-button__button')!;
      const expectedClass = `copy-button__button--${el.status}`;
      expect(button.classList.contains(expectedClass), `missing the ${expectedClass} class`).to.equal(true);

      await waitUntil(() => el.status === 'rest', 'the status never returned to rest', { timeout: 4000 });
      expect(
        el.shadowRoot!.querySelector('.copy-button__button')!.className.includes('--success') ||
          el.shadowRoot!.querySelector('.copy-button__button')!.className.includes('--error')
      ).to.equal(false);
    });

    it('copies without a prior interaction without throwing or breaking the component', async () => {
      const el = await fixture<SlCopyButton>(
        html`<sl-copy-button value="testo" feedback-duration="50"></sl-copy-button>`
      );
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('sl-tooltip')).to.equal(null);

      const outcome = copyOutcome(el);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!.click();
      await outcome;
      await waitUntil(() => el.status === 'rest', 'the status never returned to rest', { timeout: 4000 });

      expect(el.shadowRoot!.querySelector('.copy-button__button')).to.not.equal(null);
      expect(el.shadowRoot!.querySelectorAll('slot').length).to.equal(3);
    });

    it('defers a tooltip requested mid-feedback until the component is back at rest', async () => {
      const el = await fixture<SlCopyButton>(
        html`<sl-copy-button value="testo" feedback-duration="50"></sl-copy-button>`
      );
      await el.updateComplete;

      const outcome = copyOutcome(el);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!.click();
      await outcome;
      await waitUntil(() => el.status !== 'rest', undefined, { timeout: 2000 });

      // Requested mid-animation: the DOM must not be re-created right now
      el.dispatchEvent(new PointerEvent('pointerenter'));
      expect(
        el.shadowRoot!.querySelector('sl-tooltip'),
        'the tooltip was created while the animation was running'
      ).to.equal(null);

      await waitUntil(
        () => el.shadowRoot!.querySelector('sl-tooltip') !== null,
        'the tooltip was not created once back at rest',
        {
          timeout: 4000
        }
      );
    });
  });

  describe('deferred feedback icons', () => {
    const copyOutcome = (el: SlCopyButton) =>
      new Promise<string>(resolve => {
        el.addEventListener('sl-copy', () => resolve('sl-copy'), { once: true });
        el.addEventListener('sl-error', () => resolve('sl-error'), { once: true });
      });

    it('does not render the success and error icons while at rest', async () => {
      const el = await fixture<SlCopyButton>(html`<sl-copy-button value="x"></sl-copy-button>`);
      await el.updateComplete;

      const successSlot = el.shadowRoot!.querySelector('slot[name="success-icon"]')!;
      const errorSlot = el.shadowRoot!.querySelector('slot[name="error-icon"]')!;

      // The slots themselves must stay, so ::part() targets and the imperative `hidden` handling keep working.
      expect(successSlot.getAttribute('part')).to.equal('success-icon');
      expect(errorSlot.getAttribute('part')).to.equal('error-icon');
      expect(successSlot.hasAttribute('hidden')).to.equal(true);
      expect(errorSlot.hasAttribute('hidden')).to.equal(true);

      expect(successSlot.querySelector('sl-icon'), 'the success icon was rendered too early').to.equal(null);
      expect(errorSlot.querySelector('sl-icon'), 'the error icon was rendered too early').to.equal(null);
      expect(el.shadowRoot!.querySelector('slot[name="copy-icon"]')!.querySelector('sl-icon')).to.not.equal(null);
    });

    it('renders the feedback icons on the first copy and completes the cycle', async () => {
      const el = await fixture<SlCopyButton>(
        html`<sl-copy-button value="testo" feedback-duration="50"></sl-copy-button>`
      );
      await el.updateComplete;

      const outcome = copyOutcome(el);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button__button')!.click();
      await outcome;
      await waitUntil(() => el.status !== 'rest', 'the status never changed', { timeout: 2000 });

      const shownSlot = el.shadowRoot!.querySelector(`slot[name="${el.status}-icon"]`)!;
      expect(shownSlot.querySelector('sl-icon'), 'the feedback icon was never rendered').to.not.equal(null);
      expect(shownSlot.hasAttribute('hidden'), 'the feedback icon stayed hidden').to.equal(false);

      await waitUntil(() => el.status === 'rest', 'the status never returned to rest', { timeout: 4000 });
      expect(el.shadowRoot!.querySelector('slot[name="copy-icon"]')!.hasAttribute('hidden')).to.equal(false);
    });
  });
});
