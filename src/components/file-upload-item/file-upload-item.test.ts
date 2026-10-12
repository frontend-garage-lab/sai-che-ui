import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import type SlFileUploadItem from './file-upload-item.js';

describe('<sl-file-upload-item>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item state="uploaded" filename="report.pdf" meta="2.4 MB · Uploaded"></sl-file-upload-item>
    `);

    await expect(el).to.be.accessible();
  });

  it('should render the filename and meta text', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item filename="report.pdf" meta="2.4 MB · Uploaded"></sl-file-upload-item>
    `);

    expect(el.shadowRoot!.querySelector('[part~="filename"]')!.textContent).to.contain('report.pdf');
    expect(el.shadowRoot!.querySelector('[part~="meta"]')!.textContent).to.contain('2.4 MB · Uploaded');
  });

  it('should default to the waiting state', async () => {
    const el = await fixture<SlFileUploadItem>(html` <sl-file-upload-item filename="report.pdf"></sl-file-upload-item> `);

    expect(el.state).to.equal('waiting');
    expect(el.getAttribute('state')).to.equal('waiting');
  });

  it('should show a progress bar only when uploading', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item state="uploading" filename="report.pdf" progress="45"></sl-file-upload-item>
    `);

    expect(el.shadowRoot!.querySelector('sl-progress-bar')).not.to.be.null;

    el.state = 'uploaded';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('sl-progress-bar')).to.be.null;
  });

  it('should show a retry button only when failed', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item state="failed" filename="report.pdf"></sl-file-upload-item>
    `);

    expect(el.shadowRoot!.querySelector('[part~="retry-button"]')).not.to.be.null;

    el.state = 'uploaded';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('[part~="retry-button"]')).to.be.null;
  });

  it('should emit sl-retry when the retry button is clicked', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item state="failed" filename="report.pdf"></sl-file-upload-item>
    `);
    const handleRetry = sinon.spy();
    el.addEventListener('sl-retry', handleRetry);

    el.shadowRoot!.querySelector<HTMLElement>('[part~="retry-button"]')!.click();

    expect(handleRetry.calledOnce).to.equal(true);
  });

  it('should emit sl-remove when the remove button is clicked', async () => {
    const el = await fixture<SlFileUploadItem>(html`
      <sl-file-upload-item state="uploaded" filename="report.pdf"></sl-file-upload-item>
    `);
    const handleRemove = sinon.spy();
    el.addEventListener('sl-remove', handleRemove);

    el.shadowRoot!.querySelector<HTMLElement>('[part~="remove-button"]')!.click();

    expect(handleRemove.calledOnce).to.equal(true);
  });
});
