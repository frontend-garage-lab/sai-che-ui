import SlFileUploadItem from './file-upload-item.component.js';

export * from './file-upload-item.component.js';
export default SlFileUploadItem;

SlFileUploadItem.define('sl-file-upload-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-file-upload-item': SlFileUploadItem;
  }
}
