import '../../../dist/shoelace.js';
import { clickOnElement } from '../../internal/test.js';
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import type { SlTableColumnDef } from './table.types.js';
import type {
  SlTablePageChangeEvent,
  SlTableRowActionEvent,
  SlTableRowContextMenuEvent,
  SlTableSortEvent
} from '../../events/events.js';
import type SlMenuItem from '../menu-item/menu-item.js';
import type SlTable from './table.component.js';

// Must be a type alias, not an interface — interfaces don't satisfy SlTable's `Record<string, unknown>` constraint.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ProtocolRecord = {
  protocol: string;
  subject: string;
};

const columns: SlTableColumnDef<ProtocolRecord>[] = [
  { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', enableSorting: true },
  { id: 'subject', accessorKey: 'subject', header: 'Subject' }
];

const data: ProtocolRecord[] = [
  { protocol: 'Charlie', subject: 'Kick off meeting' },
  { protocol: 'Alpha', subject: 'Training' },
  { protocol: 'Bravo', subject: 'Key personnel' }
];

async function makeTable(overrides: Partial<SlTable<ProtocolRecord>> = {}) {
  const el = await fixture<SlTable<ProtocolRecord>>(html`<sl-table></sl-table>`);
  el.columns = columns;
  el.data = data;
  Object.assign(el, overrides);
  await el.updateComplete;
  return el;
}

function getRows(el: SlTable<ProtocolRecord>) {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part~="row"]')];
}

function getColumnHeaders(el: SlTable<ProtocolRecord>) {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part~="column"]')];
}

describe('<sl-table>', () => {
  it('should render a component', async () => {
    const el = await makeTable();

    expect(el).to.exist;
    expect(el).to.have.attribute('role', 'grid');
    expect(getColumnHeaders(el)).to.have.length(2);
    expect(getRows(el)).to.have.length(3);
  });

  it('should pass accessibility tests', async () => {
    const el = await makeTable();
    await expect(el).to.be.accessible();
  });

  it('should build the grid template from the column widths', async () => {
    const el = await makeTable();

    expect(el.style.getPropertyValue('--sl-table-column-template')).to.equal('1fr 1fr');
  });

  it('should add a leading track for the checkboxes when selection is multiple', async () => {
    const el = await makeTable({ selection: 'multiple' });

    expect(el.style.getPropertyValue('--sl-table-column-template')).to.equal('min-content 1fr 1fr');
  });

  describe('selection', () => {
    it('should not select rows when selection is none', async () => {
      const el = await makeTable();
      await clickOnElement(getRows(el)[0]);

      expect(el.getSelection()).to.have.length(0);
    });

    it('should select a single row and emit sl-table-selection-change', async () => {
      const el = await makeTable({ selection: 'single' });

      const handler = sinon.spy();
      el.addEventListener('sl-table-selection-change', handler);

      await clickOnElement(getRows(el)[0]);

      expect(el.getSelection()).to.deep.equal([data[0]]);
      expect(handler).to.have.been.calledOnce;
    });

    it('should replace the selection in single mode', async () => {
      const el = await makeTable({ selection: 'single' });

      await clickOnElement(getRows(el)[0]);
      await clickOnElement(getRows(el)[1]);

      expect(el.getSelection()).to.deep.equal([data[1]]);
    });

    it('should accumulate the selection in multiple mode', async () => {
      const el = await makeTable({ selection: 'multiple' });

      await clickOnElement(getRows(el)[0]);
      await clickOnElement(getRows(el)[2]);

      expect(el.getSelection()).to.have.length(2);
    });

    it('should not select disabled rows', async () => {
      const el = await makeTable({ selection: 'multiple', rowDisabled: row => row === data[0] });

      await clickOnElement(getRows(el)[0]);

      expect(el.getSelection()).to.have.length(0);
    });

    it('should clear the selection when selection becomes none', async () => {
      const el = await makeTable({ selection: 'multiple' });
      el.selectAll();
      await el.updateComplete;
      expect(el.getSelection()).to.have.length(3);

      el.selection = 'none';
      await el.updateComplete;

      expect(el.getSelection()).to.have.length(0);
    });
  });

  describe('sorting', () => {
    it('should reorder rows when a sortable column is clicked', async () => {
      const el = await makeTable();
      const handler = sinon.spy();
      el.addEventListener('sl-table-sort', handler);

      await clickOnElement(getColumnHeaders(el)[0]);
      await el.updateComplete;

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTableSortEvent;
      expect(event.detail).to.deep.equal({ columnId: 'protocol', direction: 'asc' });
      expect(el.sortColumn).to.equal('protocol');
      expect(el.sortDirection).to.equal('asc');
      expect(getRows(el).map(row => row.dataset.rowId)).to.deep.equal(['1', '2', '0']);
    });

    it('should toggle the direction on a second click', async () => {
      const el = await makeTable();

      await clickOnElement(getColumnHeaders(el)[0]);
      await el.updateComplete;
      await clickOnElement(getColumnHeaders(el)[0]);
      await el.updateComplete;

      expect(el.sortDirection).to.equal('desc');
      expect(getRows(el).map(row => row.dataset.rowId)).to.deep.equal(['0', '2', '1']);
    });

    it('should not reorder rows when sort-mode is server', async () => {
      const el = await makeTable({ sortMode: 'server' });

      await clickOnElement(getColumnHeaders(el)[0]);
      await el.updateComplete;

      expect(getRows(el).map(row => row.dataset.rowId)).to.deep.equal(['0', '1', '2']);
    });

    it('should ignore clicks on columns that are not sortable', async () => {
      const el = await makeTable();

      await clickOnElement(getColumnHeaders(el)[1]);
      await el.updateComplete;

      expect(el.sortColumn).to.equal('');
    });
  });

  describe('pagination', () => {
    it('should hide rows outside the current page', async () => {
      const el = await makeTable({ paginate: true, pageSize: 2 });

      expect(el.pageCount).to.equal(2);
      expect(getRows(el).map(row => row.dataset.rowId)).to.deep.equal(['0', '1']);

      el.goToPage(2);
      await el.updateComplete;

      expect(getRows(el).map(row => row.dataset.rowId)).to.deep.equal(['2']);
    });

    it('should emit sl-table-page-change when navigating', async () => {
      const el = await makeTable({ paginate: true, pageSize: 2 });

      const handler = sinon.spy();
      el.addEventListener('sl-table-page-change', handler);

      el.goToPage(2);

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTablePageChangeEvent;
      expect(event.detail).to.deep.equal({ page: 2, pageSize: 2 });
    });

    it('should clamp the page to the available pages', async () => {
      const el = await makeTable({ paginate: true, pageSize: 2 });

      el.goToPage(99);

      expect(el.page).to.equal(2);
    });

    it('should not paginate rows itself when total-items is set', async () => {
      const el = await makeTable({ paginate: true, pageSize: 2, totalItems: 120 });

      expect(el.pageCount).to.equal(60);
      expect(getRows(el)).to.have.length(3);
    });
  });

  describe('context menu', () => {
    it('should emit sl-table-row-context-menu with the row', async () => {
      const el = await makeTable();
      const handler = sinon.spy();
      el.addEventListener('sl-table-row-context-menu', handler);

      getRows(el)[1].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true }));

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTableRowContextMenuEvent;
      expect(event.detail.row).to.deep.equal(data[1]);
    });
  });

  describe('action menu', () => {
    const actionsColumns: SlTableColumnDef<ProtocolRecord>[] = [
      { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
      {
        id: 'actions',
        meta: { actions: true },
        cell: ({ row }) =>
          row.original.protocol === 'MOM-001'
            ? html`
                <sl-menu>
                  <sl-menu-item value="properties">Properties</sl-menu-item>
                  <sl-menu-item value="download">Download</sl-menu-item>
                </sl-menu>
              `
            : null
      }
    ];

    async function makeTableWithActions() {
      return makeTable({ columns: actionsColumns });
    }

    it('should reserve a trailing track for the action column', async () => {
      const el = await makeTableWithActions();

      expect(el.style.getPropertyValue('--sl-table-column-template')).to.equal('1fr min-content');
    });

    it('should render a visible trigger in each row', async () => {
      const el = await makeTableWithActions();
      const trigger = getRows(el)[0].querySelector<HTMLElement>('[part~="action-trigger"]')!;

      expect(trigger).to.exist;
      expect(getComputedStyle(trigger).opacity).to.equal('1');
      expect(getComputedStyle(trigger).visibility).to.equal('visible');
      expect(trigger.getBoundingClientRect().width).to.be.greaterThan(0);
    });

    it('should disable the trigger on rows without an action menu', async () => {
      const el = await makeTableWithActions();
      const [withActions, withoutActions] = getRows(el);

      expect(withActions.querySelector('[part~="action-trigger"]')).not.to.have.attribute('disabled');
      expect(withoutActions.querySelector('[part~="action-trigger"]')).to.have.attribute('disabled');
    });

    it('should emit sl-table-row-action when a menu item is selected', async () => {
      const el = await makeTableWithActions();
      const handler = sinon.spy();
      el.addEventListener('sl-table-row-action', handler);

      // The menu has no dimensions until the dropdown is open, so open it before clicking
      const dropdown = getRows(el)[0].querySelector('sl-dropdown')!;
      await (dropdown as unknown as { show: () => Promise<void> }).show();

      const menuItem = el.shadowRoot!.querySelector<SlMenuItem>('sl-menu-item[value="download"]')!;
      await clickOnElement(menuItem);
      await el.updateComplete;

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTableRowActionEvent;
      expect(event.detail.row).to.deep.equal(data[0]);
      expect(event.detail.item.value).to.equal('download');
    });

    it('should not change the selection when the action trigger is clicked', async () => {
      const el = await makeTableWithActions();
      el.selection = 'multiple';
      await el.updateComplete;

      const trigger = getRows(el)[0].querySelector<HTMLElement>('[part~="action-trigger"]')!;
      await clickOnElement(trigger);
      await el.updateComplete;

      expect(el.getSelection()).to.have.length(0);
    });
  });

  describe('empty state', () => {
    it('should show the empty slot when there are no rows', async () => {
      const el = await fixture<SlTable<ProtocolRecord>>(html`
        <sl-table>
          <span slot="empty">Nothing here</span>
        </sl-table>
      `);
      el.columns = columns;
      el.data = [];
      await el.updateComplete;

      await waitUntil(() => el.shadowRoot!.querySelector('[part~="empty"]'));

      expect(el.shadowRoot!.querySelector('[part~="empty"]')).to.exist;
    });
  });
});
