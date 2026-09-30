// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=53-2
// source=src/components/table-column/table-column.component.ts
// component=SlTableColumn
import figma from 'figma';
const instance = figma.selectedInstance;

// Text layers are named after their default content, which differs between variants.
function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const columns = [text('DOCUMENT'), text('STATUS'), text('MODIFIED')];
const key = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

export default {
  example: figma.html`<sl-table-column slot="columns" key="${key(columns[0])}">${columns[0]}</sl-table-column>
<sl-table-column slot="columns" key="${key(columns[1])}">${columns[1]}</sl-table-column>
<sl-table-column slot="columns" key="${key(columns[2])}">${columns[2]}</sl-table-column>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/table-column/table-column.js'"],
  id: 'table-header-row',
  metadata: { nestable: true }
};
