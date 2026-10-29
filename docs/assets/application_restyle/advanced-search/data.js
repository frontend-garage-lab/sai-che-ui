/*
 * advanced-search — data and table setup shared by every screen of the flow.
 *
 * Legacy: the "Searches" tree (My last search / My searches / Public searches) and the "Advanced Search - Create New"
 * dialog. Restyle: My searches and Public searches become tabs with a table, My last search a card that opens the
 * search page (application_screenshot/advanced-search).
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

export * from '../_shared/restyle.js';

/** Row menu of a saved search: Run, Edit · Delete (destructive, separated). */
const searchMenu = () => html`
  <sl-menu>
    <sl-menu-item value="run"><sl-icon slot="prefix" name="play-fill"></sl-icon>Run</sl-menu-item>
    <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
  </sl-menu>
`;

export const searchColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Search name',
    enableSorting: true,
    meta: { width: 'minmax(16rem, 1fr)' }
  },
  {
    id: 'lastRun',
    accessorKey: 'lastRun',
    header: 'Last run',
    enableSorting: true,
    meta: { width: '11rem', nowrap: true }
  },
  { id: 'actions', meta: { actions: true }, cell: searchMenu }
];

export const mySearches = [
  { name: 'Job documents modified this month', lastRun: '26-Oct-2026 09:59' },
  { name: 'External drawings · approve performer', lastRun: '24-Oct-2026 15:12' },
  { name: 'Transmittals with incoming documents', lastRun: '21-Oct-2026 11:40' },
  { name: 'Documents with client progress below 50%', lastRun: '17-Oct-2026 08:25' },
  { name: 'Job documents · current version', lastRun: '09-Oct-2026 17:03' }
];

export const publicSearches = [
  { name: 'NCR open by project', lastRun: '25-Oct-2026 10:18' },
  { name: 'Audit documents · latest revision', lastRun: '22-Oct-2026 14:47' },
  { name: 'Training certificates expiring', lastRun: '20-Oct-2026 09:05' },
  { name: 'Milestones gained last week', lastRun: '15-Oct-2026 16:30' }
];

/** Result tab: columns of the result table (Available ↔ Selected transfer). */
const columnList = header => [{ id: 'column', accessorKey: 'column', header, meta: { width: 'minmax(0, 1fr)' } }];

export const availableColumnColumns = columnList('Available columns');

export const selectedColumnColumns = columnList('Selected columns');

export const selectedColumns = ['Name', 'Title', 'Type', 'Version', 'Status', 'Modified'].map(column => ({ column }));

export const availableColumns = ['Owner', 'Client progress', 'Project progress'].map(column => ({ column }));
