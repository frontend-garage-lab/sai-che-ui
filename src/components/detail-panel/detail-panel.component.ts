import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './detail-panel.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary A non-modal panel that shows details for a selected item alongside the page, e.g. a document's review
 *  history next to the list it was selected from. Pair it with [sl-tab-group](/components/tab-group) to organize
 *  content below the header.
 * @documentation https://shoelace.style/components/detail-panel
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-icon-button
 *
 * @slot label - The panel's title, shown in the header.
 * @slot meta - A secondary line shown below the title, e.g. a revision code.
 * @slot - The panel's content, shown below the header. Commonly an `<sl-tab-group>`.
 *
 * @event {{ source: 'close-button' }} sl-request-close - Emitted when the user clicks the close button. Calling
 *   `event.preventDefault()` will stop the panel from being treated as closed, e.g. if closing requires confirmation.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The panel's header. Wraps the title, meta line, and close button.
 * @csspart title - The container that wraps the label slot.
 * @csspart meta - The container that wraps the meta slot.
 * @csspart close-button - The close button, an `<sl-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The panel's content, below the header.
 */
export default class SlDetailPanel extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-icon-button': SlIconButton
  };

  private readonly localize = new LocalizeController(this);

  private requestClose() {
    const slRequestClose = this.emit('sl-request-close', {
      cancelable: true,
      detail: { source: 'close-button' }
    });

    if (slRequestClose.defaultPrevented) {
      return;
    }

    this.hidden = true;
  }

  render() {
    return html`
      <div part="base" class="detail-panel">
        <header part="header" class="detail-panel__header">
          <div class="detail-panel__heading">
            <h2 part="title" class="detail-panel__title">
              <slot name="label"></slot>
            </h2>
            <div part="meta" class="detail-panel__meta">
              <slot name="meta"></slot>
            </div>
          </div>

          <sl-icon-button
            part="close-button"
            exportparts="base:close-button__base"
            class="detail-panel__close"
            name="x-lg"
            label=${this.localize.term('close')}
            library="system"
            @click=${() => this.requestClose()}
          ></sl-icon-button>
        </header>

        <div part="body" class="detail-panel__body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
