import SlDetailPanel from './detail-panel.component.js';

export * from './detail-panel.component.js';
export default SlDetailPanel;

SlDetailPanel.define('sl-detail-panel');

declare global {
  interface HTMLElementTagNameMap {
    'sl-detail-panel': SlDetailPanel;
  }
}
