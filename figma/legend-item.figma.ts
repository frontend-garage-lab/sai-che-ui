// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1646-37
// source=src/components/legend-item/legend-item.component.ts
// component=SlLegendItem
import figma from 'figma';
const instance = figma.selectedInstance;

// Variant = the colour swatch (none = no swatch); the code ignores it when a marker is slotted.
const variant = instance.getEnum('Variant', {
  none: '',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
// The Term layer shows the colon ("Open:"); the component adds it, so the attribute is the bare word.
const showTerm = instance.getBoolean('Show Term');
const term = showTerm ? instance.getString('Term').replace(/:\s*$/, '') : '';
const description = instance.getString('Description');
// Marker slot: the symbol being explained (badge, status, icon), rendered through its own template.
const showMarker = instance.getBoolean('Show Marker');
const markerSlot = showMarker ? instance.getSlot('Marker') : null;
const markers = markerSlot ? markerSlot.connectedInstances : [];
const marker = markers[0]
  ? figma.html`<span slot="marker">${markers[0].executeTemplate().example}</span>`
  : markerSlot
    ? figma.html`<span slot="marker">${markerSlot}</span>`
    : '';

export default {
  example: figma.html`<sl-legend-item${term ? ` term="${term}"` : ''}${variant ? ` variant="${variant}"` : ''}>${marker}${description}</sl-legend-item>`,
  imports: ["import 'src/components/legend-item/legend-item.js'"],
  id: 'legend-item',
  metadata: { nestable: true }
};
