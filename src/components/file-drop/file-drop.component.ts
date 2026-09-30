import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import formControlStyles from '../../styles/form-control.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlFormatBytes from '../format-bytes/format-bytes.component.js';
import SlIcon from '../icon/icon.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './file-drop.styles.js';
import type { CSSResultGroup } from 'lit';
import type { SlFileRejectReason } from '../../events/sl-file-reject.js';

/**
 * @summary File drops let users pick files by dragging them onto a zone or by browsing, e.g. to attach documents or
 *  import a signed version.
 * @documentation https://shoelace.style/components/file-drop
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-format-bytes
 * @dependency sl-icon
 * @dependency sl-icon-button
 *
 * @slot label - The file drop's label. Alternatively, you can use the `label` attribute.
 * @slot instructions - The text inside the drop zone. Use it to localize or reword the default text.
 * @slot icon - The icon inside the drop zone.
 * @slot help-text - Text that describes how to use the file drop. Alternatively, you can use the `help-text` attribute.
 *
 * @event sl-change - Emitted when files are added or removed by the user.
 * @event {{ rejections: { file: File, reason: 'type' | 'size' | 'count' }[] }} sl-file-reject - Emitted when one or
 *  more files are turned away because they don't match `accept`, exceed `max-file-size` or go over `max-files`.
 *
 * @csspart form-control - The form control that wraps the label, drop zone, file list and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The drop zone, a `<button>` element.
 * @csspart icon - The container that wraps the drop zone's icon.
 * @csspart instructions - The container that wraps the drop zone's text.
 * @csspart hint - The hint under the instructions.
 * @csspart file-list - The list of selected files.
 * @csspart file - Each file in the list.
 * @csspart file-type - The badge showing a file's extension.
 * @csspart file-name - A file's name.
 * @csspart file-size - A file's size.
 * @csspart remove-button - A file's remove button, an `<sl-icon-button>` element.
 */
export default class SlFileDrop extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
  static dependencies = {
    'sl-format-bytes': SlFormatBytes,
    'sl-icon': SlIcon,
    'sl-icon-button': SlIconButton
  };

  private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label');

  @query('.file-drop__input') private input: HTMLInputElement;

  @state() private dragging = false;

  /** The file drop's label. If you need to display HTML, use the `label` slot instead. */
  @property() label = '';

  /** The file drop's help text. If you need to display HTML, use the `help-text` slot instead. */
  @property({ attribute: 'help-text' }) helpText = '';

  /** A short line inside the drop zone that states the limits, e.g. "PDF or DOCX, up to 20 MB". */
  @property() hint = '';

  /**
   * The file types to accept, in the same format as the `accept` attribute of a file input: a comma-separated list of
   * extensions (`.pdf`), MIME types (`application/pdf`) or wildcards (`image/*`). Files that don't match are rejected.
   */
  @property() accept = '';

  /** Allows more than one file. Without it, each new file replaces the previous one. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Disables the file drop. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The largest file allowed, in bytes. Larger files are rejected. */
  @property({ attribute: 'max-file-size', type: Number }) maxFileSize: number;

  /** The most files the list can hold when `multiple` is set. Files beyond the limit are rejected. */
  @property({ attribute: 'max-files', type: Number }) maxFiles: number;

  /** Hides the built-in file list, e.g. when you render upload progress yourself. */
  @property({ attribute: 'hide-file-list', type: Boolean }) hideFileList = false;

  /** The label of each file's remove button, followed by the file name. Set it to localize the component. */
  @property({ attribute: 'remove-label' }) removeLabel = 'Remove';

  /** The files the user has picked. You can also set it, e.g. to clear the list after an upload. */
  @property({ attribute: false }) files: File[] = [];

  /** Opens the browser's file picker. */
  browse() {
    if (!this.disabled) {
      this.input.click();
    }
  }

  /** Removes every file from the list. Does not emit `sl-change`. */
  clear() {
    this.files = [];
  }

  private matchesAccept(file: File) {
    const tokens = this.accept
      .split(',')
      .map(token => token.trim().toLowerCase())
      .filter(Boolean);

    if (tokens.length === 0) {
      return true;
    }

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return tokens.some(token => {
      if (token.startsWith('.')) return name.endsWith(token);
      if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
  }

  private addFiles(incoming: File[]) {
    const kept = this.multiple ? [...this.files] : [];
    const accepted: File[] = [];
    const rejections: { file: File; reason: SlFileRejectReason }[] = [];

    for (const file of incoming) {
      if (!this.matchesAccept(file)) {
        rejections.push({ file, reason: 'type' });
      } else if (this.maxFileSize && file.size > this.maxFileSize) {
        rejections.push({ file, reason: 'size' });
      } else if (!this.multiple && accepted.length === 1) {
        rejections.push({ file, reason: 'count' });
      } else if (this.multiple && this.maxFiles && kept.length + accepted.length >= this.maxFiles) {
        rejections.push({ file, reason: 'count' });
      } else {
        accepted.push(file);
      }
    }

    if (accepted.length > 0) {
      this.files = [...kept, ...accepted];
      this.emit('sl-change');
    }

    if (rejections.length > 0) {
      this.emit('sl-file-reject', { detail: { rejections } });
    }
  }

  private handleClick() {
    this.browse();
  }

  private handleInputChange() {
    this.addFiles([...(this.input.files ?? [])]);
    // Reset so picking the same file again still fires a change
    this.input.value = '';
  }

  private handleDragOver(event: DragEvent) {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.dragging = true;
  }

  private handleDragLeave(event: DragEvent) {
    const zone = event.currentTarget as HTMLElement;
    if (!zone.contains(event.relatedTarget as Node | null)) {
      this.dragging = false;
    }
  }

  private handleDrop(event: DragEvent) {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    this.dragging = false;
    this.addFiles([...(event.dataTransfer?.files ?? [])]);
  }

  private handleRemove(file: File) {
    this.files = this.files.filter(item => item !== file);
    this.emit('sl-change');
  }

  private getExtension(file: File) {
    const dot = file.name.lastIndexOf('.');
    return dot > 0 ? file.name.slice(dot + 1, dot + 5) : '';
  }

  render() {
    const hasLabelSlot = this.hasSlotController.test('label');
    const hasHelpTextSlot = this.hasSlotController.test('help-text');
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;

    return html`
      <div
        part="form-control"
        class=${classMap({
          'form-control': true,
          'form-control--medium': true,
          'form-control--has-label': hasLabel,
          'form-control--has-help-text': hasHelpText
        })}
      >
        <div
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </div>

        <button
          part="base"
          type="button"
          class=${classMap({
            'file-drop': true,
            'file-drop--dragging': this.dragging,
            'file-drop--disabled': this.disabled
          })}
          ?disabled=${this.disabled}
          aria-labelledby=${hasLabel ? 'label instructions' : 'instructions'}
          aria-describedby="hint help-text"
          @click=${this.handleClick}
          @dragenter=${this.handleDragOver}
          @dragover=${this.handleDragOver}
          @dragleave=${this.handleDragLeave}
          @drop=${this.handleDrop}
        >
          <span part="icon" class="file-drop__icon">
            <slot name="icon"><sl-icon library="system" name="cloud-arrow-up"></sl-icon></slot>
          </span>
          <span part="instructions" id="instructions" class="file-drop__instructions">
            <slot name="instructions"> <span class="file-drop__browse">Click to browse</span> or drag files here </slot>
          </span>
          ${this.hint ? html`<span part="hint" id="hint" class="file-drop__hint">${this.hint}</span>` : ''}
        </button>

        <input
          class="file-drop__input"
          type="file"
          tabindex="-1"
          aria-hidden="true"
          hidden
          accept=${this.accept}
          ?multiple=${this.multiple}
          @change=${this.handleInputChange}
        />

        ${!this.hideFileList && this.files.length > 0
          ? html`
              <ul part="file-list" class="file-drop__list">
                ${this.files.map(
                  file => html`
                    <li part="file" class="file-drop__file">
                      <span part="file-type" class="file-drop__file-type" aria-hidden="true">
                        ${this.getExtension(file) || html`<sl-icon library="system" name="file-earmark"></sl-icon>`}
                      </span>
                      <span part="file-name" class="file-drop__file-name" title=${file.name}>${file.name}</span>
                      <sl-format-bytes
                        part="file-size"
                        class="file-drop__file-size"
                        value=${file.size}
                      ></sl-format-bytes>
                      <sl-icon-button
                        part="remove-button"
                        class="file-drop__remove"
                        library="system"
                        name="x-lg"
                        label="${this.removeLabel} ${file.name}"
                        ?disabled=${this.disabled}
                        @click=${() => this.handleRemove(file)}
                      ></sl-icon-button>
                    </li>
                  `
                )}
              </ul>
            `
          : ''}

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
}
