import SlFileDrop from './file-drop.component.js';

export * from './file-drop.component.js';
export default SlFileDrop;

SlFileDrop.define('sl-file-drop');

declare global {
  interface HTMLElementTagNameMap {
    'sl-file-drop': SlFileDrop;
  }
}
