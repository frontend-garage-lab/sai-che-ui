import '../../../dist/shoelace.js';
import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import type SlNotificationPanel from './notification-panel.js';

describe('<sl-notification-panel>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item date="2026-11-23T09:00:00Z">Document approved</sl-notification-item>
      </sl-notification-panel>
    `);
    await expect(el).to.be.accessible();
  });

  it('should count the items and describe the count in the trigger label', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item>One</sl-notification-item>
        <sl-notification-item>Two</sl-notification-item>
      </sl-notification-panel>
    `);
    const trigger = el.shadowRoot!.querySelector('[part~="trigger"]')!;
    const badge = el.shadowRoot!.querySelector('[part~="badge"]')!;
    expect(badge.textContent!.trim()).to.equal('2');
    expect(trigger.getAttribute('aria-label')).to.equal('Notifications, 2 unread');
  });

  it('should cap the badge at max', async () => {
    const el = await fixture<SlNotificationPanel>(html`<sl-notification-panel count="120"></sl-notification-panel>`);
    expect(el.shadowRoot!.querySelector('[part~="badge"]')!.textContent!.trim()).to.equal('99+');
  });

  it('should hide the badge when there are no notifications', async () => {
    const el = await fixture<SlNotificationPanel>(html`<sl-notification-panel></sl-notification-panel>`);
    expect(el.shadowRoot!.querySelector('[part~="badge"]')).to.be.null;
  });

  it('should count only the unread items', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item>One</sl-notification-item>
        <sl-notification-item read>Two</sl-notification-item>
      </sl-notification-panel>
    `);
    expect(el.shadowRoot!.querySelector('[part~="badge"]')!.textContent!.trim()).to.equal('1');
  });

  it('should keep an item marked as read and update the count', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item>One</sl-notification-item>
        <sl-notification-item>Two</sl-notification-item>
      </sl-notification-panel>
    `);
    const item = el.querySelector('sl-notification-item')!;
    expect(item.markAsRead()).to.be.true;
    expect(item.markAsRead()).to.be.false;
    await aTimeout(0);
    await el.updateComplete;
    await item.updateComplete;
    expect(el.querySelectorAll('sl-notification-item').length).to.equal(2);
    expect(item.shadowRoot!.querySelector('[part~="new"]')).to.be.null;
    expect(el.shadowRoot!.querySelector('[part~="badge"]')!.textContent!.trim()).to.equal('1');
  });

  it('should emit sl-notification-action and mark the item as read when an action is clicked', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item>One<button slot="actions">Download</button></sl-notification-item>
      </sl-notification-panel>
    `);
    const item = el.querySelector('sl-notification-item')!;
    let acted = false;
    el.addEventListener('sl-notification-action', () => (acted = true));
    item.querySelector('button')!.click();
    expect(acted).to.be.true;
    expect(item.read).to.be.true;
  });

  it('should mark the items as read when the panel closes', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel><sl-notification-item>One</sl-notification-item></sl-notification-panel>
    `);
    const item = el.querySelector('sl-notification-item')!;
    await el.show();
    expect(item.read).to.be.false;
    await el.hide();
    expect(item.read).to.be.true;
  });

  it('should mark all as read', async () => {
    const el = await fixture<SlNotificationPanel>(html`
      <sl-notification-panel>
        <sl-notification-item>One</sl-notification-item>
        <sl-notification-item>Two</sl-notification-item>
      </sl-notification-panel>
    `);
    el.markAllAsRead();
    await aTimeout(0);
    await el.updateComplete;
    expect([...el.querySelectorAll('sl-notification-item')].every(item => item.read)).to.be.true;
    expect(el.shadowRoot!.querySelector('[part~="badge"]')).to.be.null;
  });
});
