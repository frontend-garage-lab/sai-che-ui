/*
 * DACS-Toolbar — mock data shared by the navigation proposals (P1–P5) of application_screenshot/DACS - Toolbar.
 * Folders, documents and statuses are transcribed from 1-DocList-Toolbar.png, 4-DocProperties.png and
 * 7-AddWBS-PlanShopDwgs.png. Values hidden in the screenshots are "—".
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentFileCell, revisionTag, statusTag } from '../_shared/restyle.js';
import { selectedColumns, selectedDocMenu } from '../DMS-MyWork/data.js';

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

/** Selected Docs tab (2-SelectedDocs.png): the user's collected documents. */
export const selectedDocs = docs.filter(d => ['000001-LT-4B-P-ITR-Rev00', 'test2.pdf'].includes(d.name));

export const isSelectedDoc = row => row.name === 'test2.pdf';

/** Row menu (⋮): same as the Selected docs page of DMS-MyWork. */
const docMenu = selectedDocMenu;

/** Shared document cell (DECISIONS "Cella documento con file"): file icon, name, references without "—" lines. */
const docCell = record =>
  documentFileCell(record.format, record.name, ...[record.din, record.title].filter(v => v && v !== '—'));

const docStatus = ({ row }) =>
  html`<sl-status filled size="small" variant=${DOC_STATUS[row.original.status]}>${row.original.status}</sl-status>`;

/** Same structure as the Documents table of the other flows (documentColumns in _shared/restyle.js). */
export const docColumns = [
  {
    id: 'document',
    accessorKey: 'name',
    header: 'Document',
    enableSorting: true,
    meta: { width: 'minmax(16rem, 1fr)' },
    cell: ({ row }) => docCell(row.original)
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    meta: { width: '11rem' },
    cell: docStatus
  },
  { id: 'version', accessorKey: 'version', header: 'Ver.', enableSorting: true, meta: { width: '5rem' } },
  { id: 'actions', meta: { actions: true }, cell: docMenu }
];

// ------------------------------------------------------------------ Detail panel › Revisions (4-DocProperties.png)

export const revisions = [
  { name: 'test2.pdf', din: '2558', title: '—', code: '01', status: 'Working', version: '0.1', format: 'pdf' }
];

/** Same structure as documentRevisionColumns of the other flows. */
export const revisionColumns = [
  {
    id: 'document',
    accessorKey: 'name',
    header: 'Document',
    enableSorting: true,
    cell: ({ row }) => docCell(row.original)
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Revision status',
    enableSorting: true,
    meta: { width: '8rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: 'Rev.',
    enableSorting: true,
    meta: { width: '4rem' },
    cell: ({ row }) => revisionTag(row.original.code)
  },
  { id: 'version', accessorKey: 'version', header: 'Ver.', enableSorting: true, meta: { width: '5rem' } },
  { id: 'actions', meta: { actions: true }, cell: docMenu }
];

/** Aliases kept for the pages that adopted the shared document cell first (P1, P2). */
export const docColumnsFileAvatar = docColumns;
export const revisionColumnsFileAvatar = revisionColumns;

// ------------------------------------------------------------------ Shell of DMS-MyWork/2-SelectedDocs.html

/**
 * The screens of the OLD with Selected Docs active (2, 3, 5, 6, 7, 14) use the shell of DMS-MyWork/2-SelectedDocs.html:
 * same header, sidebar, title, toolbar and columns. Only the data is the one of the OLD (2 documents, on screen order).
 */
const shellRow = (record, meta) => ({
  document: record.name,
  meta,
  type: 'Shop Drawing',
  revision: record.version,
  status: record.status,
  project: '000001'
});

export const shellDocs = [shellRow(docs[1], [docs[1].din, docs[1].title]), shellRow(docs[0], [docs[0].din])];

/** Pages with one document selected (test2.pdf); S6 selects both. */
export const isShellTicked = row => row.document === 'test2.pdf';
export const isShellAllTicked = () => true;

/** Columns of the shell; the OLD has the document version and its own status flags. */
export const shellColumns = selectedColumns.map(column => {
  if (column.id === 'revision') {
    return { ...column, header: 'Ver.', cell: ({ row }) => row.original.revision };
  }
  if (column.id === 'status') return { ...column, cell: docStatus };
  return column;
});
