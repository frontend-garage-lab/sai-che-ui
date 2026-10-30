/*
 * DACS-Toolbar — mock data shared by the navigation proposals (P1–P5) of application_screenshot/DACS - Toolbar.
 * Folders, documents and statuses are transcribed from 1-DocList-Toolbar.png, 4-DocProperties.png and
 * 7-AddWBS-PlanShopDwgs.png. Values hidden in the screenshots are "—".
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentCell, revisionFileIcon, revisionTag, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Folders (legacy Browser tree)

/** Current folder of the Doc List: Yard Projects › Central › 000001 - Yard Training › Document Management › Shop Drawings › AS - ANODE SLED */
export const path = [
  'Yard Projects',
  'Central',
  '000001 - Yard Training',
  'Document Management',
  'Shop Drawings',
  'AS - ANODE SLED'
];

export const sites = ['Ambriz', 'Arbatax', 'Central', 'Dammam', 'Karimun', 'Nigeria'];

export const projectAreas = ['Completion Management', 'Document Management'];

export const documentFolders = [
  '250FolderCustom',
  'CFLD0127',
  'CustFLD0337',
  'CustomFLD27',
  'Design Documents',
  'External Documents',
  'Generic Documents',
  'hi_2105',
  'Project Documents',
  'ProvaDome',
  'sadfg',
  'Shop Drawings',
  'spm_yip_job_doc',
  'Template Documents',
  'Test Folder'
];

// ------------------------------------------------------------------ Doc List (146 documents, first rows as shown)

/** Legacy flags: green Verified / Issued, red Rejected / Draft, grey Approved. */
const DOC_STATUS = {
  Verified: 'success',
  Issued: 'primary',
  Approved: 'success',
  Draft: 'neutral',
  'Rejected by Verifier': 'danger'
};

/** Document identification and title only where a screenshot shows them (1, 2, 4); the others are "—". */
const doc = (name, version, status, din = '—', title = '—') => ({ name, version, status, din, title, format: 'pdf' });

export const docs = [
  doc('test2.pdf', '0.1', 'Verified', '2558'),
  doc('000001-LT-4B-P-ITR-Rev00', '1.3', 'Rejected by Verifier', '12347', '202456'),
  doc('test_dacs_1014', '1.0', 'Approved'),
  doc('2000279862-I-1000152317-001_Rev1.pdf', '0.1', 'Draft'),
  doc('AAA_test_pdf.pdf', '0.1', 'Issued'),
  doc('Bulk_Test_29.pdf', '0.1', 'Draft'),
  doc('TestingBulkDoc_1', '1.0', 'Approved'),
  doc('TestingBulkDoc_0', '1.0', 'Approved'),
  doc('testingdoc_1312_2', '1.0', 'Approved'),
  doc('testingdoc_1312_1', '3.0', 'Approved'),
  doc('testingdoc_1312_0', '2.0', 'Approved')
];

export const isSelectedDoc = row => row.name === 'test2.pdf';

const docMenu = () => html`
  <sl-menu>
    <sl-menu-item><sl-icon slot="prefix" name="printer"></sl-icon>Print without watermark</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item><sl-icon slot="prefix" name="x-lg"></sl-icon>Remove from selection</sl-menu-item>
    <sl-menu-item><sl-icon slot="prefix" name="link-45deg"></sl-icon>Copy link for transmittal</sl-menu-item>
    <sl-menu-item><sl-icon slot="prefix" name="star"></sl-icon>Add to favorites</sl-menu-item>
    <sl-menu-item><sl-icon slot="prefix" name="lock"></sl-icon>Turn off confidential</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item><sl-icon slot="prefix" name="geo-alt"></sl-icon>Locate</sl-menu-item>
    <sl-menu-item><sl-icon slot="prefix" name="envelope"></sl-icon>Send mail</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item><sl-icon slot="prefix" name="gear"></sl-icon>Admin actions</sl-menu-item>
    <sl-menu-item><sl-icon slot="prefix" name="three-dots"></sl-icon>Actions</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item><sl-icon slot="prefix" name="info-circle"></sl-icon>Properties</sl-menu-item>
  </sl-menu>
`;

/** Document cell: name + only the references the legacy shows (no "—" meta lines). */
const docCell = record => documentCell(record.name, ...[record.din, record.title].filter(v => v && v !== '—'));

const docStatus = ({ row }) =>
  html`<sl-status filled size="small" variant=${DOC_STATUS[row.original.status]}>${row.original.status}</sl-status>`;

/** Same structure as the Documents table of the other flows (documentColumns in _shared/restyle.js). */
export const docColumns = [
  { id: 'info', header: 'Quick info', meta: { width: '5.5rem' }, cell: revisionFileIcon },
  {
    id: 'document',
    accessorKey: 'name',
    header: 'Document',
    enableSorting: true,
    meta: { width: 'minmax(16rem, 1fr)' },
    cell: ({ row }) => docCell(row.original)
  },
  { id: 'status', header: 'Status', meta: { width: '11rem' }, cell: docStatus },
  { id: 'version', accessorKey: 'version', header: 'Ver.', meta: { width: '5rem' } },
  { id: 'actions', meta: { actions: true }, cell: docMenu }
];

/** File type of a document (same names and labels as the Quick info icon of the other flows). */
const FILE_TYPE = { pdf: { name: 'file-earmark-pdf', label: 'PDF' } };

/** Proposal "file avatar": the file icon leads the document cell instead of sitting in a Quick info column. */
const docAvatarCell = record => {
  const file = FILE_TYPE[record.format];
  return html`<span class="rs-doc-cell"
    >${file ? html`<sl-icon class="rs-doc-cell__icon" name=${file.name} label=${file.label}></sl-icon>` : ''}${docCell(
      record
    )}</span
  >`;
};

const withFileAvatar = columns =>
  columns
    .filter(column => column.id !== 'info')
    .map(column => (column.id === 'document' ? { ...column, cell: ({ row }) => docAvatarCell(row.original) } : column));

// ------------------------------------------------------------------ Detail panel › Revisions (4-DocProperties.png)

export const revisions = [
  { name: 'test2.pdf', din: '2558', title: '—', code: '01', status: 'Working', version: '0.1', format: 'pdf' }
];

/** Same structure as documentRevisionColumns of the other flows. */
export const revisionColumns = [
  { id: 'info', header: '', meta: { width: '4rem' }, cell: revisionFileIcon },
  {
    id: 'document',
    header: 'Document',
    cell: ({ row }) => docCell(row.original)
  },
  {
    id: 'status',
    header: 'Revision status',
    meta: { width: '8rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: 'Rev.',
    meta: { width: '4rem' },
    cell: ({ row }) => revisionTag(row.original.code)
  },
  { id: 'version', accessorKey: 'version', header: 'Ver.', meta: { width: '5rem' } },
  { id: 'actions', meta: { actions: true }, cell: docMenu }
];

/** Proposal "file avatar" (P1, P2): same columns without Quick info, the file icon leads the document cell. */
export const docColumnsFileAvatar = withFileAvatar(docColumns);
export const revisionColumnsFileAvatar = withFileAvatar(revisionColumns);
