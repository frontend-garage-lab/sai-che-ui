import '../../../dist/shoelace.js';
import { clickOnElement } from '../../internal/test.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import type SlStep from '../step/step.js';
import type SlStepper from './stepper.js';

const stepper = () => html`
  <sl-stepper label="Create outgoing correspondence" current="1">
    <sl-step>General information</sl-step>
    <sl-step>Attachments</sl-step>
    <sl-step>Relations</sl-step>
  </sl-stepper>
`;

describe('<sl-stepper>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlStepper>(stepper());

    await expect(el).to.be.accessible();
  });

  it('should mark steps before, at and after the current step', async () => {
    const el = await fixture<SlStepper>(stepper());
    const steps = [...el.querySelectorAll<SlStep>('sl-step')];
    await Promise.all(steps.map(step => step.updateComplete));

    expect(steps.map(step => step.state)).to.deep.equal(['complete', 'current', 'upcoming']);
    expect(steps[1].getAttribute('aria-current')).to.equal('step');
    expect(steps[0].hasAttribute('aria-current')).to.be.false;
    expect(steps[2].last).to.be.true;
  });

  it('should go back when a completed step is clicked', async () => {
    const el = await fixture<SlStepper>(stepper());
    const first = el.querySelector<SlStep>('sl-step')!;
    await first.updateComplete;

    const listener = oneEvent(el, 'sl-step-change');
    await clickOnElement(first.shadowRoot!.querySelector('button')!);
    const event = await listener;

    expect(el.current).to.equal(0);
    expect(event.detail).to.deep.equal({ index: 0, previousIndex: 1 });
  });

  it('should not render completed steps as buttons when linear', async () => {
    const el = await fixture<SlStepper>(html`
      <sl-stepper current="1" linear>
        <sl-step>General information</sl-step>
        <sl-step>Attachments</sl-step>
      </sl-stepper>
    `);
    const first = el.querySelector<SlStep>('sl-step')!;
    await first.updateComplete;

    expect(first.shadowRoot!.querySelector('button')).to.be.null;
  });

  it('should move with next() and previous() and stop at the ends', async () => {
    const el = await fixture<SlStepper>(stepper());
    const handler = sinon.spy();
    el.addEventListener('sl-step-change', handler);

    el.next();
    el.next();
    el.next();
    expect(el.current).to.equal(3);

    el.previous();
    expect(el.current).to.equal(2);
    expect(handler).to.have.been.calledThrice;
  });

  it('should not emit when current is set directly', async () => {
    const el = await fixture<SlStepper>(stepper());
    const handler = sinon.spy();
    el.addEventListener('sl-step-change', handler);

    el.current = 2;
    await el.updateComplete;

    expect(handler).not.to.have.been.called;
    expect(el.querySelectorAll<SlStep>('sl-step')[2].state).to.equal('current');
  });
});
