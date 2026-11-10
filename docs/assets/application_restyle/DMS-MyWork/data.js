/*
 * DMS-MyWork — mock data and table setup of the Selected docs page.
 * Documents transcribed from the draft screenshot ("Saved documents"). My favorites removed on 2026-11-09 (functional analysis).
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentCell, revisionTag, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

const doc = (document, title, type, category, revision, status, project) => ({
  document,
  title,
  type,
  category,
  revision,
  status,
  project
});

const documents = [
  doc(
    '000001-YD-ST-1007',
    'Yard Document – Utilities area',
    'Yard Document',
    'Yard documents',
    '1',
    'Superseded',
    '000001'
  ),
  doc(
    '000001-YD-EL-1084',
    'Yard Document – Storage tanks',
    'Yard Document',
    'Yard documents',
    '0',
    'Superseded',
    '000001'
  ),
  doc(
    '032325-ARN-PI-1091',
    'Advance Revision Notice – Gas separation unit',
    'Advance Revision Notice',
    'Project documents',
    '2',
    'Issued To Subco',
    '032325'
  ),
  doc(
    '032325-ARN-CI-1105',
    'Advance Revision Notice – Cooling water system',
    'Advance Revision Notice',
    'Project documents',
    '2',
    'Draft',
    '032325'
  ),
  doc(
    '032325-PR-ST-1042',
    'Purchase Request – Control building',
    'Purchase Request',
    'Procurement (SAP)',
    '2',
    'Archived',
    '032325'
  )
];

const documentColumns = [
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
  }
];

// ------------------------------------------------------------------ Selected docs

/** Documents collected for the bulk actions of the toolbar: four of the documents above, no new data. */
export const selectedDocs = [0, 2, 3, 4].map(index => documents[index]);

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

/** Document columns plus the ⋮ menu, the only row action. */
export const selectedColumns = [...documentColumns, { id: 'actions', meta: { actions: true }, cell: selectedDocMenu }];

// ------------------------------------------------------------------ Clipboard (functional analysis §4.3.2)

/** Documents collected in the Clipboard, as in the Figma frame 1-Clipboard: the five documents above. */
export const clipboardDocs = documents;

/** State of the page: the first document is ticked and open in the detail panel. */
export const isOpenInPanel = row => row.document === clipboardDocs[0].document;

/** Row menu (⋮) of a Clipboard document: open it or edit its properties (user request 2026-11-09). */
export const clipboardDocMenu = () => html`
  <sl-menu>
    <sl-menu-item value="view"><sl-icon slot="prefix" name="eye"></sl-icon>View</sl-menu-item>
    <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
  </sl-menu>
`;

/** Columns of the Figma frame (Document, Document type) plus the ⋮ row menu. */
export const clipboardColumns = [
  ...documentColumns.filter(column => ['document', 'type'].includes(column.id)),
  { id: 'actions', meta: { actions: true }, cell: clipboardDocMenu }
];

// ------------------------------------------------------------------ Dashboard (functional analysis §4.3.1)

/** Projects of the user, shown next to each item: the dashboard covers all of them, not only the selected one. */
const PROJECT_NAMES = {
  '032325': 'Bioraffineria Di Livorno EPC',
  '032239': 'Berri Project',
  '023144': 'Neptun Deep Project',
  F10412: '–'
};
const item = (type, title, code, project, status, action) => ({
  object: `${type} – ${title}`,
  reference: `${code} · ${project} · ${PROJECT_NAMES[project]}`,
  status,
  action
});

/** "Waiting for your action": tasks assigned to the user, transcribed from the dashboard prototype. */
export const waitingTasks = [
  item('Comment', 'Electrical substation', 'F10412-CMT-IN-1091', 'F10412', 'Consolidated', 'Close Comment'),
  item('Comment', 'Flare', '032239-CMT-IN-1007', '032239', 'Consolidated', 'Close Comment'),
  item('FC - Punch Item', 'Export line', '023144-PI-EL-1084', '023144', 'Closed', 'Approve Punch Item'),
  item('Changes', 'Heat exchanger E-101', '023144-CHG-ME-1168', '023144', 'Opened', 'Close Change'),
  item(
    'Advance Revision Notice',
    'Cooling water system',
    '032239-ARN-EL-1133',
    '032239',
    'Issued To CM/SM',
    'Promote ARN to ready'
  ),
  item(
    'Advance Revision Notice',
    'Pump P-204 A/B',
    '032325-ARN-ST-1049',
    '032325',
    'Issued To CM/SM',
    'Promote ARN to ready'
  )
];

/** "Checked out documents": open work, the row stays until the document is checked in or the check-out is cancelled. */
export const checkedOutDocs = [
  item('Isometric Document', 'Process area foundations', '032325-ISO-ME-1042', '032325', 'Working'),
  item('Site Technical Query (STQ)', 'Compression module', '032325-STQ-PI-1042', '032325', 'Issued to FEM'),
  item('Transmittal', 'Pump P-204 A/B', '032239-TR-PI-1021', '032239', 'Draft'),
  item('Scanned Punch List', 'Heat exchanger E-101', '023144-SPL-CI-1035', '023144', 'Working'),
  item('Advance Revision Notice', 'Storage tanks', 'F10412-ARN-IN-1035', 'F10412', 'Issued To CM/SM'),
  item('Job Document', 'Control building layout', '032325-JD-CI-1210', '032325', 'Draft')
];

const objectColumn = {
  id: 'object',
  accessorKey: 'object',
  header: 'Item',
  meta: { width: 'minmax(16rem, 1fr)' },
  cell: ({ row }) => documentCell(row.original.object, row.original.reference)
};
const statusColumn = {
  id: 'status',
  accessorKey: 'status',
  header: 'Status',
  meta: { width: '10rem' },
  cell: ({ row }) => statusTag(row.original.status)
};

/** Row menu (⋮) of a task waiting for the user: run the pending action, open the document, see its properties. */
export const waitingMenu = ({ row }) => html`
  <sl-menu>
    <sl-menu-item value="action"
      ><sl-icon slot="prefix" name="check2-circle"></sl-icon>${row.original.action}</sl-menu-item
    >
    <sl-menu-item value="view"><sl-icon slot="prefix" name="eye"></sl-icon>View document</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="properties"><sl-icon slot="prefix" name="info-circle"></sl-icon>Properties</sl-menu-item>
  </sl-menu>
`;

/** Columns are fixed by the working area configuration: no Config, no sorting. */
export const waitingColumns = [
  objectColumn,
  statusColumn,
  { id: 'action', accessorKey: 'action', header: 'Your action', meta: { width: '11rem', nowrap: true } },
  { id: 'actions', meta: { actions: true }, cell: waitingMenu }
];

/** Quick actions of a checked-out document (subject to permissions): Check in · Cancel check-out. */
export const checkoutMenu = () => html`
  <sl-menu>
    <sl-menu-item value="checkin"><sl-icon slot="prefix" name="box-arrow-in-left"></sl-icon>Check in</sl-menu-item>
    <sl-menu-item value="cancel"><sl-icon slot="prefix" name="x-lg"></sl-icon>Cancel check-out</sl-menu-item>
  </sl-menu>
`;

export const checkoutColumns = [
  objectColumn,
  statusColumn,
  { id: 'actions', meta: { actions: true }, cell: checkoutMenu }
];
