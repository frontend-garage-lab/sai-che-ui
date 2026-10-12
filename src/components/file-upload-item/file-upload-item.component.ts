import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlButton from '../button/button.component.js';
import SlIcon from '../icon/icon.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import SlProgressBar from '../progress-bar/progress-bar.component.js';
import SlSpinner from '../spinner/spinner.component.js';
import styles from './file-upload-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Shows a single file's upload status in a list, e.g. inside a dialog paired with an [sl-file-drop](/components/file-drop).
 * @documentation https://shoelace.style/components/file-upload-item
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-button
 * @dependency sl-icon
 * @dependency sl-icon-button
 * @dependency sl-progress-bar
 * @dependency sl-spinner
 *
 * @slot - The file name. Alternatively, you can use the `filename` attribute.
 * @slot meta - A secondary line below the file name, e.g. the file size and status. Alternatively, you can use the
 *  `meta` attribute.
 *
 * @event sl-remove - Emitted when the user clicks the remove button.
 * @event sl-retry - Emitted when the user clicks the retry button. Only dispatched when `state` is `failed`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the state icon or spinner.
 * @csspart content - The container that wraps the file name and meta line.
 * @csspart filename - The file name.
 * @csspart meta - The container that wraps the meta slot.
 * @csspart progress - The progress bar, an `<sl-progress-bar>`. Only rendered when `state` is `uploading`.
 * @csspart retry-button - The retry button, an `<sl-button>`. Only rendered when `state` is `failed`.
 * @csspart remove-button - The remove button, an `<sl-icon-button>`.
 */
export default class SlFileUploadItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-button': SlButton,
    'sl-icon': SlIcon,
    'sl-icon-button': SlIconButton,
    'sl-progress-bar': SlProgressBar,
    'sl-spinner': SlSpinner
  };

  /** The file's upload state. */
  @property({ reflect: true }) state: 'waiting' | 'uploading' | 'uploaded' | 'failed' = 'waiting';

  /** The file's name. If you need to display HTML, use the default slot instead. */
  @property() filename = '';

  /** A secondary line shown below the file name, e.g. "2.4 MB · Uploaded". If you need to display HTML, use the `meta` slot instead. */
  @property() meta = '';

  /** The upload's progress as a percentage, 0 to 100. Only shown when `state` is `uploading`. */
  @property({ type: Number }) progress = 0;

  /** The label of the retry button. Set it to localize the component. */
  @property({ attribute: 'retry-label' }) retryLabel = 'Retry';

  /** The label of the remove button, followed by the file name. Set it to localize the component. */
  @property({ attribute: 'remove-label' }) removeLabel = 'Remove';

  private handleRetryClick() {
    this.emit('sl-retry');
  }

  private handleRemoveClick() {
    this.emit('sl-remove');
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          'file-upload-item': true,
          'file-upload-item--waiting': this.state === 'waiting',
          'file-upload-item--uploading': this.state === 'uploading',
          'file-upload-item--uploaded': this.state === 'uploaded',
          'file-upload-item--failed': this.state === 'failed'
        })}
      >
        <span part="icon" class="file-upload-item__icon">
          ${this.state === 'uploading'
            ? html`<sl-spinner></sl-spinner>`
            : html`
                <sl-icon
                  name=${this.state === 'uploaded'
                    ? 'check2-circle'
                    : this.state === 'failed'
                      ? 'exclamation-octagon'
                      : 'hourglass-split'}
                ></sl-icon>
              `}
        </span>

        <div part="content" class="file-upload-item__content">
          <span part="filename" class="file-upload-item__filename" title=${this.filename}>
            <slot>${this.filename}</slot>
          </span>
          <span part="meta" class="file-upload-item__meta">
            <slot name="meta">${this.meta}</slot>
          </span>
          ${this.state === 'uploading'
            ? html`
                <sl-progress-bar
                  part="progress"
                  class="file-upload-item__progress"
                  value=${this.progress}
                ></sl-progress-bar>
              `
            : ''}
        </div>

        ${this.state === 'failed'
          ? html`
              <sl-button
                part="retry-button"
                class="file-upload-item__retry"
                variant="danger"
                outline
                size="small"
                @click=${this.handleRetryClick}
              >
                ${this.retryLabel}
              </sl-button>
            `
          : ''}

        <sl-icon-button
          part="remove-button"
          class="file-upload-item__remove"
          name="trash"
          label="${this.removeLabel} ${this.filename}"
          @click=${this.handleRemoveClick}
        ></sl-icon-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-file-upload-item': SlFileUploadItem;
  }
}
