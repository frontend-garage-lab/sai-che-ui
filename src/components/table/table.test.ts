import '../../../dist/shoelace.js';
import { clickOnElement } from '../../internal/test.js';
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import type { SlTablePageChangeEvent, SlTableRowActionEvent, SlTableRowContextMenuEvent } from '../../events/events.js';
import type SlMenuItem from '../menu-item/menu-item.js';
import type SlTable from './table.component.js';

async function makeTable() {
  const el = await fixture<SlTable>(html`
    <sl-table>
      <sl-table-column slot="columns" key="protocol" sortable>Protocol Number</sl-table-column>
      <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

      <sl-table-row value="1">
        <sl-table-cell>MOM-001</sl-table-cell>
        <sl-table-cell>Kick off meeting</sl-table-cell>
      </sl-table-row>
      <sl-table-row value="2">
        <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
        <sl-table-cell>Training</sl-table-cell>
      </sl-table-row>
      <sl-table-row value="3">
        <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
        <sl-table-cell>Key personnel</sl-table-cell>
      </sl-table-row>
    </sl-table>
  `);

  await el.updateComplete;
  return el;
}

describe('<sl-table>', () => {
  it('should render a component', async () => {
    const el = await makeTable();

    expect(el).to.exist;
    expect(el).to.have.attribute('role', 'grid');
    expect(el.getColumns()).to.have.length(2);
    expect(el.getRows()).to.have.length(3);
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
    const el = await makeTable();
    el.selection = 'multiple';
    await el.updateComplete;

    expect(el.style.getPropertyValue('--sl-table-column-template')).to.equal('min-content 1fr 1fr');
  });

  describe('selection', () => {
    it('should not select rows when selection is none', async () => {
      const el = await makeTable();
      await clickOnElement(el.getRows()[0]);

      expect(el.getSelection()).to.have.length(0);
    });

    it('should select a single row and emit sl-table-selection-change', async () => {
      const el = await makeTable();
      el.selection = 'single';
      await el.updateComplete;

      const handler = sinon.spy();
      el.addEventListener('sl-table-selection-change', handler);

      await clickOnElement(el.getRows()[0]);

      expect(el.getSelection()).to.deep.equal([el.getRows()[0]]);
      expect(handler).to.have.been.calledOnce;
    });

    it('should replace the selection in single mode', async () => {
      const el = await makeTable();
      el.selection = 'single';
      await el.updateComplete;

      await clickOnElement(el.getRows()[0]);
      await clickOnElement(el.getRows()[1]);

      expect(el.getSelection()).to.deep.equal([el.getRows()[1]]);
    });

    it('should accumulate the selection in multiple mode', async () => {
      const el = await makeTable();
      el.selection = 'multiple';
      await el.updateComplete;

      await clickOnElement(el.getRows()[0]);
      await clickOnElement(el.getRows()[2]);

      expect(el.getSelection()).to.have.length(2);
    });

    it('should not select disabled rows', async () => {
      const el = await makeTable();
      el.selection = 'multiple';
      el.getRows()[0].disabled = true;
      await el.updateComplete;

      await clickOnElement(el.getRows()[0]);

      expect(el.getSelection()).to.have.length(0);
    });

    it('should clear the selection when selection becomes none', async () => {
      const el = await makeTable();
      el.selection = 'multiple';
      await el.updateComplete;
      el.selectAll();
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

      await clickOnElement(el.getColumns()[0]);
      await el.updateComplete;

      expect(handler).to.have.been.calledOnce;
      expect(el.sortColumn).to.equal('protocol');
      expect(el.sortDirection).to.equal('asc');
      expect(el.getRows().map(row => row.value)).to.deep.equal(['3', '2', '1']);
    });

    it('should toggle the direction on a second click', async () => {
      const el = await makeTable();

      await clickOnElement(el.getColumns()[0]);
      await el.updateComplete;
      await clickOnElement(el.getColumns()[0]);
      await el.updateComplete;

      expect(el.sortDirection).to.equal('desc');
      expect(el.getRows().map(row => row.value)).to.deep.equal(['1', '2', '3']);
    });

    it('should not reorder rows when sort-mode is server', async () => {
      const el = await makeTable();
      el.sortMode = 'server';
      await el.updateComplete;

      await clickOnElement(el.getColumns()[0]);
      await el.updateComplete;

      expect(el.getRows().map(row => row.value)).to.deep.equal(['1', '2', '3']);
    });

    it('should ignore clicks on columns that are not sortable', async () => {
      const el = await makeTable();

      await clickOnElement(el.getColumns()[1]);
      await el.updateComplete;

      expect(el.sortColumn).to.equal('');
    });
  });

  describe('pagination', () => {
    it('should hide rows outside the current page', async () => {
      const el = await makeTable();
      el.paginate = true;
      el.pageSize = 2;
      await el.updateComplete;

      expect(el.pageCount).to.equal(2);
      expect(el.getVisibleRows().map(row => row.value)).to.deep.equal(['1', '2']);

      el.goToPage(2);
      await el.updateComplete;

      expect(el.getVisibleRows().map(row => row.value)).to.deep.equal(['3']);
    });

    it('should emit sl-table-page-change when navigating', async () => {
      const el = await makeTable();
      el.paginate = true;
      el.pageSize = 2;
      await el.updateComplete;

      const handler = sinon.spy();
      el.addEventListener('sl-table-page-change', handler);

      el.goToPage(2);

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTablePageChangeEvent;
      expect(event.detail).to.deep.equal({ page: 2, pageSize: 2 });
    });

    it('should clamp the page to the available pages', async () => {
      const el = await makeTable();
      el.paginate = true;
      el.pageSize = 2;
      await el.updateComplete;

      el.goToPage(99);

      expect(el.page).to.equal(2);
    });

    it('should not paginate rows itself when total-items is set', async () => {
      const el = await makeTable();
      el.paginate = true;
      el.pageSize = 2;
      el.totalItems = 120;
      await el.updateComplete;

      expect(el.pageCount).to.equal(60);
      expect(el.getVisibleRows()).to.have.length(3);
    });
  });

  describe('context menu', () => {
    it('should emit sl-table-row-context-menu with the row', async () => {
      const el = await makeTable();
      const handler = sinon.spy();
      el.addEventListener('sl-table-row-context-menu', handler);

      el.getRows()[1].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true }));

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTableRowContextMenuEvent;
      expect(event.detail.row.value).to.equal('2');
    });
  });

  describe('action menu', () => {
    async function makeTableWithActions() {
      const el = await fixture<SlTable>(html`
        <sl-table actions>
          <sl-table-column slot="columns" key="protocol">Protocol Number</sl-table-column>

          <sl-table-row value="1">
            <sl-table-cell>MOM-001</sl-table-cell>
            <sl-menu slot="actions">
              <sl-menu-item value="properties">Properties</sl-menu-item>
              <sl-menu-item value="download">Download</sl-menu-item>
            </sl-menu>
          </sl-table-row>
          <sl-table-row value="2">
            <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
          </sl-table-row>
        </sl-table>
      `);

      await el.updateComplete;
      await Promise.all(el.getRows().map(row => row.updateComplete));
      return el;
    }

    it('should reserve a trailing track for the action column', async () => {
      const el = await makeTableWithActions();

      expect(el.style.getPropertyValue('--sl-table-column-template')).to.equal('1fr min-content');
    });

    it('should render a visible trigger in each row', async () => {
      const el = await makeTableWithActions();
      const trigger = el.getRows()[0].shadowRoot!.querySelector<HTMLElement>('[part~="action-trigger"]')!;

      expect(trigger).to.exist;
      expect(getComputedStyle(trigger).opacity).to.equal('1');
      expect(getComputedStyle(trigger).visibility).to.equal('visible');
      expect(trigger.getBoundingClientRect().width).to.be.greaterThan(0);
    });

    it('should place the action column after the last column', async () => {
      const el = await makeTableWithActions();
      const row = el.getRows()[0];
      const cellRight = row.querySelector('sl-table-cell')!.getBoundingClientRect().right;
      const triggerLeft = row
        .shadowRoot!.querySelector<HTMLElement>('[part~="action-trigger"]')!
        .getBoundingClientRect().left;

      expect(triggerLeft).to.be.at.least(cellRight);
    });

    it('should disable the trigger on rows without an action menu', async () => {
      const el = await makeTableWithActions();
      const [withActions, withoutActions] = el.getRows();

      expect(withActions.shadowRoot!.querySelector('[part~="action-trigger"]')).not.to.have.attribute('disabled');
      expect(withoutActions.shadowRoot!.querySelector('[part~="action-trigger"]')).to.have.attribute('disabled');
    });

    it('should emit sl-table-row-action when a menu item is selected', async () => {
      const el = await makeTableWithActions();
      const handler = sinon.spy();
      el.addEventListener('sl-table-row-action', handler);

      // The menu has no dimensions until the dropdown is open, so open it before clicking
      await el.getRows()[0].showActionMenu();

      const menuItem = el.querySelector<SlMenuItem>('sl-menu-item[value="download"]')!;
      await clickOnElement(menuItem);
      await el.updateComplete;

      expect(handler).to.have.been.calledOnce;
      const event = handler.firstCall.args[0] as SlTableRowActionEvent;
      expect(event.detail.row.value).to.equal('1');
      expect(event.detail.item.value).to.equal('download');
    });

    it('should not change the selection when the action trigger is clicked', async () => {
      const el = await makeTableWithActions();
      el.selection = 'multiple';
      await el.updateComplete;

      const trigger = el.getRows()[0].shadowRoot!.querySelector<HTMLElement>('[part~="action-trigger"]')!;
      await clickOnElement(trigger);
      await el.updateComplete;

      expect(el.getSelection()).to.have.length(0);
    });

    it('should open the menu via showActionMenu()', async () => {
      const el = await makeTableWithActions();
      const row = el.getRows()[0];

      await row.showActionMenu();

      expect(row.shadowRoot!.querySelector('sl-dropdown')).to.have.attribute('open');
    });
  });

  describe('empty state', () => {
    it('should show the empty slot when there are no rows', async () => {
      const el = await fixture<SlTable>(html`
        <sl-table>
          <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
          <span slot="empty">Nothing here</span>
        </sl-table>
      `);

      await waitUntil(() => el.shadowRoot!.querySelector('[part~="empty"]'));

      expect(el.shadowRoot!.querySelector('[part~="empty"]')).to.exist;
    });
  });
});
