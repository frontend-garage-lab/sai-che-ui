import '../../../dist/shoelace.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import type { SlFileRejectEvent } from '../../events/sl-file-reject.js';
import type SlFileDrop from './file-drop.js';

const makeFile = (name: string, size = 10, type = '') => new File([new Uint8Array(size)], name, { type });

function drop(el: SlFileDrop, files: File[]) {
  const zone = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  zone.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
}

describe('<sl-file-drop>', () => {
  it('should be accessible', async () => {
    const el = await fixture<SlFileDrop>(html`
      <sl-file-drop label="Attachments" hint="PDF, up to 20 MB" help-text="Files are scanned on upload"></sl-file-drop>
    `);

    await expect(el).to.be.accessible();
  });

  it('should add dropped files and emit sl-change', async () => {
    const el = await fixture<SlFileDrop>(html` <sl-file-drop multiple></sl-file-drop> `);
    const listener = oneEvent(el, 'sl-change');

    drop(el, [makeFile('letter.pdf'), makeFile('annex.docx')]);
    await listener;
    await el.updateComplete;

    expect(el.files.map(file => file.name)).to.deep.equal(['letter.pdf', 'annex.docx']);
    expect(el.shadowRoot!.querySelectorAll('[part~="file"]').length).to.equal(2);
  });

  it('should replace the file when multiple is not set', async () => {
    const el = await fixture<SlFileDrop>(html` <sl-file-drop></sl-file-drop> `);

    drop(el, [makeFile('first.pdf')]);
    drop(el, [makeFile('second.pdf')]);

    expect(el.files.map(file => file.name)).to.deep.equal(['second.pdf']);
  });

  it('should reject files by type, size and count', async () => {
    const el = await fixture<SlFileDrop>(html`
      <sl-file-drop multiple accept=".pdf,image/*" max-file-size="100" max-files="2"></sl-file-drop>
    `);
    const listener = oneEvent(el, 'sl-file-reject') as Promise<SlFileRejectEvent>;

    drop(el, [
      makeFile('ok.pdf'),
      makeFile('virus.exe'),
      makeFile('huge.pdf', 500),
      makeFile('photo.png', 10, 'image/png'),
      makeFile('extra.pdf')
    ]);
    const event = await listener;

    expect(el.files.map(file => file.name)).to.deep.equal(['ok.pdf', 'photo.png']);
    expect(event.detail.rejections.map(r => [r.file.name, r.reason])).to.deep.equal([
      ['virus.exe', 'type'],
      ['huge.pdf', 'size'],
      ['extra.pdf', 'count']
    ]);
  });

  it('should remove a file from the list', async () => {
    const el = await fixture<SlFileDrop>(html` <sl-file-drop multiple></sl-file-drop> `);
    drop(el, [makeFile('a.pdf'), makeFile('b.pdf')]);
    await el.updateComplete;

    const handler = sinon.spy();
    el.addEventListener('sl-change', handler);
    el.shadowRoot!.querySelector<HTMLElement>('[part~="remove-button"]')!.click();
    await el.updateComplete;

    expect(el.files.map(file => file.name)).to.deep.equal(['b.pdf']);
    expect(handler).to.have.been.calledOnce;
  });

  it('should ignore drops when disabled', async () => {
    const el = await fixture<SlFileDrop>(html` <sl-file-drop disabled></sl-file-drop> `);

    drop(el, [makeFile('a.pdf')]);

    expect(el.files).to.be.empty;
  });
});
