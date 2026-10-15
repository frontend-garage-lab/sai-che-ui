// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=855-430
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// The pagination footer is drawn by <sl-table> itself, so there is no element to render: this surfaces the
// attributes that switch it on. `Page size` is the initial rows per page; the select offers `page-sizes`.
const pageSize = instance.getEnum('Page size', { '10': '10', '25': '25', '50': '50', '100': '100' });

export default {
  example: figma.html`<sl-table paginate page-size="${pageSize}" page-sizes="10 25 50 100">
  <!-- the summary, page buttons and rows-per-page select are rendered by the table -->
</sl-table>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-pagination',
  metadata: { nestable: true }
};
