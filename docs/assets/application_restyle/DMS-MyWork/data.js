/*
 * DMS-MyWork — mock data and table setup of the My favorites page.
 * Favorites transcribed from the draft screenshot ("Saved documents"); Selected docs reuses four of them as the collected documents.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentCell, revisionTag, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

const favorite = (document, title, type, category, revision, status, project, saved) => ({
  document,
  title,
  type,
  category,
  revision,
  status,
  project,
  saved
});

export const favorites = [
  favorite(
    '000001-YD-ST-1007',
    'Yard Document – Utilities area',
    'Yard Document',
    'Yard documents',
    '1',
    'Superseded',
    '000001',
    '12/10/2026'
  ),
  favorite(
    '000001-YD-EL-1084',
    'Yard Document – Storage tanks',
    'Yard Document',
    'Yard documents',
    '0',
    'Superseded',
    '000001',
    '12/10/2026'
  ),
  favorite(
    '032325-ARN-PI-1091',
    'Advance Revision Notice – Gas separation unit',
    'Advance Revision Notice',
    'Project documents',
    '2',
    'Issued To Subco',
    '032325',
    '08/10/2026'
  ),
  favorite(
    '032325-ARN-CI-1105',
    'Advance Revision Notice – Cooling water system',
    'Advance Revision Notice',
    'Project documents',
    '2',
    'Draft',
    '032325',
    '06/10/2026'
  ),
  favorite(
    '032325-PR-ST-1042',
    'Purchase Request – Control building',
    'Purchase Request',
    'Procurement (SAP)',
    '2',
    'Archived',
    '032325',
    '04/10/2026'
  )
];

/** The star is the state "saved": clicking it removes the document from the list. Warning = the tint of the legacy star. */
const favoriteCell = ({ row }) =>
  html`<sl-icon-button
    name="star-fill"
    variant="warning"
    label="Remove ${row.original.document} from favorites"
  ></sl-icon-button>`;

/** Last column of both tables: opens the document (plain icon button with tooltip, like the row actions of the other tables). */
const viewColumn = {
  id: 'view',
  header: '',
  meta: { width: '3rem', align: 'center' },
  cell: ({ row }) =>
    html`<sl-tooltip content="View document"
      ><sl-icon-button name="eye" label="View ${row.original.document}"></sl-icon-button
    ></sl-tooltip>`
};

export const favoriteColumns = [
  { id: 'favorite', header: '', meta: { width: '4rem' }, cell: favoriteCell },
  {
    id: 'document',
    accessorKey: 'document',
    header: 'Document',
    enableSorting: true,
    meta: { width: 'minmax(16rem, 1.4fr)' },
    cell: ({ row }) => documentCell(row.original.document, ...(row.original.meta ?? [row.original.title]))
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Document type',
    enableSorting: true,
    meta: { width: 'minmax(12rem, 1fr)' },
    cell: ({ row }) =>
      row.original.category ? documentCell(row.original.type, row.original.category) : row.original.type
  },
  {
    id: 'revision',
    accessorKey: 'revision',
    header: 'Rev.',
    meta: { width: '5rem' },
    cell: ({ row }) => revisionTag(row.original.revision)
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    meta: { width: '10rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'project',
    accessorKey: 'project',
    header: 'Project',
    enableSorting: true,
    meta: { width: '7rem', nowrap: true }
  },
  { id: 'saved', accessorKey: 'saved', header: 'Saved on', enableSorting: true, meta: { width: '8rem', nowrap: true } },
  viewColumn
];

// ------------------------------------------------------------------ Selected docs

/** Documents collected for the bulk actions of the toolbar: four of the favorites above, no new data. */
export const selectedDocs = [0, 2, 3, 4].map(index => favorites[index]);

/** State of the page: the first two documents ticked, so the toolbar actions apply to them. */
export const isTicked = row => row.document === selectedDocs[0].document || row.document === selectedDocs[1].document;

/**
 * Row menu (⋮) of a selected document, as edited by hand in Figma (2026-11-02): the bulk actions (Modify, IVA, Add WBS,
 * Transmit) live in the toolbar, so the menu only has what acts on the single row. Shared with the DACS-Toolbar screens.
 */
export const selectedDocMenu = () => html`
  <sl-menu>
    <sl-menu-item value="download"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="remove"><sl-icon slot="prefix" name="x-lg"></sl-icon>Remove from selection</sl-menu-item>
    <sl-menu-item value="link"
      ><sl-icon slot="prefix" name="link-45deg"></sl-icon>Copy link for transmittal</sl-menu-item
    >
    <sl-menu-item value="favorite"><sl-icon slot="prefix" name="star"></sl-icon>Add to favorites</sl-menu-item>
    <sl-menu-item value="confidential"><sl-icon slot="prefix" name="lock"></sl-icon>Turn off confidential</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="mail"><sl-icon slot="prefix" name="envelope"></sl-icon>Send mail</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="admin"><sl-icon slot="prefix" name="gear"></sl-icon>Admin actions</sl-menu-item>
    <sl-menu-item value="actions"><sl-icon slot="prefix" name="three-dots"></sl-icon>Actions</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="properties"><sl-icon slot="prefix" name="info-circle"></sl-icon>Properties</sl-menu-item>
  </sl-menu>
`;

/** Same columns as the favorites without the star, the saved date and the eye: the only row action is the ⋮ menu. */
export const selectedColumns = [
  ...favoriteColumns.filter(column => !['favorite', 'saved', 'view'].includes(column.id)),
  { id: 'actions', meta: { actions: true }, cell: selectedDocMenu }
];
